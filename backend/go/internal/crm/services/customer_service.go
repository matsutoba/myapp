package services

import (
	"github.com/matsubara/myapp/internal/crm/models"
	"github.com/matsubara/myapp/internal/crm/repositories"
)

/*
 * interface
 */
type CustomerService interface {
	GetAllCustomers() ([]models.Customer, error)
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
