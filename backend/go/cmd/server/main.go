package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/config"
	"github.com/matsubara/myapp/internal/common/db/migration"
	"github.com/matsubara/myapp/internal/common/db/migration/seeder"
	commonMiddleware "github.com/matsubara/myapp/internal/common/middleware"

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
	// CORS (must be before defining route groups)
	r.Use(commonMiddleware.CORSMiddleware())
	// Optional API key middleware: protects /api routes when API_KEY env is set
	r.Use(commonMiddleware.APIKeyMiddleware())
	// ヘルスチェック
	r.GET("/healthz", func(c *gin.Context) { c.JSON(200, gin.H{"status": "ok"}) })

	// 共通ベースパス /api
	apiGroup := r.Group("/api")
	// 各モジュールのルートを登録
	authRouter.RegisterRoutes(apiGroup, db)
	userRouter.RegisterRoutes(apiGroup, db)
	customerRouter.RegisterRoutes(apiGroup, db)

	/*
	 * サーバー起動
	 */
	port := config.GetEnv("PORT", "8080")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port
	log.Print("Starting server on " + addr + "...")
	r.Run(addr)

	log.Print("Server started.")
}
