package service_test

import (
	"errors"
	"testing"

	appErrors "github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/domain"
	"github.com/matsubara/myapp/internal/user/dto"
	"github.com/matsubara/myapp/internal/user/repository/mocks"
	svc "github.com/matsubara/myapp/internal/user/service"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func setupUserService(t *testing.T) (*mocks.UserRepository, svc.UserService) {
	mockRepo := new(mocks.UserRepository)
	service := svc.NewUserService(mockRepo)
	t.Cleanup(func() { mockRepo.AssertExpectations(t) })
	return mockRepo, service
}

func TestUserService_CreateUser(t *testing.T) {
	mockRepo, service := setupUserService(t)

	input := dto.CreateUserRequest{
		Name:     "Taro",
		Email:    "taro@example.com",
		Password: "password",
		Role:     "user",
	}

	mockRepo.On("Create", mock.AnythingOfType("domain.User")).Return(&domain.User{
		ID:    1,
		Name:  input.Name,
		Email: input.Email,
		Role:  input.Role,
	}, nil)

	user, err := service.CreateUser(input)

	assert.NoError(t, err)
	assert.Equal(t, input.Email, user.Email)
}

func TestUserService_GetAllUsers(t *testing.T) {
	mockRepo, service := setupUserService(t)

	mockRepo.On("GetAll").Return([]domain.User{
		{ID: 1, Name: "Taro", Email: "taro@example.com"},
		{ID: 2, Name: "Jiro", Email: "jiro@example.com"},
	}, nil)

	users, err := service.GetAllUsers()

	assert.NoError(t, err)
	assert.Len(t, users, 2)
}

func TestUserService_FindUserByID(t *testing.T) {
	mockRepo, service := setupUserService(t)

	mockRepo.On("FindByID", uint(1)).Return(&domain.User{
		ID:    1,
		Name:  "Taro",
		Email: "taro@example.com",
	}, nil)

	user, err := service.FindUserByID(1)

	assert.NoError(t, err)
	assert.Equal(t, uint(1), user.ID)
}

func TestUserService_FindUserByID_NotFound(t *testing.T) {
	mockRepo, service := setupUserService(t)

	mockRepo.On("FindByID", uint(1)).Return(nil, errors.New("not found"))

	user, err := service.FindUserByID(1)

	assert.Nil(t, user)
	assert.Equal(t, appErrors.AppErrUserNotFound, err)
}

func TestUserService_FindUserByEmail(t *testing.T) {
	mockRepo, service := setupUserService(t)

	mockRepo.On("FindByEmail", "taro@example.com").Return(&domain.User{
		ID:    1,
		Name:  "Taro",
		Email: "taro@example.com",
	}, nil)

	user, err := service.FindUserByEmail("taro@example.com")

	assert.NoError(t, err)
	assert.Equal(t, "taro@example.com", user.Email)
}

func TestUserService_FindUserByEmail_NotFound(t *testing.T) {
	mockRepo, service := setupUserService(t)

	mockRepo.On("FindByEmail", "notfound@example.com").Return(nil, errors.New("not found"))

	user, err := service.FindUserByEmail("notfound@example.com")

	assert.Nil(t, user)
	assert.Equal(t, appErrors.AppErrUserNotFound, err)
}

func TestUserService_UpdateUser(t *testing.T) {
	mockRepo, service := setupUserService(t)

	existingUser := domain.User{
		ID:       1,
		Name:     "Taro",
		Email:    "taro@example.com",
		Password: "password",
		Role:     "user",
	}

	input := dto.UpdateUserRequest{
		Name:     "Taro Yamada",
		Email:    "update@example.com",
		Password: "newpassword",
		Role:     "admin",
	}

	mockRepo.On("FindByID", uint(1)).Return(&existingUser, nil)
	mockRepo.On("Update", mock.AnythingOfType("domain.User")).Return(&domain.User{
		ID:       1,
		Name:     input.Name,
		Email:    input.Email,
		Password: input.Password,
		Role:     input.Role,
	}, nil)

	user, err := service.UpdateUser(1, input)

	assert.NoError(t, err)
	assert.Equal(t, input.Name, user.Name)
	assert.Equal(t, input.Email, user.Email)
	assert.Equal(t, input.Password, user.Password)
	assert.Equal(t, input.Role, user.Role)
}

func TestUserService_DeleteUser(t *testing.T) {
	mockRepo, service := setupUserService(t)

	t.Run("削除成功", func(t *testing.T) {
		mockRepo.On("Delete", uint(1)).Return(nil)

		err := service.DeleteUser(1)

		assert.NoError(t, err)
	})

	t.Run("削除対象なし", func(t *testing.T) {
		mockRepo.On("Delete", uint(2)).Return(appErrors.ErrNotFound)

		err := service.DeleteUser(2)

		assert.Equal(t, appErrors.ErrNotFound, err)
	})
}
