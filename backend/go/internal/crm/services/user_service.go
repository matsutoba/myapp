package services

import (
	"github.com/matsubara/myapp/internal/crm/models"
	"github.com/matsubara/myapp/internal/crm/repositories"
)

/*
 * interface
 */
type UserService interface {
	GetAllUsers() ([]models.User, error)
}

/*
 * struct
 */
type userService struct {
	repo repositories.UserRepository
}

func NewUserService(r repositories.UserRepository) UserService {
	return &userService{repo: r}
}

func (s *userService) GetAllUsers() ([]models.User, error) {
	return s.repo.GetAll()
}
