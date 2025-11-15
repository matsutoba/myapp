package router

import (
	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/middleware"
	"github.com/matsubara/myapp/internal/customer/controller"
	"github.com/matsubara/myapp/internal/customer/repository"
	"github.com/matsubara/myapp/internal/customer/service"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	// Customer repository, service, controller
	customerRepo := repository.NewCustomerRepository(db)
	customerService := service.NewCustomerService(customerRepo)
	customerController := controller.NewCustomerController(customerService)

	// Customer routes (認証必須)
	customers := r.Group("/customers")
	customers.Use(middleware.AuthMiddleware())
	{
		// 読み取りは認証済みユーザー全員可能
		customers.GET("", customerController.GetCustomers)
		customers.GET(":id", customerController.GetCustomerByID)

		// 作成・更新・削除はadmin専用
		customers.POST("", middleware.RequireAdmin(), customerController.CreateCustomer)
		customers.PUT(":id", middleware.RequireAdmin(), customerController.UpdateCustomer)
		customers.DELETE(":id", middleware.RequireAdmin(), customerController.DeleteCustomer)
	}
}
