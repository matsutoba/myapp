package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
		userClaims, exists := c.Get("user")
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden: no user context"})
			return
		}

		claims, ok := userClaims.(*security.Claims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden: invalid user context"})
			return
		}

		// ロールの確認
		for _, role := range allowedRoles {
			if claims.Role == role {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden: insufficient permissions"})
	}
}

// RequireAdmin はadminロール専用のミドルウェアを提供
func RequireAdmin() gin.HandlerFunc {
	return RequireRole("admin")
}
