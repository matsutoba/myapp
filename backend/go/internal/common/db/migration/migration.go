package migration

import (
	"log"

	"github.com/matsubara/myapp/internal/crm/models"
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) {

	if err := db.AutoMigrate(&models.Customer{}); err != nil {
		log.Fatalf("failed to migrat Customer table: %v", err)
	}

	if err := db.AutoMigrate(&models.User{}); err != nil {
		log.Fatalf("failed to migrate User table: %v", err)
	}
}
