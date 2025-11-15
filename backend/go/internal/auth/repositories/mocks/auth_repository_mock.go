package mocks

import (
	"time"

	authModels "github.com/matsubara/myapp/internal/auth/models"
	"github.com/matsubara/myapp/internal/domain"
	"github.com/stretchr/testify/mock"
)

type AuthRepository struct {
	mock.Mock
}

func (m *AuthRepository) FindUserByEmail(email string) (*domain.User, error) {
	args := m.Called(email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	user, _ := args.Get(0).(*domain.User)
	return user, args.Error(1)
}

func (m *AuthRepository) UpdateLastLogin(userID uint) error {
	args := m.Called(userID)
	return args.Error(0)
}

func (m *AuthRepository) CreateRefreshToken(userID uint, jti string, expiresAt time.Time) error {
	args := m.Called(userID, jti, expiresAt)
	return args.Error(0)
}

func (m *AuthRepository) GetRefreshTokenByJTI(jti string) (*authModels.RefreshToken, error) {
	args := m.Called(jti)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	rt, _ := args.Get(0).(*authModels.RefreshToken)
	return rt, args.Error(1)
}

func (m *AuthRepository) MarkRefreshTokenUsed(jti string, usedAt time.Time) error {
	args := m.Called(jti, usedAt)
	return args.Error(0)
}

func (m *AuthRepository) RevokeRefreshToken(jti string) error {
	args := m.Called(jti)
	return args.Error(0)
}
