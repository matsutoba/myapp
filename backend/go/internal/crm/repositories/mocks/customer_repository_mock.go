package mocks

import (
	"github.com/matsubara/myapp/internal/crm/models"
	"github.com/stretchr/testify/mock"
)

type CustomerRepository struct {
	mock.Mock
}

func (m *CustomerRepository) Create(customer models.Customer) (*models.Customer, error) {
	args := m.Called(customer)
	created, _ := args.Get(0).(*models.Customer)
	return created, args.Error(1)
}

func (m *CustomerRepository) GetAll() ([]models.Customer, error) {
	args := m.Called()
	customers, _ := args.Get(0).([]models.Customer)
	return customers, args.Error(1)
}

func (m *CustomerRepository) FindByID(id uint) (*models.Customer, error) {
	args := m.Called(id)
	customer, _ := args.Get(0).(*models.Customer)
	return customer, args.Error(1)
}

func (m *CustomerRepository) Update(customer models.Customer) (*models.Customer, error) {
	args := m.Called(customer)
	return &customer, args.Error(1)
}

func (m *CustomerRepository) Delete(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}
