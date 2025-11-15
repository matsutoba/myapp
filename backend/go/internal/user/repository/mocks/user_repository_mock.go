package mocks

import (
	"github.com/matsubara/myapp/internal/domain"
	"github.com/stretchr/testify/mock"
)

type UserRepository struct {
	mock.Mock
}

func (m *UserRepository) FindByEmail(email string) (*domain.User, error) {
	args := m.Called(email)
	user, _ := args.Get(0).(*domain.User)
	return user, args.Error(1)
}

func (m *UserRepository) Create(user domain.User) (*domain.User, error) {
	args := m.Called(user)
	created, _ := args.Get(0).(*domain.User)
	return created, args.Error(1)
}

func (m *UserRepository) GetAll() ([]domain.User, error) {
	args := m.Called()
	users, _ := args.Get(0).([]domain.User)
	return users, args.Error(1)
}

func (m *UserRepository) FindByID(id uint) (*domain.User, error) {
	args := m.Called(id)
	user, _ := args.Get(0).(*domain.User)
	return user, args.Error(1)
}

func (m *UserRepository) Update(user domain.User) (*domain.User, error) {
	args := m.Called(user)
	return &user, args.Error(1)
}

func (m *UserRepository) Delete(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}
