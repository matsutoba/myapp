package migration

import (
	"log"

	"github.com/matsubara/myapp/internal/crm/models"
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) {
	err := db.AutoMigrate(&models.Customer{})
	if err != nil {
		log.Fatalf("failed to migrate DB: %v", err)
	}
}
