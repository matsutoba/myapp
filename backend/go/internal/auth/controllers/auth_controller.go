package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/auth/dto"
	"github.com/matsubara/myapp/internal/auth/services"
	"github.com/matsubara/myapp/internal/common/errors"
)

type AuthController struct {
	service services.AuthService
}

func NewAuthController(s services.AuthService) *AuthController {
	return &AuthController{service: s}
}

func (ac *AuthController) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrBindingFailed)
		return
	}

	user, accessToken, refreshToken, err := ac.service.Login(req.Email, req.Password)
	if err != nil {
		if err == errors.ErrUnauthorized {
			errors.WriteError(c, http.StatusUnauthorized, err)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}

	response := dto.ToLoginResponse(user, accessToken, refreshToken)
	c.JSON(http.StatusOK, response)
}

// Refresh はクッキーまたはAuthorizationヘッダーからリフレッシュトークンを受け取り、
// 新しいアクセストークン/リフレッシュトークンを返す
func (ac *AuthController) Refresh(c *gin.Context) {
	// Cookie優先
	refreshToken, err := c.Cookie("refreshToken")
	if err != nil || refreshToken == "" {
		// Authorization: Bearer <token> も許可
		authz := c.GetHeader("Authorization")
		const prefix = "Bearer "
		if len(authz) > len(prefix) && authz[:len(prefix)] == prefix {
			refreshToken = authz[len(prefix):]
		}
	}

	user, access, newRefresh, svcErr := ac.service.Refresh(refreshToken)
	if svcErr != nil {
		if svcErr == errors.ErrUnauthorized {
			errors.WriteError(c, http.StatusUnauthorized, svcErr)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, svcErr)
		return
	}

	resp := dto.ToLoginResponse(user, access, newRefresh)
	c.JSON(http.StatusOK, resp)
}

// Logout はリフレッシュトークンを失効させる
func (ac *AuthController) Logout(c *gin.Context) {
	// Cookie優先
	refreshToken, err := c.Cookie("refreshToken")
	if err != nil || refreshToken == "" {
		// Authorization: Bearer <token> も許可
		authz := c.GetHeader("Authorization")
		const prefix = "Bearer "
		if len(authz) > len(prefix) && authz[:len(prefix)] == prefix {
			refreshToken = authz[len(prefix):]
		}
	}

	// トークンがない場合も成功とする（既にログアウト済み）
	if refreshToken == "" {
		c.JSON(http.StatusOK, gin.H{"message": "logged out"})
		return
	}

	if err := ac.service.Logout(refreshToken); err != nil {
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}
