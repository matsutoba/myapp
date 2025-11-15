package router

import (
	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/middleware"
	"github.com/matsubara/myapp/internal/user/controller"
	"github.com/matsubara/myapp/internal/user/repository"
	"github.com/matsubara/myapp/internal/user/service"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	// User repository, service, controller
	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	userController := controller.NewUserController(userService)

	// User routes (認証必須)
	users := r.Group("/users")
	users.Use(middleware.AuthMiddleware())
	{
		users.GET("", userController.GetUsers)
		users.GET(":id", userController.GetUserByID)
		users.POST("", userController.CreateUser)
		users.PUT(":id", userController.UpdateUser)
		users.DELETE(":id", userController.DeleteUser)
	}
}
