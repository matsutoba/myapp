package repositories

import (
	"time"

	authModels "github.com/matsubara/myapp/internal/auth/models"
	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

type AuthRepository interface {
	FindUserByEmail(email string) (*domain.User, error)
	UpdateLastLogin(userID uint) error
	// Refresh token persistence for rotation
	CreateRefreshToken(userID uint, jti string, expiresAt time.Time) error
	GetRefreshTokenByJTI(jti string) (*authModels.RefreshToken, error)
	MarkRefreshTokenUsed(jti string, usedAt time.Time) error
	RevokeRefreshToken(jti string) error
}

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db: db}
}

func (r *authRepository) FindUserByEmail(email string) (*domain.User, error) {
	var user domain.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *authRepository) UpdateLastLogin(userID uint) error {
	now := time.Now()
	return r.db.Model(&domain.User{}).Where("id = ?", userID).Update("last_login_at", now).Error
}

func (r *authRepository) CreateRefreshToken(userID uint, jti string, expiresAt time.Time) error {
	rec := &authModels.RefreshToken{
		UserID:    userID,
		JTI:       jti,
		ExpiresAt: expiresAt,
		Revoked:   false,
	}
	return r.db.Create(rec).Error
}

func (r *authRepository) GetRefreshTokenByJTI(jti string) (*authModels.RefreshToken, error) {
	var rt authModels.RefreshToken
	if err := r.db.Where("jti = ?", jti).First(&rt).Error; err != nil {
		return nil, err
	}
	return &rt, nil
}

func (r *authRepository) MarkRefreshTokenUsed(jti string, usedAt time.Time) error {
	return r.db.Model(&authModels.RefreshToken{}).Where("jti = ? AND used_at IS NULL", jti).Updates(map[string]interface{}{
		"used_at": usedAt,
	}).Error
}

func (r *authRepository) RevokeRefreshToken(jti string) error {
	return r.db.Model(&authModels.RefreshToken{}).Where("jti = ?", jti).Update("revoked", true).Error
}
