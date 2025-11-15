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

type TestEnv struct {
	Router         *gin.Engine
	MockService    *mocks.UserService
	UserController *controllers.UserController
}

func SetupTestEnv() *TestEnv {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := new(mocks.UserService)
	userController := controllers.NewUserController(mockService)

	return &TestEnv{
		Router:         router,
		MockService:    mockService,
		UserController: userController,
	}
}

func TestUserController_GetUsers(t *testing.T) {
	env := SetupTestEnv()
	env.Router.GET("/users", env.UserController.GetUsers)

	mockUsers := []models.User{
		{ID: 1, Name: "Taro", Email: "taro@example.com"},
		{ID: 2, Name: "Jiro", Email: "jiro@example.com"},
	}
	env.MockService.On("GetAllUsers").Return(mockUsers, nil)

	// HTTP リクエストを作成
	req, _ := http.NewRequest(http.MethodGet, "/users", nil)
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証
	assert.Equal(t, http.StatusOK, w.Code)
	var resp []dto.UserListResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Len(t, resp, 2)
	assert.Equal(t, uint(1), resp[0].ID)
	assert.Equal(t, "Taro", resp[0].Name)
	assert.Equal(t, "taro@example.com", resp[0].Email)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestUserController_GetUsers_Empty_Returns200(t *testing.T) {
	env := SetupTestEnv()
	env.Router.GET("/users", env.UserController.GetUsers)

	env.MockService.On("GetAllUsers").Return([]models.User{}, nil)

	req, _ := http.NewRequest(http.MethodGet, "/users", nil)
	w := httptest.NewRecorder()
	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp []dto.UserListResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Len(t, resp, 0)

	env.MockService.AssertExpectations(t)
}

func TestUserController_GetUserByID(t *testing.T) {
	env := SetupTestEnv()
	env.Router.GET("/users/:id", env.UserController.GetUserByID)

	mockUser := &models.User{ID: uint(1), Name: "Taro", Email: "taro@example.com"}
	env.MockService.On("FindUserByID", uint(1)).Return(mockUser, nil)

	// HTTP リクエストを作成
	req, _ := http.NewRequest(http.MethodGet, "/users/1", nil)
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証
	assert.Equal(t, http.StatusOK, w.Code)
	var resp dto.UserResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Equal(t, uint(1), resp.ID)
	assert.Equal(t, "Taro", resp.Name)
	assert.Equal(t, "taro@example.com", resp.Email)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestUserController_GetUserByID_NotFound(t *testing.T) {
	env := SetupTestEnv()
	env.Router.GET("/users/:id", env.UserController.GetUserByID)

	env.MockService.On("FindUserByID", uint(1)).Return(nil, commonerrors.AppErrUserNotFound)

	// HTTP リクエストを作成
	req, _ := http.NewRequest(http.MethodGet, "/users/1", nil)
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証
	assert.Equal(t, http.StatusNotFound, w.Code)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestUserController_GetUserByID_InternalError(t *testing.T) {
	env := SetupTestEnv()
	env.Router.GET("/users/:id", env.UserController.GetUserByID)

	env.MockService.On("FindUserByID", uint(500)).Return(nil, assert.AnError)

	req, _ := http.NewRequest(http.MethodGet, "/users/500", nil)
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証
	assert.Equal(t, http.StatusInternalServerError, w.Code)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestUserController_CreateUser(t *testing.T) {
	env := SetupTestEnv()
	env.Router.POST("/users", env.UserController.CreateUser)

	newUser := &models.User{ID: 1, Name: "Taro", Email: "taro@example.com"}
	env.MockService.On("CreateUser", mock.AnythingOfType("dto.CreateUserRequest")).Return(newUser, nil)

	userJSON := `{"name":"Taro","email":"taro@example.com","password":"password123","role":"user"}`
	req, _ := http.NewRequest(http.MethodPost, "/users", strings.NewReader(userJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証
	assert.Equal(t, http.StatusCreated, w.Code)
	var resp dto.UserResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Equal(t, uint(1), resp.ID)
	assert.Equal(t, "Taro", resp.Name)
	assert.Equal(t, "taro@example.com", resp.Email)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestUserController_CreateUser_Conflict_Returns409(t *testing.T) {
	env := SetupTestEnv()
	env.Router.POST("/users", env.UserController.CreateUser)

	// サービスが重複エラーを返すケースをモック
	env.MockService.On("CreateUser", mock.AnythingOfType("dto.CreateUserRequest")).Return((*models.User)(nil), commonerrors.AppErrUserAlreadyExists)

	userJSON := `{"name":"Taro","email":"taro@example.com","password":"password123","role":"user"}`
	req, _ := http.NewRequest(http.MethodPost, "/users", strings.NewReader(userJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証: 409 Conflict
	assert.Equal(t, http.StatusConflict, w.Code)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestUserController_UpdateUser(t *testing.T) {
	env := SetupTestEnv()
	env.Router.PUT("/users/:id", env.UserController.UpdateUser)

	updatedUser := &models.User{ID: 1, Name: "Taro Updated", Email: "taro.updated@example.com", Role: "admin"}
	env.MockService.On("UpdateUser", uint(1), mock.AnythingOfType("dto.UpdateUserRequest")).Return(updatedUser, nil)

	userJSON := `{"name":"Taro Updated","email":"taro.updated@example.com","password":"newpassword123","role":"admin"}`
	req, _ := http.NewRequest(http.MethodPut, "/users/1", strings.NewReader(userJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証 (204 No Content)
	assert.Equal(t, http.StatusNoContent, w.Code)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestUserController_UpdateUser_InvalidID(t *testing.T) {
	env := SetupTestEnv()
	env.Router.PUT("/users/:id", env.UserController.UpdateUser)

	userJSON := `{"name":"Taro Updated","email":"taro.updated@example.com","role":"admin"}`
	req, _ := http.NewRequest(http.MethodPut, "/users/invalid", strings.NewReader(userJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証 (400 Bad Request)
	assert.Equal(t, http.StatusBadRequest, w.Code)

	// モック呼び出しの検証 (UpdateUserは呼ばれない)
	env.MockService.AssertExpectations(t)
}

func TestUserController_UpdateUser_NotFound(t *testing.T) {
	env := SetupTestEnv()
	env.Router.PUT("/users/:id", env.UserController.UpdateUser)

	env.MockService.On("UpdateUser", uint(999), mock.AnythingOfType("dto.UpdateUserRequest")).Return(nil, commonerrors.AppErrUserNotFound)

	userJSON := `{"name":"Taro Updated","email":"taro.updated@example.com","role":"admin"}`
	req, _ := http.NewRequest(http.MethodPut, "/users/999", strings.NewReader(userJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証 (404 Not Found)
	assert.Equal(t, http.StatusNotFound, w.Code)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestUserController_DeleteUser(t *testing.T) {
	env := SetupTestEnv()
	env.Router.DELETE("/users/:id", env.UserController.DeleteUser)

	env.MockService.On("DeleteUser", uint(1)).Return(nil)

	req, _ := http.NewRequest(http.MethodDelete, "/users/1", nil)
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証 (204 No Content)
	assert.Equal(t, http.StatusNoContent, w.Code)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestUserController_DeleteUser_InvalidID(t *testing.T) {
	env := SetupTestEnv()
	env.Router.DELETE("/users/:id", env.UserController.DeleteUser)

	req, _ := http.NewRequest(http.MethodDelete, "/users/invalid", nil)
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証 (400 Bad Request)
	assert.Equal(t, http.StatusBadRequest, w.Code)

	// モック呼び出しの検証 (DeleteUserは呼ばれない)
	env.MockService.AssertExpectations(t)
}

func TestUserController_DeleteUser_Error(t *testing.T) {
	env := SetupTestEnv()
	env.Router.DELETE("/users/:id", env.UserController.DeleteUser)

	env.MockService.On("DeleteUser", uint(999)).Return(assert.AnError)

	req, _ := http.NewRequest(http.MethodDelete, "/users/999", nil)
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証 (500 Internal Server Error)
	assert.Equal(t, http.StatusInternalServerError, w.Code)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestUserController_DeleteUser_NotFound_ShouldNoContent(t *testing.T) {
	env := SetupTestEnv()
	env.Router.DELETE("/users/:id", env.UserController.DeleteUser)

	env.MockService.On("DeleteUser", uint(777)).Return(commonerrors.ErrNotFound)

	req, _ := http.NewRequest(http.MethodDelete, "/users/777", nil)
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証 (204 No Content)
	assert.Equal(t, http.StatusNoContent, w.Code)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestUserController_DeleteUser_NotFound_AppErr_ShouldNoContent(t *testing.T) {
	env := SetupTestEnv()
	env.Router.DELETE("/users/:id", env.UserController.DeleteUser)

	// サービスが AppErrUserNotFound を返すケースでも 204 にする
	env.MockService.On("DeleteUser", uint(778)).Return(commonerrors.AppErrUserNotFound)

	req, _ := http.NewRequest(http.MethodDelete, "/users/778", nil)
	w := httptest.NewRecorder()

	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)

	env.MockService.AssertExpectations(t)
}
