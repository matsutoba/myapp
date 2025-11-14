package repositories

import (
	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/crm/models"
	"gorm.io/gorm"
)

/*
 * interface
 */
type CustomerRepository interface {
	GetAll() ([]models.Customer, error)
	FindByID(id uint) (*models.Customer, error)
	Create(customer models.Customer) (*models.Customer, error)
	Update(customer models.Customer) (*models.Customer, error)
	Delete(id uint) error
}

/*
 * struct
 */
type customerRepository struct {
	db *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) CustomerRepository {
	return &customerRepository{db: db}
}

func (r *customerRepository) GetAll() ([]models.Customer, error) {
	var customers []models.Customer
	err := r.db.Find(&customers).Error
	return customers, err
}

func (r *customerRepository) FindByID(id uint) (*models.Customer, error) {
	var customer models.Customer
	err := r.db.First(&customer, id).Error
	if err != nil {
		return nil, errors.ErrNotFound
	}
	return &customer, err
}

func (r *customerRepository) Create(newCustomer models.Customer) (*models.Customer, error) {
	result := r.db.Create(&newCustomer)
	if result.Error != nil {
		return nil, errors.ErrInsertFailed
	}
	return &newCustomer, result.Error
}

func (r *customerRepository) Update(customer models.Customer) (*models.Customer, error) {
	result := r.db.Save(customer)
	if result.Error != nil {
		return nil, errors.ErrUpdateFailed
	}
	return &customer, nil
}

func (r *customerRepository) Delete(id uint) error {
	return r.db.Delete(&models.Customer{}, id).Error
}
