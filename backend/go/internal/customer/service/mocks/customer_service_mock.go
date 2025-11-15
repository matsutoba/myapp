package mocks

import (
	"github.com/matsubara/myapp/internal/customer/dto"
	"github.com/matsubara/myapp/internal/domain"
	"github.com/stretchr/testify/mock"
)

type CustomerService struct {
	mock.Mock
}

func (m *CustomerService) GetAllCustomers() ([]domain.Customer, error) {
	args := m.Called()
	customers, _ := args.Get(0).([]domain.Customer)
	return customers, args.Error(1)
}

func (m *CustomerService) FindByID(id uint) (*domain.Customer, error) {
	args := m.Called(id)
	customer, _ := args.Get(0).(*domain.Customer)
	return customer, args.Error(1)
}

func (m *CustomerService) CreateCustomer(input dto.CreateCustomerRequest) (*domain.Customer, error) {
	args := m.Called(input)
	created, _ := args.Get(0).(*domain.Customer)
	return created, args.Error(1)
}

func (m *CustomerService) UpdateCustomer(id uint, input dto.UpdateCustomerRequest) (*domain.Customer, error) {
	args := m.Called(id, input)
	updated, _ := args.Get(0).(*domain.Customer)
	return updated, args.Error(1)
}

func (m *CustomerService) DeleteCustomer(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}
