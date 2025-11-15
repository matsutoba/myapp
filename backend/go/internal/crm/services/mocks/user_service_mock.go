package mocks

import (
	"github.com/matsubara/myapp/internal/crm/dto"
	"github.com/matsubara/myapp/internal/crm/models"
	"github.com/stretchr/testify/mock"
)

type UserService struct {
	mock.Mock
}

func (m *UserService) GetAllUsers() ([]models.User, error) {
	args := m.Called()
	users, _ := args.Get(0).([]models.User)
	return users, args.Error(1)
}

func (m *UserService) FindUserByID(id uint) (*models.User, error) {
	args := m.Called(id)
	user, _ := args.Get(0).(*models.User)
	return user, args.Error(1)
}

func (m *UserService) FindUserByEmail(email string) (*models.User, error) {
	args := m.Called(email)
	user, _ := args.Get(0).(*models.User)
	return user, args.Error(1)
}

func (m *UserService) CreateUser(user dto.CreateUserRequest) (*models.User, error) {
	args := m.Called(user)
	created, _ := args.Get(0).(*models.User)
	return created, args.Error(1)
}

func (m *UserService) UpdateUser(id uint, user dto.UpdateUserRequest) (*models.User, error) {
	args := m.Called(id, user)
	updated, _ := args.Get(0).(*models.User)
	return updated, args.Error(1)
}

func (m *UserService) DeleteUser(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}
