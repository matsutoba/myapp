package repository

import (
	"os"
	"testing"

	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var testDB *gorm.DB

func TestMain(m *testing.M) {
	// DB 初期化
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	testDB = db

	// マイグレーション
	testDB.AutoMigrate(&domain.User{}, &domain.Customer{})

	// テスト実行
	code := m.Run()

	// ここに後処理を書く場合もある
	os.Exit(code)
}
