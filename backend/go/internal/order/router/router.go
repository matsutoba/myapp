package router

import (
	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/middleware"
	custrepo "github.com/matsubara/myapp/internal/customer/repository"
	custservice "github.com/matsubara/myapp/internal/customer/service"
	"github.com/matsubara/myapp/internal/order/controller"
	"github.com/matsubara/myapp/internal/order/repository"
	"github.com/matsubara/myapp/internal/order/service"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	orderRepo := repository.NewOrderRepository(db)
	// create and inject customer service so OrderService can validate customer existence
	customerRepo := custrepo.NewCustomerRepository(db)
	customerService := custservice.NewCustomerService(customerRepo)
	orderService := service.NewOrderService(orderRepo, customerService)
	orderController := controller.NewOrderController(orderService)

	orders := r.Group("/orders")
	orders.Use(middleware.AuthMiddleware())
	{
		orders.GET("", orderController.GetAggregates)
		orders.GET("/list", orderController.ListOrders)
		orders.GET("/by-customer", orderController.GetByCustomer)
		orders.GET(":id", orderController.GetOrderById)
		orders.POST("", orderController.CreateOrder)
		orders.PUT(":id", orderController.UpdateOrder)
		orders.DELETE(":id", orderController.DeleteOrder)
	}
}
