package seeder

import (
	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

func SeedCustomers(db *gorm.DB) {
	customers := []domain.Customer{
		{Name: "山田太郎", Email: "taro@example.com", Phone: "090-1234-5678", Address: "東京都新宿区1-2-3"},
		{Name: "佐藤花子", Email: "hanako@example.com", Phone: "080-1234-5678", Address: "東京都江東区1-2-3"},
	}
	for _, c := range customers {
		db.FirstOrCreate(&c, domain.Customer{Email: c.Email})
	}
}
