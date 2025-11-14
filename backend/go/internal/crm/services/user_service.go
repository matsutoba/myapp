package services

import (
	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/common/security"
	"github.com/matsubara/myapp/internal/crm/dto"
	"github.com/matsubara/myapp/internal/crm/models"
	"github.com/matsubara/myapp/internal/crm/repositories"
)

/*
 * interface
 */
type UserService interface {
	GetAllUsers() ([]models.User, error)
	FindUserByID(id uint) (*models.User, error)
	FindUserByEmail(email string) (*models.User, error)
	CreateUser(user dto.CreateUserRequest) (*models.User, error)
	UpdateUser(id uint, user dto.UpdateUserRequest) error
	DeleteUser(id uint) error
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

func (s *userService) FindUserByID(id uint) (*models.User, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.AppErrUserNotFound
	}
	return user, nil
}

func (s *userService) FindUserByEmail(email string) (*models.User, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return nil, errors.AppErrUserNotFound
	}
	return user, nil
}

func (s *userService) CreateUser(input dto.CreateUserRequest) (*models.User, error) {

	hashedPassword, err := security.HashPassword(input.Password)

	if err != nil {
		return nil, err
	}

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Role:     input.Role,
		Password: hashedPassword,
		IsActive: true,
	}

	newUser, err := s.repo.Create(user)
	if err != nil {
		return nil, errors.AppErrUserAlreadyExists
	}

	return newUser, nil
}

func (s *userService) UpdateUser(id uint, input dto.UpdateUserRequest) error {

	existingUser, err := s.repo.FindByID(uint(id))
	if err != nil {
		return errors.AppErrUserNotFound
	}

	existingUser.Name = input.Name
	existingUser.Email = input.Email
	existingUser.Role = input.Role
	existingUser.Password = input.Password

	return s.repo.Update(existingUser)
}

func (s *userService) DeleteUser(id uint) error {
	return s.repo.Delete(id)
}
