package middleware

import (
	"crypto/subtle"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/config"
)

// APIKeyMiddleware はシンプルな API キー認証を提供します。
// - 環境変数 `API_KEY` が未設定の場合はミドルウェアは無効（許可）となり、既存環境との互換性を保ちます。
// - リクエストヘッダ `X-API-Key` または `Authorization: Bearer <key>` を受け付けます。
// - `/api/auth` パスは例外として許可します（ログインなど公開エンドポイント向け）。
func APIKeyMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		apiKey := config.GetEnv("API_KEY", "")
		// API_KEY 未設定ならチェックをスキップ（既存の動作を壊さない）
		if apiKey == "" {
			c.Next()
			return
		}

		// /api/auth のような公開ルートは例外にする
		if strings.HasPrefix(c.Request.URL.Path, "/api/auth") {
			c.Next()
			return
		}

		// ヘッダから取得 (X-API-Key 優先、次に Authorization: Bearer ...)
		key := c.GetHeader("X-API-Key")
		if key == "" {
			auth := c.GetHeader("Authorization")
			if len(auth) > 7 && strings.HasPrefix(auth, "Bearer ") {
				key = auth[7:]
			}
		}

		if key == "" || subtle.ConstantTimeCompare([]byte(key), []byte(apiKey)) != 1 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid api key"})
			return
		}

		c.Next()
	}
}
