package router

import (
	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/ai"
	"github.com/matsubara/myapp/internal/common/middleware"
	customerrepository "github.com/matsubara/myapp/internal/customer/repository"
	"github.com/matsubara/myapp/internal/dashboard/controller"
	"github.com/matsubara/myapp/internal/dashboard/service"
	"github.com/matsubara/myapp/internal/order/repository"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	// reuse order repository
	orderRepo := repository.NewOrderRepository(db)
	customerRepo := customerrepository.NewCustomerRepository(db)

	var dashboardService service.DashboardService
	dashboardService = service.NewDashboardService(orderRepo, customerRepo)

	dashboardController := controller.NewDashboardController(dashboardService)

	dash := r.Group("/dashboard")
	// 認証済みユーザが利用可能
	dash.Use(middleware.AuthMiddleware())
	{
		dash.GET("", dashboardController.GetOrderAnalytics)
		dash.GET("/customers/by-rank", dashboardController.GetCustomersByRank)
		dash.GET("/customers/new-signups", dashboardController.GetNewSignups)
		dash.GET("/summary", dashboardController.SummarizeDashboard)
	}
}

// RegisterRoutesWithAI: AI エンジンを指定してダッシュボードルートを登録
func RegisterRoutesWithAI(r *gin.RouterGroup, db *gorm.DB, aiEngine ai.Engine) {
	// reuse order repository
	orderRepo := repository.NewOrderRepository(db)
	customerRepo := customerrepository.NewCustomerRepository(db)

	var dashboardService service.DashboardService
	if aiEngine != nil {
		dashboardService = service.NewDashboardServiceWithAI(orderRepo, customerRepo, aiEngine)
	} else {
		dashboardService = service.NewDashboardService(orderRepo, customerRepo)
	}

	dashboardController := controller.NewDashboardController(dashboardService)

	dash := r.Group("/dashboard")
	// 認証済みユーザが利用可能
	dash.Use(middleware.AuthMiddleware())
	{
		dash.GET("", dashboardController.GetOrderAnalytics)
		dash.GET("/customers/by-rank", dashboardController.GetCustomersByRank)
		dash.GET("/customers/new-signups", dashboardController.GetNewSignups)
		dash.GET("/summary", dashboardController.SummarizeDashboard)
	}
}
