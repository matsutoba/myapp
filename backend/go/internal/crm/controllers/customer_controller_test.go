package controllers_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	commonerrors "github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/crm/controllers"
	"github.com/matsubara/myapp/internal/crm/dto"
	"github.com/matsubara/myapp/internal/crm/models"
	"github.com/matsubara/myapp/internal/crm/services/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type CustomerTestEnv struct {
	Router             *gin.Engine
	MockService        *mocks.CustomerService
	CustomerController *controllers.CustomerController
}

func SetupCustomerTestEnv() *CustomerTestEnv {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := new(mocks.CustomerService)
	customerController := controllers.NewCustomerController(mockService)

	return &CustomerTestEnv{
		Router:             router,
		MockService:        mockService,
		CustomerController: customerController,
	}
}

func TestCustomerController_GetCustomers(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.GET("/customers", env.CustomerController.GetCustomers)

	mockCustomers := []models.Customer{
		{ID: 1, Name: "Acme Inc.", Email: "contact@acme.example", Phone: "000-1111", Address: "Tokyo"},
		{ID: 2, Name: "Globex", Email: "info@globex.example", Phone: "000-2222", Address: "Osaka"},
	}
	env.MockService.On("GetAllCustomers").Return(mockCustomers, nil)

	req, _ := http.NewRequest(http.MethodGet, "/customers", nil)
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp []dto.CustomerListResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Len(t, resp, 2)
	assert.Equal(t, uint(1), resp[0].ID)
	assert.Equal(t, "Acme Inc.", resp[0].Name)
	assert.Equal(t, "contact@acme.example", resp[0].Email)
	assert.Equal(t, "000-1111", resp[0].Phone)

	env.MockService.AssertExpectations(t)
}

func TestCustomerController_GetCustomers_Empty_Returns200(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.GET("/customers", env.CustomerController.GetCustomers)

	env.MockService.On("GetAllCustomers").Return([]models.Customer{}, nil)

	req, _ := http.NewRequest(http.MethodGet, "/customers", nil)
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp []dto.CustomerListResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Len(t, resp, 0)

	env.MockService.AssertExpectations(t)
}

func TestCustomerController_GetCustomerByID(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.GET("/customers/:id", env.CustomerController.GetCustomerByID)

	mockCustomer := &models.Customer{ID: 1, Name: "Acme Inc.", Email: "contact@acme.example", Phone: "000-1111", Address: "Tokyo"}
	env.MockService.On("FindByID", uint(1)).Return(mockCustomer, nil)

	req, _ := http.NewRequest(http.MethodGet, "/customers/1", nil)
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp dto.CustomerResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Equal(t, uint(1), resp.ID)
	assert.Equal(t, "Acme Inc.", resp.Name)
	assert.Equal(t, "contact@acme.example", resp.Email)

	env.MockService.AssertExpectations(t)
}

func TestCustomerController_GetCustomerByID_NotFound(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.GET("/customers/:id", env.CustomerController.GetCustomerByID)

	env.MockService.On("FindByID", uint(404)).Return(nil, commonerrors.AppErrCustomerNotFound)

	req, _ := http.NewRequest(http.MethodGet, "/customers/404", nil)
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	// NotFound は 404 を返す
	assert.Equal(t, http.StatusNotFound, w.Code)

	env.MockService.AssertExpectations(t)
}

func TestCustomerController_GetCustomerByID_InternalError(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.GET("/customers/:id", env.CustomerController.GetCustomerByID)

	env.MockService.On("FindByID", uint(500)).Return(nil, assert.AnError)

	req, _ := http.NewRequest(http.MethodGet, "/customers/500", nil)
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	env.MockService.AssertExpectations(t)
}

func TestCustomerController_CreateCustomer(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.POST("/customers", env.CustomerController.CreateCustomer)

	newCustomer := &models.Customer{ID: 10, Name: "New Co.", Email: "new@example.com", Phone: "090-0000-0000", Address: "Nagoya"}
	env.MockService.On("CreateCustomer", mock.AnythingOfType("dto.CreateCustomerRequest")).Return(newCustomer, nil)

	body := `{"name":"New Co.","email":"new@example.com","address":"Nagoya","phone":"090-0000-0000"}`
	req, _ := http.NewRequest(http.MethodPost, "/customers", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	var resp dto.CustomerResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Equal(t, uint(10), resp.ID)
	assert.Equal(t, "New Co.", resp.Name)
	assert.Equal(t, "new@example.com", resp.Email)

	env.MockService.AssertExpectations(t)
}

func TestCustomerController_CreateCustomer_Conflict_Returns409(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.POST("/customers", env.CustomerController.CreateCustomer)

	env.MockService.On("CreateCustomer", mock.AnythingOfType("dto.CreateCustomerRequest")).Return((*models.Customer)(nil), commonerrors.AppErrCustomerAlreadyExists)

	body := `{"name":"Acme Inc.","email":"contact@acme.example","address":"Tokyo","phone":"000-1111"}`
	req, _ := http.NewRequest(http.MethodPost, "/customers", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusConflict, w.Code)
	env.MockService.AssertExpectations(t)
}

func TestCustomerController_UpdateCustomer(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.PUT("/customers/:id", env.CustomerController.UpdateCustomer)

	updated := &models.Customer{ID: 1, Name: "Acme K.K.", Email: "contact@acme.example", Phone: "000-9999", Address: "Tokyo"}
	env.MockService.On("UpdateCustomer", uint(1), mock.AnythingOfType("dto.UpdateCustomerRequest")).Return(updated, nil)

	body := `{"name":"Acme K.K.","email":"contact@acme.example","address":"Tokyo","phone":"000-9999"}`
	req, _ := http.NewRequest(http.MethodPut, "/customers/1", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)
	env.MockService.AssertExpectations(t)
}

func TestCustomerController_UpdateCustomer_InvalidID(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.PUT("/customers/:id", env.CustomerController.UpdateCustomer)

	body := `{"name":"Acme K.K.","email":"contact@acme.example","address":"Tokyo","phone":"000-9999"}`
	req, _ := http.NewRequest(http.MethodPut, "/customers/invalid", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	env.MockService.AssertExpectations(t)
}

func TestCustomerController_UpdateCustomer_Error(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.PUT("/customers/:id", env.CustomerController.UpdateCustomer)

	env.MockService.On("UpdateCustomer", uint(99), mock.AnythingOfType("dto.UpdateCustomerRequest")).Return(nil, assert.AnError)

	body := `{"name":"Acme K.K.","email":"contact@acme.example","address":"Tokyo","phone":"000-9999"}`
	req, _ := http.NewRequest(http.MethodPut, "/customers/99", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	env.MockService.AssertExpectations(t)
}

func TestCustomerController_UpdateCustomer_NotFound_Returns404(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.PUT("/customers/:id", env.CustomerController.UpdateCustomer)

	env.MockService.On("UpdateCustomer", uint(404), mock.AnythingOfType("dto.UpdateCustomerRequest")).Return(nil, commonerrors.AppErrCustomerNotFound)

	body := `{"name":"Acme K.K.","email":"contact@acme.example","address":"Tokyo","phone":"000-9999"}`
	req, _ := http.NewRequest(http.MethodPut, "/customers/404", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	env.MockService.AssertExpectations(t)
}

func TestCustomerController_DeleteCustomer(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.DELETE("/customers/:id", env.CustomerController.DeleteCustomer)

	env.MockService.On("DeleteCustomer", uint(1)).Return(nil)

	req, _ := http.NewRequest(http.MethodDelete, "/customers/1", nil)
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)
	env.MockService.AssertExpectations(t)
}

func TestCustomerController_DeleteCustomer_InvalidID(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.DELETE("/customers/:id", env.CustomerController.DeleteCustomer)

	req, _ := http.NewRequest(http.MethodDelete, "/customers/invalid", nil)
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	env.MockService.AssertExpectations(t)
}

func TestCustomerController_DeleteCustomer_Error(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.DELETE("/customers/:id", env.CustomerController.DeleteCustomer)

	env.MockService.On("DeleteCustomer", uint(999)).Return(assert.AnError)

	req, _ := http.NewRequest(http.MethodDelete, "/customers/999", nil)
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	env.MockService.AssertExpectations(t)
}

func TestCustomerController_DeleteCustomer_NotFound_ShouldNoContent(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.DELETE("/customers/:id", env.CustomerController.DeleteCustomer)

	env.MockService.On("DeleteCustomer", uint(777)).Return(commonerrors.ErrNotFound)

	req, _ := http.NewRequest(http.MethodDelete, "/customers/777", nil)
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)
	env.MockService.AssertExpectations(t)
}

func TestCustomerController_DeleteCustomer_NotFound_AppErr_ShouldNoContent(t *testing.T) {
	env := SetupCustomerTestEnv()
	env.Router.DELETE("/customers/:id", env.CustomerController.DeleteCustomer)

	env.MockService.On("DeleteCustomer", uint(778)).Return(commonerrors.AppErrCustomerNotFound)

	req, _ := http.NewRequest(http.MethodDelete, "/customers/778", nil)
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)
	env.MockService.AssertExpectations(t)
}
