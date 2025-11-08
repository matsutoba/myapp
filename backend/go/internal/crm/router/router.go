package router

import (
	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/crm/controllers"
)

// RegisterRoutes は全てのルーティングをまとめて登録する
func RegisterRoutes(r *gin.RouterGroup) {
	api := r.Group("/crm")
	{
		api.GET("/customers", controllers.GetCustomers)
		// ここに他のモジュールのルートも追加可能
	}
}
