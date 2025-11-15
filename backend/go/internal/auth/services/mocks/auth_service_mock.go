package mocks

import (
	"github.com/matsubara/myapp/internal/domain"
	"github.com/stretchr/testify/mock"
)

type AuthService struct {
	mock.Mock
}

func (m *AuthService) Login(email, password string) (*domain.User, string, string, error) {
	args := m.Called(email, password)
	if args.Get(0) == nil {
		return nil, "", "", args.Error(3)
	}
	user, _ := args.Get(0).(*domain.User)
	access, _ := args.Get(1).(string)
	refresh, _ := args.Get(2).(string)
	return user, access, refresh, args.Error(3)
}

func (m *AuthService) Refresh(refreshToken string) (*domain.User, string, string, error) {
	args := m.Called(refreshToken)
	if args.Get(0) == nil {
		return nil, "", "", args.Error(3)
	}
	user, _ := args.Get(0).(*domain.User)
	access, _ := args.Get(1).(string)
	refresh, _ := args.Get(2).(string)
	return user, access, refresh, args.Error(3)
}

func (m *AuthService) Logout(refreshToken string) error {
	args := m.Called(refreshToken)
	return args.Error(0)
}
