package middleware

import (
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/config"
)

/*
CORSミドルウェアを提供

環境変数:
- CORS_ALLOW_ORIGINS: カンマ区切りのリスト (デフォルト: http://localhost:3000)
- CORS_ALLOW_METHODS: カンマ区切り (デフォルト: GET,POST,PUT,DELETE,OPTIONS)
- CORS_ALLOW_HEADERS: カンマ区切り (デフォルト: Authorization,Content-Type,X-Requested-With)
- CORS_ALLOW_CREDENTIALS: true/false (デフォルト: true) Cookieを跨ぐ場合（フロントが別ドメイン/サブドメイン）の設定にtrue
- CORS_MAX_AGE_SECONDS: 事前検証キャッシュ秒数 (デフォルト: 43200 = 12時間)
*/
func CORSMiddleware() gin.HandlerFunc {
	// Origins
	originsCSV := config.GetEnv("CORS_ALLOW_ORIGINS", "http://localhost:3000")
	var origins []string
	for _, o := range strings.Split(originsCSV, ",") {
		t := strings.TrimSpace(o)
		if t != "" {
			origins = append(origins, t)
		}
	}

	// Methods
	methodsCSV := config.GetEnv("CORS_ALLOW_METHODS", "GET,POST,PUT,DELETE,OPTIONS")
	var methods []string
	for _, m := range strings.Split(methodsCSV, ",") {
		t := strings.TrimSpace(m)
		if t != "" {
			methods = append(methods, t)
		}
	}

	// Headers
	headersCSV := config.GetEnv("CORS_ALLOW_HEADERS", "Authorization,Content-Type,X-Requested-With")
	var headers []string
	for _, h := range strings.Split(headersCSV, ",") {
		t := strings.TrimSpace(h)
		if t != "" {
			headers = append(headers, t)
		}
	}

	// Credentials
	allowCreds := strings.EqualFold(config.GetEnv("CORS_ALLOW_CREDENTIALS", "true"), "true")

	// Max Age
	maxAgeSecs := config.GetEnvAsInt("CORS_MAX_AGE_SECONDS", 43200) // 12h

	cfg := cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     methods,
		AllowHeaders:     headers,
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: allowCreds,
		MaxAge:           time.Duration(maxAgeSecs) * time.Second,
	}

	return cors.New(cfg)
}
