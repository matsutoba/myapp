package services_test

import (
	"errors"
	"testing"

	appErrors "github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/crm/dto"
	"github.com/matsubara/myapp/internal/crm/models"
	"github.com/matsubara/myapp/internal/crm/repositories/mocks"
	"github.com/matsubara/myapp/internal/crm/services"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestUserService_CreateUser(t *testing.T) {
	mockRepo := new(mocks.UserRepository)
	service := services.NewUserService(mockRepo)

	input := dto.CreateUserRequest{
		Name:     "Taro",
		Email:    "taro@example.com",
		Password: "password",
		Role:     "user",
	}

	// モックの期待値
	mockRepo.On("Create", mock.AnythingOfType("models.User")).Return(&models.User{
		ID:    1,
		Name:  input.Name,
		Email: input.Email,
		Role:  input.Role,
	}, nil)

	user, err := service.CreateUser(input)

	assert.NoError(t, err)
	assert.Equal(t, input.Email, user.Email)

	mockRepo.AssertExpectations(t)
}

func TestUserService_GetAllUsers(t *testing.T) {
	mockRepo := new(mocks.UserRepository)
	service := services.NewUserService(mockRepo)

	mockRepo.On("GetAll").Return([]models.User{
		{ID: 1, Name: "Taro", Email: "taro@example.com"},
		{ID: 2, Name: "Jiro", Email: "jiro@example.com"},
	}, nil)

	users, err := service.GetAllUsers()

	assert.NoError(t, err)
	assert.Len(t, users, 2)

	mockRepo.AssertExpectations(t)
}

func TestUserService_FindUserByID_NotFound(t *testing.T) {
	mockRepo := new(mocks.UserRepository)
	service := services.NewUserService(mockRepo)

	mockRepo.On("FindByID", uint(1)).Return(nil, errors.New("not found"))

	user, err := service.FindUserByID(1)

	assert.Nil(t, user)
	assert.Equal(t, appErrors.AppErrUserNotFound, err)

	mockRepo.AssertExpectations(t)
}

func TestUserService_UpdateUser(t *testing.T) {
	mockRepo := new(mocks.UserRepository)
	service := services.NewUserService(mockRepo)

	existingUser := models.User{
		ID:    1,
		Name:  "Taro",
		Email: "taro@example.com",
		Role:  "user",
	}

	input := dto.UpdateUserRequest{
		Name:     "Taro Yamada",
		Email:    "update@example.com",
		Password: "newpassword",
		Role:     "admin",
	}

	mockRepo.On("FindByID", uint(1)).Return(existingUser, nil)

	err := service.UpdateUser(1, input)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

/*
func TestUserService_DeleteUser(t *testing.T) {
	mockRepo := new(mocks.UserRepository)
	service := services.NewUserService(mockRepo)

	mockRepo.On("Delete", uint(1)).Return(nil)

	err := service.DeleteUser(1)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}
*/
