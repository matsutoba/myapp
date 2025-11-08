package main

import (
	"github.com/gin-gonic/gin"
	crmRouter "github.com/matsubara/myapp/internal/crm/router"
)

func main() {
	r := gin.Default()

	// 共通ベースパス /api
	apiGroup := r.Group("/api")

	// 各モジュールのルートを登録
	crmRouter.RegisterRoutes(apiGroup)

	r.Run(":8080")
}
