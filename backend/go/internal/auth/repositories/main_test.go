package repositories

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
	testDB.AutoMigrate(&domain.User{})

	// テスト実行
	code := m.Run()

	os.Exit(code)
}
