package dto

import (
	"github.com/matsubara/myapp/internal/domain"
)

// LoginRequest はログインリクエストの構造体
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse はログインレスポンスの構造体
type LoginResponse struct {
	Token        string           `json:"token"`
	RefreshToken string           `json:"refreshToken"`
	User         AuthUserResponse `json:"user"`
}

// AuthUserResponse はログイン時のユーザー情報
type AuthUserResponse struct {
	ID    uint   `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name,omitempty"`
	Role  string `json:"role"`
}

// ToLoginResponse はUserモデルからLoginResponseを生成
func ToLoginResponse(user *domain.User, token string, refreshToken string) LoginResponse {
	return LoginResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User: AuthUserResponse{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
			Role:  user.Role,
		},
	}
}
