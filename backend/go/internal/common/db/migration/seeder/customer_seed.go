package seeder

import (
	"github.com/matsubara/myapp/internal/crm/models"
	"gorm.io/gorm"
)

func SeedCustomers(db *gorm.DB) {
	customers := []models.Customer{
		{Name: "山田太郎", Email: "taro@example.com"},
		{Name: "佐藤花子", Email: "hanako@example.com"},
	}
	for _, c := range customers {
		db.FirstOrCreate(&c, models.Customer{Email: c.Email})
	}
}
