package services

import (
	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/crm/dto"
	"github.com/matsubara/myapp/internal/crm/models"
	"github.com/matsubara/myapp/internal/crm/repositories"
)

/*
 * interface
 */
type CustomerService interface {
	GetAllCustomers() ([]models.Customer, error)
	FindByID(id uint) (*models.Customer, error)
	CreateCustomer(customer dto.CreateCustomerRequest) (*models.Customer, error)
	UpdateCustomer(id uint, customer dto.UpdateCustomerRequest) (*models.Customer, error)
	DeleteCustomer(id uint) error
}

/*
 * struct
 */
type customerService struct {
	repo repositories.CustomerRepository
}

func NewCustomerService(r repositories.CustomerRepository) CustomerService {
	return &customerService{repo: r}
}

func (s *customerService) GetAllCustomers() ([]models.Customer, error) {
	return s.repo.GetAll()
}

func (s *customerService) FindByID(id uint) (*models.Customer, error) {
	customer, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.AppErrCustomerNotFound
	}
	return customer, nil
}

func (s *customerService) CreateCustomer(input dto.CreateCustomerRequest) (*models.Customer, error) {
	newCustomer := models.Customer{
		Name:    input.Name,
		Email:   input.Email,
		Phone:   input.Phone,
		Address: input.Address,
	}

	return s.repo.Create(newCustomer)
}

func (s *customerService) UpdateCustomer(id uint, input dto.UpdateCustomerRequest) (*models.Customer, error) {
	existingCustomer, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.AppErrCustomerNotFound
	}

	existingCustomer.Name = input.Name
	existingCustomer.Email = input.Email
	existingCustomer.Phone = input.Phone
	existingCustomer.Address = input.Address

	customer, err := s.repo.Update(*existingCustomer)
	if err != nil {
		return nil, errors.AppErrCustomerUpdateFailed
	}
	return customer, nil
}

func (s *customerService) DeleteCustomer(id uint) error {
	return s.repo.Delete(id)
}
