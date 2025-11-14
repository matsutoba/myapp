package repositories

import (
	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/crm/models"
	"gorm.io/gorm"
)

/*
 * interface
 */
type UserRepository interface {
	GetAll() ([]models.User, error)
	FindByID(id uint) (*models.User, error)
	FindByEmail(email string) (*models.User, error)
	Create(user models.User) (*models.User, error)
	Update(user models.User) (*models.User, error)
	Delete(id uint) error
}

/*
 * struct
 */
type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) GetAll() ([]models.User, error) {
	var users []models.User
	err := r.db.Find(&users).Error
	return users, err
}

func (r *userRepository) FindByID(id uint) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, errors.ErrNotFound
	}
	return &user, err
}

func (r *userRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, errors.ErrNotFound
	}
	return &user, err
}

func (r *userRepository) Create(newUser models.User) (*models.User, error) {
	result := r.db.Create(&newUser)
	if result.Error != nil {
		return nil, errors.ErrInsertFailed
	}
	return &newUser, result.Error
}

func (r *userRepository) Update(user models.User) (*models.User, error) {
	result := r.db.Save(&user)
	if result.Error != nil {
		return nil, errors.ErrUpdateFailed
	}
	return &user, nil
}

func (r *userRepository) Delete(id uint) error {
	return r.db.Delete(&models.User{}, id).Error
}
