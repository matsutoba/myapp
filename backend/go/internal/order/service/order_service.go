package service

import (
	"time"

	commonerrors "github.com/matsubara/myapp/internal/common/errors"
	custsvc "github.com/matsubara/myapp/internal/customer/service"
	"github.com/matsubara/myapp/internal/domain"
	"github.com/matsubara/myapp/internal/order/dto"
	"github.com/matsubara/myapp/internal/order/repository"
)

type OrderService interface {
	GetOrdersByCustomer(customerID uint, limit int, offset int) (interface{}, error)
	GetOrders(limit int, offset int) ([]domain.Order, error)
	CountOrders(count *int64) error
	GetAggregates(start time.Time, end time.Time, period string, status string, category string) ([]repository.OrderAggregateRow, error)
	GetOrderByID(id uint) (*domain.Order, error)
	CreateOrder(input dto.CreateOrderRequest) (*domain.Order, error)
	UpdateOrder(id uint, input dto.UpdateOrderRequest) (*domain.Order, error)
	DeleteOrder(id uint) error
}

type orderService struct {
	repo    repository.OrderRepository
	custSvc custsvc.CustomerService
}

func NewOrderService(r repository.OrderRepository, cs custsvc.CustomerService) OrderService {
	return &orderService{repo: r, custSvc: cs}
}

func (s *orderService) GetOrdersByCustomer(customerID uint, limit int, offset int) (interface{}, error) {
	return s.repo.GetByCustomer(customerID, limit, offset)
}

func (s *orderService) GetOrders(limit int, offset int) ([]domain.Order, error) {
	return s.repo.GetAll(limit, offset)
}

func (s *orderService) GetOrderByID(id uint) (*domain.Order, error) {
	return s.repo.FindByID(id)
}

func (s *orderService) CountOrders(count *int64) error {
	c, err := s.repo.CountAll()
	if err != nil {
		return err
	}
	*count = c
	return nil
}

func (s *orderService) GetAggregates(start time.Time, end time.Time, period string, status string, category string) ([]repository.OrderAggregateRow, error) {
	return s.repo.Aggregate(start, end, period, status, category)
}

func (s *orderService) CreateOrder(input dto.CreateOrderRequest) (*domain.Order, error) {
	// Validate customer existence
	if _, err := s.custSvc.FindByID(input.CustomerID); err != nil {
		return nil, commonerrors.AppErrCustomerNotFound
	}

	o := &domain.Order{
		CustomerID:   input.CustomerID,
		Amount:       input.Amount,
		Currency:     input.Currency,
		ItemsCount:   input.ItemsCount,
		OrderChannel: input.OrderChannel,
		Category:     input.Category,
		Status:       input.Status,
	}
	return s.repo.Create(o)
}

func (s *orderService) UpdateOrder(id uint, input dto.UpdateOrderRequest) (*domain.Order, error) {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if input.Amount != nil {
		existing.Amount = *input.Amount
	}
	if input.Currency != nil {
		existing.Currency = *input.Currency
	}
	if input.ItemsCount != nil {
		existing.ItemsCount = *input.ItemsCount
	}
	if input.OrderChannel != nil {
		existing.OrderChannel = *input.OrderChannel
	}
	if input.Category != nil {
		existing.Category = *input.Category
	}
	if input.Status != nil {
		existing.Status = *input.Status
	}
	existing.UpdatedAt = time.Now()
	return s.repo.Update(existing)
}

func (s *orderService) DeleteOrder(id uint) error {
	return s.repo.Delete(id)
}
