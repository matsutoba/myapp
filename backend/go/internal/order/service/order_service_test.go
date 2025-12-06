package service_test

import (
	"testing"
	"time"

	custdto "github.com/matsubara/myapp/internal/customer/dto"
	"github.com/matsubara/myapp/internal/domain"
	orderdto "github.com/matsubara/myapp/internal/order/dto"
	"github.com/matsubara/myapp/internal/order/repository"
	svc "github.com/matsubara/myapp/internal/order/service"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// mock repository implementing repository.OrderRepository
type mockRepo struct{}

func (m *mockRepo) GetByCustomer(customerID uint, limit int, offset int) ([]domain.Order, error) {
	o1 := domain.Order{ID: 1, CustomerID: customerID, Amount: 1000, Currency: "JPY", ItemsCount: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	o2 := domain.Order{ID: 2, CustomerID: customerID, Amount: 2000, Currency: "JPY", ItemsCount: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	return []domain.Order{o1, o2}, nil
}

func (m *mockRepo) Aggregate(start time.Time, end time.Time, period string, status string, category string) ([]repository.OrderAggregateRow, error) {
	rows := []repository.OrderAggregateRow{
		{Period: "2025-01-01", Total: 3000.0, Count: 2, Avg: 1500.0},
	}
	return rows, nil
}

// mock customer service
type mockCustomerService struct{}

func (m *mockCustomerService) GetAllCustomers() ([]domain.Customer, error) { return nil, nil }
func (m *mockCustomerService) FindByID(id uint) (*domain.Customer, error) {
	return &domain.Customer{ID: id}, nil
}
func (m *mockCustomerService) GetCustomers(skip int, take int, keyword string) ([]domain.Customer, int64, error) {
	return nil, 0, nil
}
func (m *mockCustomerService) CreateCustomer(customer custdto.CreateCustomerRequest) (*domain.Customer, error) {
	return nil, nil
}
func (m *mockCustomerService) UpdateCustomer(id uint, customer custdto.UpdateCustomerRequest) (*domain.Customer, error) {
	return nil, nil
}
func (m *mockCustomerService) DeleteCustomer(id uint) error { return nil }

func TestGetOrdersByCustomer_PassesThrough(t *testing.T) {
	mr := &mockRepo{}
	cs := &mockCustomerService{}
	s := svc.NewOrderService(mr, cs)

	res, err := s.GetOrdersByCustomer(42, 10, 0)
	require.NoError(t, err)

	// service returns interface{} that should be underlying []domain.Order
	orders, ok := res.([]domain.Order)
	require.True(t, ok, "expected []domain.Order")
	require.Len(t, orders, 2)
	require.Equal(t, uint(42), orders[0].CustomerID)
}

func TestGetAggregates_PassesThrough(t *testing.T) {
	mr := &mockRepo{}
	cs := &mockCustomerService{}
	s := svc.NewOrderService(mr, cs)

	start := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(2025, 1, 31, 23, 59, 59, 0, time.UTC)
	rows, err := s.GetAggregates(start, end, "day", "", "")
	require.NoError(t, err)
	require.Len(t, rows, 1)
	require.Equal(t, "2025-01-01", rows[0].Period)
	require.InEpsilon(t, 3000.0, rows[0].Total, 0.0001)
}

// Extend mock to support create/update/delete
func (m *mockRepo) Create(order *domain.Order) (*domain.Order, error) {
	order.ID = 123
	return order, nil
}

func (m *mockRepo) Update(order *domain.Order) (*domain.Order, error) {
	// pretend updated
	order.UpdatedAt = time.Now()
	return order, nil
}

func (m *mockRepo) Delete(id uint) error {
	if id == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (m *mockRepo) FindByID(id uint) (*domain.Order, error) {
	if id == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	o := &domain.Order{ID: id, CustomerID: 1, Amount: 1000, Currency: "JPY", ItemsCount: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	return o, nil
}

func (m *mockRepo) CountAll() (int64, error) {
	return 2, nil
}

// Search-related stubs
func (m *mockRepo) CountSearch(q string) (int64, error) {
	return 2, nil
}

func (m *mockRepo) Search(q string, limit int, offset int) ([]domain.Order, error) {
	return m.GetAll(limit, offset)
}

func (m *mockRepo) GetAll(limit int, offset int) ([]domain.Order, error) {
	o1 := domain.Order{ID: 1, CustomerID: 1, Amount: 1000, Currency: "JPY", ItemsCount: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	o2 := domain.Order{ID: 2, CustomerID: 2, Amount: 2000, Currency: "JPY", ItemsCount: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	return []domain.Order{o1, o2}, nil
}

func TestCreateUpdateDeleteOrder_Service(t *testing.T) {
	mr := &mockRepo{}
	cs := &mockCustomerService{}
	s := svc.NewOrderService(mr, cs)

	// create
	req := orderdto.CreateOrderRequest{CustomerID: 1, Amount: 1200, Currency: "JPY"}
	created, err := s.CreateOrder(req)
	require.NoError(t, err)
	require.NotNil(t, created)

	// update
	updReq := orderdto.UpdateOrderRequest{Amount: func() *float64 { v := 1300.0; return &v }()}
	updated, err := s.UpdateOrder(123, updReq)
	require.NoError(t, err)
	require.Equal(t, 1300.0, updated.Amount)

	// delete success
	require.NoError(t, s.DeleteOrder(123))
	// delete not found
	err = s.DeleteOrder(0)
	require.Error(t, err)
}

func TestGetOrdersAndCount_Service(t *testing.T) {
	mr := &mockRepo{}
	cs := &mockCustomerService{}
	s := svc.NewOrderService(mr, cs)

	// GetOrders
	orders, err := s.GetOrders(10, 0)
	require.NoError(t, err)
	require.Len(t, orders, 2)

	// CountOrders
	var cnt int64
	require.NoError(t, s.CountOrders(&cnt))
	require.EqualValues(t, 2, cnt)
}

func TestGetOrderByID_Service(t *testing.T) {
	mr := &mockRepo{}
	cs := &mockCustomerService{}
	s := svc.NewOrderService(mr, cs)

	// success
	o, err := s.GetOrderByID(1)
	require.NoError(t, err)
	require.NotNil(t, o)

	// not found
	_, err = s.GetOrderByID(0)
	require.Error(t, err)
}
