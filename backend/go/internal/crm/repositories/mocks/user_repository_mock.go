package mocks

import (
	"github.com/matsubara/myapp/internal/crm/models"
	"github.com/stretchr/testify/mock"
)

type UserRepository struct {
	mock.Mock
}

func (m *UserRepository) FindByEmail(email string) (*models.User, error) {
	args := m.Called(email)
	user, _ := args.Get(0).(*models.User)
	return user, args.Error(1)
}

func (m *UserRepository) Create(user models.User) (*models.User, error) {
	args := m.Called(user)
	created, _ := args.Get(0).(*models.User)
	return created, args.Error(1)
}

func (m *UserRepository) GetAll() ([]models.User, error) {
	args := m.Called()
	users, _ := args.Get(0).([]models.User)
	return users, args.Error(1)
}

func (m *UserRepository) FindByID(id uint) (*models.User, error) {
	args := m.Called(id)
	user, _ := args.Get(0).(*models.User)
	return user, args.Error(1)
}

func (m *UserRepository) Update(user models.User) error {
	args := m.Called(user)
	return args.Error(1)
}

func (m *UserRepository) Delete(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}
