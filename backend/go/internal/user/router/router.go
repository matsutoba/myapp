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
		// 読み取りは認証済みユーザー全員可能
		users.GET("", userController.GetUsers)
		users.GET(":id", userController.GetUserByID)

		// 作成・更新・削除はadmin専用
		users.POST("", middleware.RequireAdmin(), userController.CreateUser)
		users.PUT(":id", middleware.RequireAdmin(), userController.UpdateUser)
		users.DELETE(":id", middleware.RequireAdmin(), userController.DeleteUser)
	}
}
