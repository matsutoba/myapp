package mocks

import (
	"github.com/matsubara/myapp/internal/domain"
	"github.com/matsubara/myapp/internal/user/dto"
	"github.com/stretchr/testify/mock"
)

type UserService struct {
	mock.Mock
}

func (m *UserService) GetAllUsers() ([]domain.User, error) {
	args := m.Called()
	users, _ := args.Get(0).([]domain.User)
	return users, args.Error(1)
}

func (m *UserService) GetUsers(skip int, take int) ([]domain.User, int64, error) {
	args := m.Called(skip, take)
	users, _ := args.Get(0).([]domain.User)
	total, _ := args.Get(1).(int64)
	return users, total, args.Error(2)
}

func (m *UserService) FindUserByID(id uint) (*domain.User, error) {
	args := m.Called(id)
	user, _ := args.Get(0).(*domain.User)
	return user, args.Error(1)
}

func (m *UserService) FindUserByEmail(email string) (*domain.User, error) {
	args := m.Called(email)
	user, _ := args.Get(0).(*domain.User)
	return user, args.Error(1)
}

func (m *UserService) CreateUser(user dto.CreateUserRequest) (*domain.User, error) {
	args := m.Called(user)
	created, _ := args.Get(0).(*domain.User)
	return created, args.Error(1)
}

func (m *UserService) UpdateUser(id uint, user dto.UpdateUserRequest) (*domain.User, error) {
	args := m.Called(id, user)
	updated, _ := args.Get(0).(*domain.User)
	return updated, args.Error(1)
}

func (m *UserService) DeleteUser(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}
