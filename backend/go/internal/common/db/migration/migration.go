package migration

import (
	"log"

	authModels "github.com/matsubara/myapp/internal/auth/models"
	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) {

	if err := db.AutoMigrate(&domain.Customer{}); err != nil {
		log.Fatalf("failed to migrat Customer table: %v", err)
	}

	if err := db.AutoMigrate(&domain.User{}); err != nil {
		log.Fatalf("failed to migrate User table: %v", err)
	}

	if err := db.AutoMigrate(&authModels.RefreshToken{}); err != nil {
		log.Fatalf("failed to migrate RefreshToken table: %v", err)
	}
}
