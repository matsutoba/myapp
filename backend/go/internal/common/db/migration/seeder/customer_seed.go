package seeder

import (
	"fmt"
	"log"

	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

// SeedCustomers は開発用のサンプル顧客データを挿入します。
// 既に同じメールアドレスのレコードが存在する場合は作成しません（FirstOrCreate）。
func SeedCustomers(db *gorm.DB) {
	customers := []domain.Customer{}

	// 自動生成で合計20件になるように追加で作成
	for i := 3; i <= 20; i++ {
		c := domain.Customer{
			ContactName: fmt.Sprintf("担当者%d", i),
			Company:     fmt.Sprintf("会社%d", i),
			Email:       fmt.Sprintf("customer%d@example.com", i),
			Phone:       fmt.Sprintf("080-1111-%04d", i),
			Address:     fmt.Sprintf("東京都区%d-1-1", i),
			Website:     fmt.Sprintf("https://company%d.example.com", i),
			Tags:        "seed",
			Status:      "lead",
		}
		customers = append(customers, c)
	}

	for _, c := range customers {
		if err := db.FirstOrCreate(&c, domain.Customer{Email: c.Email}).Error; err != nil {
			log.Printf("failed to seed customer %s: %v", c.Email, err)
		}
	}
}
