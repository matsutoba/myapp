package repository

import (
	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

/*
 * interface
 */
type UserRepository interface {
	GetAll() ([]domain.User, error)
	FindByID(id uint) (*domain.User, error)
	FindByEmail(email string) (*domain.User, error)
	Create(user domain.User) (*domain.User, error)
	Update(user domain.User) (*domain.User, error)
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

func (r *userRepository) GetAll() ([]domain.User, error) {
	var users []domain.User
	err := r.db.Find(&users).Error
	return users, err
}

func (r *userRepository) FindByID(id uint) (*domain.User, error) {
	var user domain.User
	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, errors.ErrNotFound
	}
	return &user, err
}

func (r *userRepository) FindByEmail(email string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, errors.ErrNotFound
	}
	return &user, err
}

func (r *userRepository) Create(newUser domain.User) (*domain.User, error) {
	result := r.db.Create(&newUser)
	if result.Error != nil {
		return nil, errors.ErrInsertFailed
	}
	return &newUser, result.Error
}

func (r *userRepository) Update(user domain.User) (*domain.User, error) {
	result := r.db.Save(&user)
	if result.Error != nil {
		return nil, errors.ErrUpdateFailed
	}
	return &user, nil
}

func (r *userRepository) Delete(id uint) error {
	result := r.db.Delete(&domain.User{}, id)
	if result.Error != nil {
		return errors.ErrDeleteFailed
	}
	if result.RowsAffected == 0 {
		return errors.ErrNotFound
	}
	return nil
}
