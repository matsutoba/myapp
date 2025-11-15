package repositories

import (
	"testing"
	"time"

	"github.com/matsubara/myapp/internal/domain"
	"golang.org/x/crypto/bcrypt"
)

func TestAuthRepository_FindUserByEmail(t *testing.T) {
	repo := NewAuthRepository(testDB)

	// テストデータの準備
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := domain.User{
		Name:     "Test User",
		Email:    "test@example.com",
		Password: string(hashedPassword),
		Role:     "user",
		IsActive: true,
	}

	// ユーザーを作成
	if err := testDB.Create(&user).Error; err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}
	defer testDB.Delete(&user)

	// テスト: 存在するユーザーを検索
	t.Run("存在するユーザーを検索", func(t *testing.T) {
		found, err := repo.FindUserByEmail("test@example.com")
		if err != nil {
			t.Fatalf("FindUserByEmail failed: %v", err)
		}
		if found.Email != "test@example.com" {
			t.Errorf("expected email test@example.com, got %s", found.Email)
		}
		if found.Name != "Test User" {
			t.Errorf("expected name Test User, got %s", found.Name)
		}
	})

	// テスト: 存在しないユーザーを検索
	t.Run("存在しないユーザーを検索", func(t *testing.T) {
		_, err := repo.FindUserByEmail("notexist@example.com")
		if err == nil {
			t.Error("expected error for non-existent user, got nil")
		}
	})
}

func TestAuthRepository_UpdateLastLogin(t *testing.T) {
	repo := NewAuthRepository(testDB)

	// テストデータの準備
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := domain.User{
		Name:     "Login Test User",
		Email:    "logintest@example.com",
		Password: string(hashedPassword),
		Role:     "user",
		IsActive: true,
	}

	// ユーザーを作成
	if err := testDB.Create(&user).Error; err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}
	defer testDB.Delete(&user)

	// 最終ログイン時刻を更新
	err := repo.UpdateLastLogin(user.ID)
	if err != nil {
		t.Fatalf("UpdateLastLogin failed: %v", err)
	}

	// 更新されたユーザーを取得
	var updated domain.User
	if err := testDB.First(&updated, user.ID).Error; err != nil {
		t.Fatalf("Failed to get updated user: %v", err)
	}

	// LastLoginAtが設定されていることを確認
	if updated.LastLoginAt == nil {
		t.Error("expected LastLoginAt to be set, got nil")
	}

	// 現在時刻との差が1秒以内であることを確認
	if updated.LastLoginAt != nil {
		diff := time.Since(*updated.LastLoginAt)
		if diff > time.Second {
			t.Errorf("LastLoginAt is too old: %v", diff)
		}
	}
}

func TestAuthRepository_UpdateLastLogin_NonExistentUser(t *testing.T) {
	repo := NewAuthRepository(testDB)

	// 存在しないユーザーIDで更新を試みる
	err := repo.UpdateLastLogin(99999)
	if err != nil {
		t.Fatalf("UpdateLastLogin should not fail for non-existent user: %v", err)
	}
}
