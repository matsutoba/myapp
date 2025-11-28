package dto

import (
	"time"

	"github.com/matsubara/myapp/internal/domain"
)

type CreateUserRequest struct {
	Name     string `json:"name" binding:"required,max=100"`
	Email    string `json:"email" binding:"required,email,max=100"`
	Password string `json:"password" binding:"required,min=8"`
	Role     string `json:"role" binding:"required,oneof=admin user"`
}

type UpdateUserRequest struct {
	// Update リクエストは部分更新も許可するためすべて省略可能にする
	Name     string `json:"name" binding:"omitempty,max=100"`
	Email    string `json:"email" binding:"omitempty,email,max=100"`
	Password string `json:"password" binding:"omitempty,min=8"`
	Role     string `json:"role" binding:"omitempty,oneof=admin user"`
	// IsActive は更新時にステータスを明示的に変更したい場合に使う（nilなら変更しない）
	IsActive *bool `json:"isActive"`
}

// UserResponse は単一ユーザー取得時のレスポンス
type UserResponse struct {
	ID          uint       `json:"id"`
	Name        string     `json:"name"`
	Email       string     `json:"email"`
	Role        string     `json:"role"`
	IsActive    bool       `json:"isActive"`
	LastLoginAt *time.Time `json:"lastLoginAt"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

// UserListResponse はユーザー一覧取得時のレスポンス（簡易版）
type UserListResponse struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	IsActive bool   `json:"isActive"`
}

// ToUserResponse はモデルをレスポンスDTOに変換
func ToUserResponse(user *domain.User) *UserResponse {
	if user == nil {
		return nil
	}
	return &UserResponse{
		ID:          user.ID,
		Name:        user.Name,
		Email:       user.Email,
		Role:        user.Role,
		IsActive:    user.IsActive,
		LastLoginAt: user.LastLoginAt,
		CreatedAt:   user.CreatedAt,
		UpdatedAt:   user.UpdatedAt,
	}
}

// ToUserListResponse は複数ユーザーを一覧レスポンスDTOに変換
func ToUserListResponse(users []domain.User) []UserListResponse {
	result := make([]UserListResponse, len(users))
	for i, u := range users {
		result[i] = UserListResponse{
			ID:       u.ID,
			Name:     u.Name,
			Email:    u.Email,
			Role:     u.Role,
			IsActive: u.IsActive,
		}
	}
	return result
}

// ユーザー一覧のページネーションレスポンス
type UsersPagedResponse struct {
	Items []UserListResponse `json:"items"`
	Total int64              `json:"total"`
	Skip  int                `json:"skip"`
	Take  int                `json:"take"`
}

func ToUserListPagedResponse(users []domain.User, total int64, skip int, take int) UsersPagedResponse {
	return UsersPagedResponse{
		Items: ToUserListResponse(users),
		Total: total,
		Skip:  skip,
		Take:  take,
	}
}
