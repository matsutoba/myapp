package mocks

import (
	"github.com/matsubara/myapp/internal/crm/dto"
	"github.com/matsubara/myapp/internal/crm/models"
	"github.com/stretchr/testify/mock"
)

type CustomerService struct {
	mock.Mock
}

func (m *CustomerService) GetAllCustomers() ([]models.Customer, error) {
	args := m.Called()
	customers, _ := args.Get(0).([]models.Customer)
	return customers, args.Error(1)
}

func (m *CustomerService) FindByID(id uint) (*models.Customer, error) {
	args := m.Called(id)
	customer, _ := args.Get(0).(*models.Customer)
	return customer, args.Error(1)
}

func (m *CustomerService) CreateCustomer(input dto.CreateCustomerRequest) (*models.Customer, error) {
	args := m.Called(input)
	created, _ := args.Get(0).(*models.Customer)
	return created, args.Error(1)
}

func (m *CustomerService) UpdateCustomer(id uint, input dto.UpdateCustomerRequest) (*models.Customer, error) {
	args := m.Called(id, input)
	updated, _ := args.Get(0).(*models.Customer)
	return updated, args.Error(1)
}

func (m *CustomerService) DeleteCustomer(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}
