// (削除)
package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/config"
	"github.com/matsubara/myapp/internal/common/security"
)

// AuthMiddleware checks JWT token in Authorization header
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}
		// Bearer prefix対応
		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}
		// Use the same secret/key source as token generation
		secretKey := config.GetEnv("JWT_SECRET_KEY", "your-secret-key")
		claims, err := security.ValidateToken(tokenString, secretKey)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			return
		}
		// ユーザー情報をコンテキストにセット
		c.Set("user", claims)
		c.Next()
	}
}
