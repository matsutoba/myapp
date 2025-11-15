package controllers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/auth/controllers"
	"github.com/matsubara/myapp/internal/auth/dto"
	"github.com/matsubara/myapp/internal/auth/services/mocks"
	commonErrors "github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/domain"
	"github.com/stretchr/testify/assert"
)

type TestEnv struct {
	Router         *gin.Engine
	MockService    *mocks.AuthService
	AuthController *controllers.AuthController
}

func SetupTestEnv() *TestEnv {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := new(mocks.AuthService)
	authController := controllers.NewAuthController(mockService)

	return &TestEnv{
		Router:         router,
		MockService:    mockService,
		AuthController: authController,
	}
}

func TestAuthController_Login_Success(t *testing.T) {
	env := SetupTestEnv()
	env.Router.POST("/auth/login", env.AuthController.Login)

	now := time.Now()
	mockUser := &domain.User{
		ID:          1,
		Name:        "Test User",
		Email:       "test@example.com",
		Role:        "user",
		IsActive:    true,
		LastLoginAt: &now,
	}
	access := "access.token"
	refresh := "refresh.token"

	env.MockService.On("Login", "test@example.com", "password123").Return(mockUser, access, refresh, nil)

	// リクエストボディを作成
	loginReq := dto.LoginRequest{
		Email:    "test@example.com",
		Password: "password123",
	}
	body, _ := json.Marshal(loginReq)

	// HTTP リクエストを作成
	req, _ := http.NewRequest(http.MethodPost, "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証
	assert.Equal(t, http.StatusOK, w.Code)

	var resp dto.LoginResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Equal(t, access, resp.Token)
	assert.Equal(t, refresh, resp.RefreshToken)
	assert.Equal(t, uint(1), resp.User.ID)
	assert.Equal(t, "test@example.com", resp.User.Email)
	assert.Equal(t, "Test User", resp.User.Name)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestAuthController_Login_Unauthorized(t *testing.T) {
	env := SetupTestEnv()
	env.Router.POST("/auth/login", env.AuthController.Login)

	env.MockService.On("Login", "test@example.com", "wrongpassword").Return(nil, "", "", commonErrors.ErrUnauthorized)

	// リクエストボディを作成
	loginReq := dto.LoginRequest{
		Email:    "test@example.com",
		Password: "wrongpassword",
	}
	body, _ := json.Marshal(loginReq)

	// HTTP リクエストを作成
	req, _ := http.NewRequest(http.MethodPost, "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// リクエストを処理
	env.Router.ServeHTTP(w, req)

	// レスポンスの検証
	assert.Equal(t, http.StatusUnauthorized, w.Code)

	// モック呼び出しの検証
	env.MockService.AssertExpectations(t)
}

func TestAuthController_Login_InvalidRequest(t *testing.T) {
	env := SetupTestEnv()
	env.Router.POST("/auth/login", env.AuthController.Login)

	// 不正なJSONリクエスト
	invalidJSON := `{"email": "invalid-email", "password": ""}`

	req, _ := http.NewRequest(http.MethodPost, "/auth/login", bytes.NewBufferString(invalidJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestAuthController_Login_MissingEmail(t *testing.T) {
	env := SetupTestEnv()
	env.Router.POST("/auth/login", env.AuthController.Login)

	// メールアドレスが欠けているリクエスト
	loginReq := dto.LoginRequest{
		Password: "password123",
	}
	body, _ := json.Marshal(loginReq)

	req, _ := http.NewRequest(http.MethodPost, "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestAuthController_Login_MissingPassword(t *testing.T) {
	env := SetupTestEnv()
	env.Router.POST("/auth/login", env.AuthController.Login)

	// パスワードが欠けているリクエスト
	loginReq := dto.LoginRequest{
		Email: "test@example.com",
	}
	body, _ := json.Marshal(loginReq)

	req, _ := http.NewRequest(http.MethodPost, "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestAuthController_Login_InvalidJSON(t *testing.T) {
	env := SetupTestEnv()
	env.Router.POST("/auth/login", env.AuthController.Login)

	// 無効なJSON
	invalidJSON := `{invalid json}`

	req, _ := http.NewRequest(http.MethodPost, "/auth/login", bytes.NewBufferString(invalidJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	env.Router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
