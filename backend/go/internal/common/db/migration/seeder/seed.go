package seeder

import "gorm.io/gorm"

func SeedAll(db *gorm.DB) {
	SeedCustomers(db)
}
