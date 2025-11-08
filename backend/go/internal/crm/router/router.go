package router

import (
	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/crm/controllers"
	"github.com/matsubara/myapp/internal/crm/repositories"
	"github.com/matsubara/myapp/internal/crm/services"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	customerRepo := repositories.NewCustomerRepository(db)
	customerService := services.NewCustomerService(customerRepo)
	customerController := controllers.NewCustomerController(customerService)

	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService)

	api := r.Group("/crm")
	{
		api.GET("/customers", customerController.GetCustomers)
		api.GET("/users", userController.GetUsers)
	}
}
