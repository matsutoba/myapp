// (削除)
package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/config"
	"github.com/matsubara/myapp/internal/common/security"
)

// AuthMiddleware はJWT認証ミドルウェアを提供
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Authorizationヘッダの確認
		tokenString := c.GetHeader("Authorization")
		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}
		// なければCookieを確認 (accessToken優先、fallbackでレガシーなauthToken)
		if tokenString == "" {
			if cookie, err := c.Cookie("accessToken"); err == nil && cookie != "" {
				tokenString = cookie
			} else if legacy, err2 := c.Cookie("authToken"); err2 == nil && legacy != "" {
				tokenString = legacy
			}
		}
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
			return
		}
		// トークン検証
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
