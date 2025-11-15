package service

import (
	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/common/security"
	"github.com/matsubara/myapp/internal/domain"
	"github.com/matsubara/myapp/internal/user/dto"
	"github.com/matsubara/myapp/internal/user/repository"
)

/*
 * interface
 */
type UserService interface {
	GetAllUsers() ([]domain.User, error)
	FindUserByID(id uint) (*domain.User, error)
	FindUserByEmail(email string) (*domain.User, error)
	CreateUser(user dto.CreateUserRequest) (*domain.User, error)
	UpdateUser(id uint, user dto.UpdateUserRequest) (*domain.User, error)
	DeleteUser(id uint) error
}

/*
 * struct
 */
type userService struct {
	repo repository.UserRepository
}

func NewUserService(r repository.UserRepository) UserService {
	return &userService{repo: r}
}

func (s *userService) GetAllUsers() ([]domain.User, error) {
	return s.repo.GetAll()
}

func (s *userService) FindUserByID(id uint) (*domain.User, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.AppErrUserNotFound
	}
	return user, nil
}

func (s *userService) FindUserByEmail(email string) (*domain.User, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return nil, errors.AppErrUserNotFound
	}
	return user, nil
}

func (s *userService) CreateUser(input dto.CreateUserRequest) (*domain.User, error) {

	hashedPassword, err := security.HashPassword(input.Password)

	if err != nil {
		return nil, err
	}

	user := domain.User{
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

func (s *userService) UpdateUser(id uint, input dto.UpdateUserRequest) (*domain.User, error) {

	existingUser, err := s.repo.FindByID(uint(id))
	if err != nil {
		return nil, errors.AppErrUserNotFound
	}

	existingUser.Name = input.Name
	existingUser.Email = input.Email
	existingUser.Role = input.Role
	existingUser.Password = input.Password

	user, err := s.repo.Update(*existingUser)
	if err != nil {
		return nil, errors.AppErrUserUpdateFailed
	}
	return user, nil
}

func (s *userService) DeleteUser(id uint) error {
	return s.repo.Delete(id)
}
