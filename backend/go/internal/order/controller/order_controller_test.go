package controller_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/domain"
	ctrl "github.com/matsubara/myapp/internal/order/controller"
	"github.com/matsubara/myapp/internal/order/dto"
	"github.com/matsubara/myapp/internal/order/repository"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// mock service implementing service.OrderService
type mockOrderService struct{}

func (m *mockOrderService) GetOrdersByCustomer(customerID uint, limit int, offset int) (interface{}, error) {
	return []repository.OrderAggregateRow{}, nil
}
func (m *mockOrderService) GetAggregates(start time.Time, end time.Time, period string, status string, category string) ([]repository.OrderAggregateRow, error) {
	rows := []repository.OrderAggregateRow{{Period: "2025-01-01", Total: 1000.0, Count: 1, Avg: 1000.0}}
	return rows, nil
}

func (m *mockOrderService) CountOrders(count *int64) error {
	*count = 0
	return nil
}

// search-related stubs
func (m *mockOrderService) GetOrdersWithQuery(q string, limit int, offset int) ([]domain.Order, error) {
	// reuse GetOrders behavior
	return m.GetOrders(limit, offset)
}

func (m *mockOrderService) CountOrdersWithQuery(q string) (int64, error) {
	return 1, nil
}

func (m *mockOrderService) GetOrderByID(id uint) (*domain.Order, error) {
	if id == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return &domain.Order{ID: id, CustomerID: 1, Amount: 1000, Currency: "JPY", CreatedAt: time.Now(), UpdatedAt: time.Now()}, nil
}

func (m *mockOrderService) GetOrders(limit int, offset int) ([]domain.Order, error) {
	o := domain.Order{ID: 1, CustomerID: 1, Amount: 1000, Currency: "JPY", CreatedAt: time.Now(), UpdatedAt: time.Now(), Customer: domain.Customer{ContactName: "Taro Yamada", Company: "ACME"}}
	return []domain.Order{o}, nil
}

func (m *mockOrderService) CreateOrder(input dto.CreateOrderRequest) (*domain.Order, error) {
	return &domain.Order{ID: 99, CustomerID: input.CustomerID, Amount: input.Amount, Currency: input.Currency, CreatedAt: time.Now(), UpdatedAt: time.Now()}, nil
}

func (m *mockOrderService) UpdateOrder(id uint, input dto.UpdateOrderRequest) (*domain.Order, error) {
	o := &domain.Order{ID: id, CustomerID: 1, Amount: 1000, Currency: "JPY", CreatedAt: time.Now(), UpdatedAt: time.Now()}
	if input.Amount != nil {
		o.Amount = *input.Amount
	}
	return o, nil
}

func (m *mockOrderService) DeleteOrder(id uint) error {
	if id == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func TestGetAggregatesHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockSvc := &mockOrderService{}
	controller := ctrl.NewOrderController(mockSvc)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req := httptest.NewRequest(http.MethodGet, "/?start=2025-01-01&end=2025-01-02&period=day", nil)
	c.Request = req

	controller.GetAggregates(c)
	require.Equal(t, http.StatusOK, w.Code)
	var out []repository.OrderAggregateRow
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &out))
	require.Len(t, out, 1)
	require.Equal(t, "2025-01-01", out[0].Period)
}

func TestGetAggregatesHandler_MissingParams(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockSvc := &mockOrderService{}
	controller := ctrl.NewOrderController(mockSvc)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	c.Request = req

	controller.GetAggregates(c)
	require.Equal(t, http.StatusBadRequest, w.Code)
}

func TestCreateOrderHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockSvc := &mockOrderService{}
	controller := ctrl.NewOrderController(mockSvc)

	reqBody := dto.CreateOrderRequest{CustomerID: 3, Amount: 1500.0, Currency: "JPY"}
	b, _ := json.Marshal(reqBody)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req := httptest.NewRequest(http.MethodPost, "/", bytes.NewBuffer(b))
	req.Header.Set("Content-Type", "application/json")
	c.Request = req

	controller.CreateOrder(c)
	require.Equal(t, http.StatusCreated, w.Code)
	var out domain.Order
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &out))
	require.Equal(t, uint(99), out.ID)
}

func TestUpdateOrderHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockSvc := &mockOrderService{}
	controller := ctrl.NewOrderController(mockSvc)

	upd := dto.UpdateOrderRequest{Amount: func() *float64 { v := 1800.0; return &v }()}
	b, _ := json.Marshal(upd)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req := httptest.NewRequest(http.MethodPut, "/orders/99", bytes.NewBuffer(b))
	req.Header.Set("Content-Type", "application/json")
	c.Request = req
	c.Params = gin.Params{{Key: "id", Value: "99"}}

	controller.UpdateOrder(c)
	require.Equal(t, http.StatusOK, w.Code)
	var out domain.Order
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &out))
	require.Equal(t, 1800.0, out.Amount)
}

func TestDeleteOrderHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockSvc := &mockOrderService{}
	controller := ctrl.NewOrderController(mockSvc)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req := httptest.NewRequest(http.MethodDelete, "/orders/99", nil)
	c.Request = req
	c.Params = gin.Params{{Key: "id", Value: "99"}}

	controller.DeleteOrder(c)
	require.Equal(t, http.StatusNoContent, w.Code)
}

func TestListOrdersHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockSvc := &mockOrderService{}
	controller := ctrl.NewOrderController(mockSvc)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req := httptest.NewRequest(http.MethodGet, "/?limit=10&offset=0", nil)
	c.Request = req

	controller.ListOrders(c)
	require.Equal(t, http.StatusOK, w.Code)
	var out map[string]interface{}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &out))
	require.Contains(t, out, "items")
	require.Contains(t, out, "total")
	// verify companyName present in first item
	items, ok := out["items"].([]interface{})
	require.True(t, ok)
	require.GreaterOrEqual(t, len(items), 1)
	first, ok := items[0].(map[string]interface{})
	require.True(t, ok)
	require.Contains(t, first, "companyName")
	require.Equal(t, "ACME", first["companyName"])
}

func TestGetOrderByIdHandler_SuccessAndNotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockSvc := &mockOrderService{}
	controller := ctrl.NewOrderController(mockSvc)

	// success
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req := httptest.NewRequest(http.MethodGet, "/orders/5", nil)
	c.Request = req
	c.Params = gin.Params{{Key: "id", Value: "5"}}

	controller.GetOrderById(c)
	require.Equal(t, http.StatusOK, w.Code)
	var out domain.Order
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &out))
	require.Equal(t, uint(5), out.ID)

	// not found
	w2 := httptest.NewRecorder()
	c2, _ := gin.CreateTestContext(w2)
	req2 := httptest.NewRequest(http.MethodGet, "/orders/0", nil)
	c2.Request = req2
	c2.Params = gin.Params{{Key: "id", Value: "0"}}

	controller.GetOrderById(c2)
	require.Equal(t, http.StatusNotFound, w2.Code)
}
