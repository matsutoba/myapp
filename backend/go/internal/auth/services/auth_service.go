package services

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"github.com/matsubara/myapp/internal/auth/repositories"
	"github.com/matsubara/myapp/internal/common/config"
	commonErrors "github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/common/security"
	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

type AuthService interface {
	Login(email, password string) (*domain.User, string, string, error)
	Refresh(refreshToken string) (*domain.User, string, string, error)
	Logout(refreshToken string) error
}

type authService struct {
	repo repositories.AuthRepository
}

func NewAuthService(r repositories.AuthRepository) AuthService {
	return &authService{repo: r}
}

func (s *authService) Login(email, password string) (*domain.User, string, string, error) {
	// ユーザーをメールアドレスで検索
	user, err := s.repo.FindUserByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, "", "", commonErrors.ErrUnauthorized
		}
		return nil, "", "", err
	}

	// アクティブユーザーチェック
	if !user.IsActive {
		return nil, "", "", commonErrors.ErrUnauthorized
	}

	// パスワード検証
	if !security.CheckPasswordHash(password, user.Password) {
		return nil, "", "", commonErrors.ErrUnauthorized
	}

	// JWTトークン生成
	secretKey := config.GetEnv("JWT_SECRET_KEY", "your-secret-key")
	accessExpHours := config.GetEnvAsInt("ACCESS_TOKEN_TTL_HOURS", 1)     // デフォルト1時間
	refreshExpHours := config.GetEnvAsInt("REFRESH_TOKEN_TTL_HOURS", 168) // デフォルト7日
	accessToken, err := security.GenerateToken(user.ID, user.Email, user.Role, secretKey, accessExpHours)
	if err != nil {
		return nil, "", "", err
	}
	// Generate JTI for refresh token and persist
	jti, err := generateJTI()
	if err != nil {
		return nil, "", "", err
	}
	refreshToken, err := security.GenerateRefreshToken(user.ID, user.Email, user.Role, secretKey, refreshExpHours, jti)
	if err != nil {
		return nil, "", "", err
	}
	// Save refresh token record (best-effort; if it fails, treat as error because rotation requires persistence)
	if err := s.repo.CreateRefreshToken(user.ID, jti, time.Now().Add(time.Duration(refreshExpHours)*time.Hour)); err != nil {
		return nil, "", "", err
	}

	// 最終ログイン時刻を更新
	if err := s.repo.UpdateLastLogin(user.ID); err != nil {
		// ログイン時刻の更新エラーは致命的ではないのでログのみ
		// TODO: ロガーを使用してログを出力
	}

	return user, accessToken, refreshToken, nil
}

// Refresh はリフレッシュトークンを検証し、新しいアクセストークン/リフレッシュトークンを発行する
func (s *authService) Refresh(refreshToken string) (*domain.User, string, string, error) {
	if refreshToken == "" {
		return nil, "", "", commonErrors.ErrUnauthorized
	}

	secretKey := config.GetEnv("JWT_SECRET_KEY", "your-secret-key")
	claims, err := security.ValidateToken(refreshToken, secretKey)
	if err != nil {
		return nil, "", "", commonErrors.ErrUnauthorized
	}
	if claims.TokenType != "refresh" || claims.JTI == "" {
		return nil, "", "", commonErrors.ErrUnauthorized
	}

	// メールでユーザー再取得
	user, err := s.repo.FindUserByEmail(claims.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, "", "", commonErrors.ErrUnauthorized
		}
		return nil, "", "", err
	}
	if !user.IsActive {
		return nil, "", "", commonErrors.ErrUnauthorized
	}

	// DB上のリフレッシュトークンを確認
	rec, err := s.repo.GetRefreshTokenByJTI(claims.JTI)
	if err != nil {
		return nil, "", "", commonErrors.ErrUnauthorized
	}
	if rec.UserID != user.ID || rec.Revoked || rec.UsedAt != nil || rec.ExpiresAt.Before(time.Now()) {
		return nil, "", "", commonErrors.ErrUnauthorized
	}

	// 現在のリフレッシュトークンを使用済みにし、新しいトークンを発行（ローテーション）
	accessExpHours := config.GetEnvAsInt("ACCESS_TOKEN_TTL_HOURS", 1)
	refreshExpHours := config.GetEnvAsInt("REFRESH_TOKEN_TTL_HOURS", 168)
	accessToken, err := security.GenerateToken(user.ID, user.Email, user.Role, secretKey, accessExpHours)
	if err != nil {
		return nil, "", "", err
	}
	newJTI, err := generateJTI()
	if err != nil {
		return nil, "", "", err
	}
	newRefreshToken, err := security.GenerateRefreshToken(user.ID, user.Email, user.Role, secretKey, refreshExpHours, newJTI)
	if err != nil {
		return nil, "", "", err
	}
	// Mark old as used and store new
	if err := s.repo.MarkRefreshTokenUsed(rec.JTI, time.Now()); err != nil {
		return nil, "", "", err
	}
	if err := s.repo.CreateRefreshToken(user.ID, newJTI, time.Now().Add(time.Duration(refreshExpHours)*time.Hour)); err != nil {
		return nil, "", "", err
	}

	return user, accessToken, newRefreshToken, nil
}

// Logout はリフレッシュトークンを失効させる
func (s *authService) Logout(refreshToken string) error {
	if refreshToken == "" {
		// トークンがない場合は成功として扱う（既にログアウト済み）
		return nil
	}

	secretKey := config.GetEnv("JWT_SECRET_KEY", "your-secret-key")
	claims, err := security.ValidateToken(refreshToken, secretKey)
	if err != nil {
		// トークンが無効でも失効処理は成功とする（冪等性）
		return nil
	}

	// token_type と JTI のチェック
	if claims.TokenType != "refresh" || claims.JTI == "" {
		return nil
	}

	// DB上のリフレッシュトークンを失効
	if err := s.repo.RevokeRefreshToken(claims.JTI); err != nil {
		// DB失効エラーは返す（重要な処理）
		return err
	}

	return nil
}

// generateJTI creates a random 32-byte hex string as JTI
func generateJTI() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
