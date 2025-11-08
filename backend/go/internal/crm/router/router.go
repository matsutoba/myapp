package router

import (
	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/crm/controllers"
	"github.com/matsubara/myapp/internal/crm/repositories"
	"github.com/matsubara/myapp/internal/crm/services"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	crmRepo := repositories.NewCustomerRepository(db)
	crmService := services.NewCustomerService(crmRepo)
	crmController := controllers.NewCustomerController(crmService)

	api := r.Group("/crm")
	{
		api.GET("/customers", crmController.GetCustomers)
	}
}
