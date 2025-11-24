package service

import (
	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/customer/dto"
	"github.com/matsubara/myapp/internal/customer/repository"
	"github.com/matsubara/myapp/internal/domain"
)

/*
 * interface
 */
type CustomerService interface {
	GetAllCustomers() ([]domain.Customer, error)
	FindByID(id uint) (*domain.Customer, error)
	CreateCustomer(customer dto.CreateCustomerRequest) (*domain.Customer, error)
	UpdateCustomer(id uint, customer dto.UpdateCustomerRequest) (*domain.Customer, error)
	DeleteCustomer(id uint) error
}

/*
 * struct
 */
type customerService struct {
	repo repository.CustomerRepository
}

func NewCustomerService(r repository.CustomerRepository) CustomerService {
	return &customerService{repo: r}
}

func (s *customerService) GetAllCustomers() ([]domain.Customer, error) {
	return s.repo.GetAll()
}

func (s *customerService) FindByID(id uint) (*domain.Customer, error) {
	customer, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.AppErrCustomerNotFound
	}
	return customer, nil
}

func (s *customerService) CreateCustomer(input dto.CreateCustomerRequest) (*domain.Customer, error) {
	newCustomer := domain.Customer{
		Name:          input.Name,
		ContactName:   input.ContactName,
		Company:       input.Company,
		Email:         input.Email,
		Phone:         input.Phone,
		Address:       input.Address,
		Website:       input.Website,
		Tags:          input.Tags,
		Status:        input.Status,
		OwnerID:       input.OwnerID,
		NextActionAt:  input.NextActionAt,
		Notes:         input.Notes,
	}

	created, err := s.repo.Create(newCustomer)
	if err != nil {
		// Translate repository errors to application errors when possible
		if err == errors.ErrDuplicateEntry {
			return nil, errors.AppErrCustomerAlreadyExists
		}
		return nil, errors.ErrInsertFailed
	}
	return created, nil
}

func (s *customerService) UpdateCustomer(id uint, input dto.UpdateCustomerRequest) (*domain.Customer, error) {
	existingCustomer, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.AppErrCustomerNotFound
	}

	// map updatable fields
	existingCustomer.Name = input.Name
	existingCustomer.ContactName = input.ContactName
	existingCustomer.Company = input.Company
	existingCustomer.Email = input.Email
	existingCustomer.Phone = input.Phone
	existingCustomer.Address = input.Address
	existingCustomer.Website = input.Website
	existingCustomer.Tags = input.Tags
	existingCustomer.Status = input.Status
	existingCustomer.OwnerID = input.OwnerID
	existingCustomer.NextActionAt = input.NextActionAt
	existingCustomer.Notes = input.Notes

	customer, err := s.repo.Update(*existingCustomer)
	if err != nil {
		return nil, errors.AppErrCustomerUpdateFailed
	}
	return customer, nil
}

func (s *customerService) DeleteCustomer(id uint) error {
	return s.repo.Delete(id)
}
