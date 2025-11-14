package repositories

import (
	"os"
	"testing"

	"github.com/matsubara/myapp/internal/crm/models"
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
	testDB.AutoMigrate(&models.User{}, &models.Customer{})

	// テスト実行
	code := m.Run()

	// ここに後処理を書く場合もある
	os.Exit(code)
}
