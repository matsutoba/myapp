package seeder

import (
	"log"

	"github.com/matsubara/myapp/internal/common/security"
	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

func SeedUsers(db *gorm.DB) {
	// パスワードをハッシュ化
	hashPassword, nil := security.HashPassword("password")

	admin := domain.User{
		Name:     "管理者",
		Email:    "admin@example.com",
		Password: hashPassword,
		Role:     "admin",
	}

	user := domain.User{
		Name:     "一般ユーザー",
		Email:    "user@example.com",
		Password: hashPassword,
		Role:     "user",
	}

	users := []domain.User{admin, user}

	for _, u := range users {
		if err := db.FirstOrCreate(&u, domain.User{Email: u.Email}).Error; err != nil {
			log.Printf("failed to seed user %s: %v", u.Email, err)
		}
	}
}
