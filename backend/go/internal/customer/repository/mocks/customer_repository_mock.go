package mocks

import (
	"github.com/matsubara/myapp/internal/domain"
	"github.com/stretchr/testify/mock"
)

type CustomerRepository struct {
	mock.Mock
}

func (m *CustomerRepository) Create(customer domain.Customer) (*domain.Customer, error) {
	args := m.Called(customer)
	created, _ := args.Get(0).(*domain.Customer)
	return created, args.Error(1)
}

func (m *CustomerRepository) GetAll() ([]domain.Customer, error) {
	args := m.Called()
	customers, _ := args.Get(0).([]domain.Customer)
	return customers, args.Error(1)
}

func (m *CustomerRepository) FindByID(id uint) (*domain.Customer, error) {
	args := m.Called(id)
	customer, _ := args.Get(0).(*domain.Customer)
	return customer, args.Error(1)
}

func (m *CustomerRepository) Update(customer domain.Customer) (*domain.Customer, error) {
	args := m.Called(customer)
	return &customer, args.Error(1)
}

func (m *CustomerRepository) Delete(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}
