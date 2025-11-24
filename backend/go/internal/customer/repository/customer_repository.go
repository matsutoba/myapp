package repository

import (
	"strings"

	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

/*
 * interface
 */
type CustomerRepository interface {
	GetAll() ([]domain.Customer, error)
	GetPaginated(skip int, take int, keyword string) ([]domain.Customer, int64, error)
	FindByID(id uint) (*domain.Customer, error)
	Create(customer domain.Customer) (*domain.Customer, error)
	Update(customer domain.Customer) (*domain.Customer, error)
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

func (r *customerRepository) GetAll() ([]domain.Customer, error) {
	var customers []domain.Customer
	err := r.db.Find(&customers).Error
	return customers, err
}

func (r *customerRepository) GetPaginated(skip int, take int, keyword string) ([]domain.Customer, int64, error) {
	var customers []domain.Customer
	var total int64

	db := r.db.Model(&domain.Customer{})
	if keyword != "" {
		like := "%" + strings.ToLower(keyword) + "%"
		db = db.Where("LOWER(name) LIKE ? OR LOWER(email) LIKE ?", like, like)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	q := r.db.Model(&domain.Customer{})
	if keyword != "" {
		like := "%" + strings.ToLower(keyword) + "%"
		q = q.Where("LOWER(name) LIKE ? OR LOWER(email) LIKE ?", like, like)
	}

	if err := q.Order("id desc").Offset(skip).Limit(take).Find(&customers).Error; err != nil {
		return nil, 0, err
	}

	return customers, total, nil
}

func (r *customerRepository) FindByID(id uint) (*domain.Customer, error) {
	var customer domain.Customer
	err := r.db.First(&customer, id).Error
	if err != nil {
		return nil, errors.ErrNotFound
	}
	return &customer, err
}

func (r *customerRepository) Create(newCustomer domain.Customer) (*domain.Customer, error) {
	result := r.db.Create(&newCustomer)
	if result.Error != nil {
		return nil, errors.ErrInsertFailed
	}
	return &newCustomer, result.Error
}

func (r *customerRepository) Update(customer domain.Customer) (*domain.Customer, error) {
	result := r.db.Save(customer)
	if result.Error != nil {
		return nil, errors.ErrUpdateFailed
	}
	return &customer, nil
}

func (r *customerRepository) Delete(id uint) error {
	result := r.db.Delete(&domain.Customer{}, id)
	if result.Error != nil {
		return errors.ErrDeleteFailed
	}
	if result.RowsAffected == 0 {
		return errors.ErrNotFound
	}
	return nil
}
