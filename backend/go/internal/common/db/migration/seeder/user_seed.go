package seeder

import (
	"fmt"
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

	users := []domain.User{admin}

	// userをlength個生成
	const length = 100
	for i := 1; i <= length; i++ {
		u := domain.User{
			Name:     fmt.Sprintf("ユーザー%d", i),
			Email:    fmt.Sprintf("user%d@example.com", i),
			Password: hashPassword,
			Role:     "user",
		}
		users = append(users, u)
	}

	for _, u := range users {
		if err := db.FirstOrCreate(&u, domain.User{Email: u.Email}).Error; err != nil {
			log.Printf("failed to seed user %s: %v", u.Email, err)
		}
	}
}
