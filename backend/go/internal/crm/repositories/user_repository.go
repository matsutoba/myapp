package repositories

import (
	"github.com/matsubara/myapp/internal/crm/models"
	"gorm.io/gorm"
)

/*
 * interface
 */
type UserRepository interface {
	GetAll() ([]models.User, error)
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
