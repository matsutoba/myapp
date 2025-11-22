package config

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func SetupDatabase() *gorm.DB {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		GetEnv("DB_USER", "root"),
		GetEnv("DB_PASSOWRD", "password"),
		GetEnv("DB_HOST", "127.0.0.1"),
		GetEnv("DB_PORT", "3306"),
		GetEnv("DB_NAME", "myapp"),
	)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(fmt.Sprintf("Failed to connect to database: %v, dsn=%v", err, dsn))
	}

	return db
}
