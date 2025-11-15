package router

import (
	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/auth/controllers"
	"github.com/matsubara/myapp/internal/auth/repositories"
	"github.com/matsubara/myapp/internal/auth/services"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	// Auth repository, service, controller
	authRepo := repositories.NewAuthRepository(db)
	authService := services.NewAuthService(authRepo)
	authController := controllers.NewAuthController(authService)

	// Auth routes
	auth := r.Group("/auth")
	{
		auth.POST("/login", authController.Login)
		auth.POST("/refresh", authController.Refresh)
		auth.POST("/logout", authController.Logout)
	}
}
