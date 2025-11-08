package seeder

import (
	"log"

	"github.com/matsubara/myapp/internal/crm/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedUsers(db *gorm.DB) {
	// パスワードをハッシュ化
	hashPassword := func(pw string) string {
		bytes, _ := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
		return string(bytes)
	}

	admin := models.User{
		Name:     "管理者",
		Email:    "admin@example.com",
		Password: hashPassword("password"), // 初期パスワード
		Role:     "admin",
	}

	user := models.User{
		Name:     "一般ユーザー",
		Email:    "user@example.com",
		Password: hashPassword("password"),
		Role:     "user",
	}

	users := []models.User{admin, user}

	for _, u := range users {
		if err := db.FirstOrCreate(&u, models.User{Email: u.Email}).Error; err != nil {
			log.Printf("failed to seed user %s: %v", u.Email, err)
		}
	}
}
