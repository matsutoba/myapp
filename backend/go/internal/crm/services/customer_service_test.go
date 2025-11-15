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

func setupCustomerService(t *testing.T) (*mocks.CustomerRepository, services.CustomerService) {
	mockRepo := new(mocks.CustomerRepository)
	service := services.NewCustomerService(mockRepo)
	t.Cleanup(func() { mockRepo.AssertExpectations(t) })
	return mockRepo, service
}
func TestCustomerService_CreateCustomer(t *testing.T) {
	mockRepo, service := setupCustomerService(t)

	input := dto.CreateCustomerRequest{
		Name:    "Taro",
		Email:   "taro@example.com",
		Address: "Tokyo",
		Phone:   "123-456-7890",
	}

	// モックの期待値 --- IGNORE ---
	mockRepo.On("Create", mock.AnythingOfType("models.Customer")).Return(&models.Customer{
		ID:      1,
		Name:    input.Name,
		Email:   input.Email,
		Address: input.Address,
		Phone:   input.Phone,
	}, nil)

	customer, err := service.CreateCustomer(input)

	assert.NoError(t, err)
	assert.Equal(t, input.Email, customer.Email)
}

func TestCustomerService_GetAllCustomers(t *testing.T) {
	mockRepo, service := setupCustomerService(t)

	mockRepo.On("GetAll").Return([]models.Customer{
		{ID: 1, Name: "Taro", Email: "taro@example.com"},
		{ID: 2, Name: "Jiro", Email: "jiro@example.com"},
	}, nil)

	customers, err := service.GetAllCustomers()

	assert.NoError(t, err)
	assert.Len(t, customers, 2)
}

func TestCustomerService_FindCustomerByID(t *testing.T) {
	mockRepo, service := setupCustomerService(t)

	mockRepo.On("FindByID", uint(1)).Return(&models.Customer{
		ID:    1,
		Name:  "Taro",
		Email: "taro@example.com",
	}, nil)

	customer, err := service.FindByID(1)

	assert.NoError(t, err)
	assert.Equal(t, uint(1), customer.ID)
}

func TestCustomerService_FindCustomerByID_NotFound(t *testing.T) {
	mockRepo, service := setupCustomerService(t)

	mockRepo.On("FindByID", uint(1)).Return(nil, errors.New("customer not found"))

	customer, err := service.FindByID(1)

	assert.Nil(t, customer)
	assert.Equal(t, appErrors.AppErrCustomerNotFound, err)
}

func TestCustomerService_UpdateCustomer(t *testing.T) {
	mockRepo, service := setupCustomerService(t)

	existingCustomer := models.Customer{
		ID:      1,
		Name:    "Taro",
		Email:   "taro@example.com",
		Address: "Tokyo",
		Phone:   "123-456-7890",
	}

	input := dto.UpdateCustomerRequest{
		Name:    "Taro Yamada",
		Email:   "update@example.com",
		Address: "Osaka",
		Phone:   "987-654-3210",
	}

	mockRepo.On("FindByID", uint(1)).Return(&existingCustomer, nil)
	mockRepo.On("Update", mock.AnythingOfType("models.Customer")).Return(&models.Customer{
		ID:      1,
		Name:    input.Name,
		Email:   input.Email,
		Address: input.Address,
		Phone:   input.Phone,
	}, nil)

	customer, err := service.UpdateCustomer(1, input)

	assert.NoError(t, err)
	assert.Equal(t, input.Email, customer.Email)
}

func TestCustomerService_DeleteCustomer(t *testing.T) {
	mockRepo, service := setupCustomerService(t)

	mockRepo.On("Delete", uint(1)).Return(nil)

	err := service.DeleteCustomer(1)

	assert.NoError(t, err)
}
