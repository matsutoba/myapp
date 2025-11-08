package repositories

import (
	"github.com/matsubara/myapp/internal/crm/models"
	"gorm.io/gorm"
)

/*
 * interface
 */
type CustomerRepository interface {
	GetAll() ([]models.Customer, error)
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
