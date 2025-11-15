package services_test

import (
	"errors"
	"testing"
	"time"

	"github.com/matsubara/myapp/internal/auth/repositories/mocks"
	"github.com/matsubara/myapp/internal/auth/services"
	appErrors "github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/common/security"
	"github.com/matsubara/myapp/internal/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

func setupAuthService(t *testing.T) (*mocks.AuthRepository, services.AuthService) {
	mockRepo := new(mocks.AuthRepository)
	service := services.NewAuthService(mockRepo)
	t.Cleanup(func() { mockRepo.AssertExpectations(t) })
	return mockRepo, service
}

func TestAuthService_Login_Success(t *testing.T) {
	mockRepo, service := setupAuthService(t)

	// パスワードをハッシュ化
	hashedPassword, _ := security.HashPassword("password123")
	now := time.Now()

	expectedUser := &domain.User{
		ID:          1,
		Name:        "Test User",
		Email:       "test@example.com",
		Password:    hashedPassword,
		Role:        "user",
		IsActive:    true,
		LastLoginAt: &now,
	}

	mockRepo.On("FindUserByEmail", "test@example.com").Return(expectedUser, nil)
	mockRepo.On("UpdateLastLogin", uint(1)).Return(nil)
	mockRepo.On("CreateRefreshToken", uint(1), mock.AnythingOfType("string"), mock.AnythingOfType("time.Time")).Return(nil)

	user, access, refresh, err := service.Login("test@example.com", "password123")

	assert.NoError(t, err)
	assert.NotNil(t, user)
	assert.NotEmpty(t, access)
	assert.NotEmpty(t, refresh)
	assert.Equal(t, "test@example.com", user.Email)
	assert.Equal(t, "Test User", user.Name)
}

func TestAuthService_Login_UserNotFound(t *testing.T) {
	mockRepo, service := setupAuthService(t)

	mockRepo.On("FindUserByEmail", "notfound@example.com").Return(nil, gorm.ErrRecordNotFound)

	user, access, refresh, err := service.Login("notfound@example.com", "password123")

	assert.Nil(t, user)
	assert.Empty(t, access)
	assert.Empty(t, refresh)
	assert.Equal(t, appErrors.ErrUnauthorized, err)
}

func TestAuthService_Login_InactiveUser(t *testing.T) {
	mockRepo, service := setupAuthService(t)

	hashedPassword, _ := security.HashPassword("password123")
	inactiveUser := &domain.User{
		ID:       1,
		Name:     "Inactive User",
		Email:    "inactive@example.com",
		Password: hashedPassword,
		Role:     "user",
		IsActive: false,
	}

	mockRepo.On("FindUserByEmail", "inactive@example.com").Return(inactiveUser, nil)

	user, access, refresh, err := service.Login("inactive@example.com", "password123")

	assert.Nil(t, user)
	assert.Empty(t, access)
	assert.Empty(t, refresh)
	assert.Equal(t, appErrors.ErrUnauthorized, err)
}

func TestAuthService_Login_InvalidPassword(t *testing.T) {
	mockRepo, service := setupAuthService(t)

	hashedPassword, _ := security.HashPassword("correctpassword")
	expectedUser := &domain.User{
		ID:       1,
		Name:     "Test User",
		Email:    "test@example.com",
		Password: hashedPassword,
		Role:     "user",
		IsActive: true,
	}

	mockRepo.On("FindUserByEmail", "test@example.com").Return(expectedUser, nil)

	user, access, refresh, err := service.Login("test@example.com", "wrongpassword")

	assert.Nil(t, user)
	assert.Empty(t, access)
	assert.Empty(t, refresh)
	assert.Equal(t, appErrors.ErrUnauthorized, err)
}

func TestAuthService_Login_RepositoryError(t *testing.T) {
	mockRepo, service := setupAuthService(t)

	mockRepo.On("FindUserByEmail", "error@example.com").Return(nil, errors.New("database error"))

	user, access, refresh, err := service.Login("error@example.com", "password123")

	assert.Nil(t, user)
	assert.Empty(t, access)
	assert.Empty(t, refresh)
	assert.Error(t, err)
	assert.NotEqual(t, appErrors.ErrUnauthorized, err)
}

func TestAuthService_Login_UpdateLastLoginError(t *testing.T) {
	mockRepo, service := setupAuthService(t)

	hashedPassword, _ := security.HashPassword("password123")
	expectedUser := &domain.User{
		ID:       1,
		Name:     "Test User",
		Email:    "test@example.com",
		Password: hashedPassword,
		Role:     "user",
		IsActive: true,
	}

	mockRepo.On("FindUserByEmail", "test@example.com").Return(expectedUser, nil)
	mockRepo.On("UpdateLastLogin", uint(1)).Return(errors.New("update error"))
	mockRepo.On("CreateRefreshToken", uint(1), mock.AnythingOfType("string"), mock.AnythingOfType("time.Time")).Return(nil)

	// UpdateLastLoginのエラーは致命的ではないため、ログインは成功する
	user, access, refresh, err := service.Login("test@example.com", "password123")

	assert.NoError(t, err)
	assert.NotNil(t, user)
	assert.NotEmpty(t, access)
	assert.NotEmpty(t, refresh)
}
