package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/config"
	"github.com/matsubara/myapp/internal/common/db/migration"
	"github.com/matsubara/myapp/internal/common/db/migration/seeder"

	authRouter "github.com/matsubara/myapp/internal/auth/router"
	customerRouter "github.com/matsubara/myapp/internal/customer/router"
	userRouter "github.com/matsubara/myapp/internal/user/router"
)

func main() {

	/*
	 * 環境変数読み込み
	 */
	log.Print("Loading environment variables...")
	config.LoadEnv()

	/*
	 * DB接続
	 */
	log.Print("Setting up database...")
	db := config.SetupDatabase()
	log.Print("Database connected:", db != nil)

	/*
	 * マイグレーション実行
	 */
	log.Print("Running database migrations...")
	migration.AutoMigrate(db)
	log.Print("Database migrations completed.")

	/*
	 * シードデータ投入
	 */
	log.Print("Seeding initial data...")
	seeder.SeedAll(db)
	log.Print("Data seeding completed.")

	/*
	 * ルート定義
	 */
	log.Print("Setup router...")
	r := gin.Default()
	// 共通ベースパス /api
	apiGroup := r.Group("/api")
	// 各モジュールのルートを登録
	authRouter.RegisterRoutes(apiGroup, db)
	userRouter.RegisterRoutes(apiGroup, db)
	customerRouter.RegisterRoutes(apiGroup, db)

	/*
	 * サーバー起動
	 */
	log.Print("Starting server on :8080...")
	r.Run(":8080")
	log.Print("Server started.")
}
