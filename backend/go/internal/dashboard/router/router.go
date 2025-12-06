package router

import (
	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/middleware"
	"github.com/matsubara/myapp/internal/dashboard/controller"
	"github.com/matsubara/myapp/internal/dashboard/service"
	"github.com/matsubara/myapp/internal/order/repository"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	// reuse order repository
	orderRepo := repository.NewOrderRepository(db)
	dashboardService := service.NewDashboardService(orderRepo)
	dashboardController := controller.NewDashboardController(dashboardService)

	dash := r.Group("/dashboard")
	// 認証済みユーザが利用可能
	dash.Use(middleware.AuthMiddleware())
	{
		dash.GET("", dashboardController.GetOrderAnalytics)
	}
}
