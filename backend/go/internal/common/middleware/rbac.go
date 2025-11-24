package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/common/security"
)

/*
ロールベースアクセス制御 (RBAC) ミドルウェア

このミドルウェアは、認証済みユーザーのロールに基づいてアクセス制御を行います。
特定のエンドポイントに対して、許可されたロールのリストを指定できます。

使用方法:
1. ルートグループまたは個々のルートに対して、このミドルウェアを適用します。
2. ミドルウェアは、コンテキストからユーザー情報を取得し、ユーザーのロールが許可リストに含まれているかを確認します。
3. 許可されていない場合、403 Forbidden エラーを返します。
*/
func RequireRole(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// userをコンテキストから取得
		userContext, exists := c.Get("user")
		log.Default().Println("RBAC Middleware - User Context:", userContext)

		if !exists {
			log.Default().Println("RBAC Middleware - No user context found")
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": gin.H{
					"code":    errors.ErrForbiddenNoUserContext.Code,
					"message": errors.ErrForbiddenNoUserContext.Message,
				},
			})
			return
		}

		// type assertion to *security.Claims
		claims, ok := userContext.(*security.Claims)
		if !ok {
			log.Default().Println("RBAC Middleware - Invalid user context type")
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": gin.H{
					"code":    errors.ErrForbiddenInvalidUserContext.Code,
					"message": errors.ErrForbiddenInvalidUserContext.Message,
				},
			})
			return
		}

		userRole := claims.Role
		if userRole == "" {
			log.Default().Println("RBAC Middleware - User role not found in context")
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": gin.H{
					"code":    errors.ErrForbiddenInvalidUserContext.Code,
					"message": errors.ErrForbiddenInvalidUserContext.Message,
				},
			})
			return
		}

		// ロールの確認
		for _, role := range allowedRoles {
			if userRole == role {
				c.Next()
				return
			}
		}

		log.Default().Println("RBAC Middleware - Insufficient permissions for role:", userRole)
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"error": gin.H{
				"code":    errors.ErrForbiddenInsufficientPerms.Code,
				"message": errors.ErrForbiddenInsufficientPerms.Message,
			},
		})
	}
}

// RequireAdmin はadminロール専用のミドルウェアを提供
func RequireAdmin() gin.HandlerFunc {
	return RequireRole("admin")
}
