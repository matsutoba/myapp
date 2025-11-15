package router

import (
	"github.com/gin-gonic/gin"
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

	// Customer routes
	customers := r.Group("/customers")
	{
		customers.GET("", customerController.GetCustomers)
		customers.GET("/:id", customerController.GetCustomerByID)
		customers.POST("", customerController.CreateCustomer)
		customers.PUT("/:id", customerController.UpdateCustomer)
		customers.DELETE("/:id", customerController.DeleteCustomer)
	}
}
