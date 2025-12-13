package ai

import (
	"context"
	"fmt"
)

// SummaryRequest: AI要約リクエスト
type SummaryRequest struct {
	// ダッシュボード分析対象期間
	From string `json:"from"`
	To   string `json:"to"`

	// KPI: 主要指標
	TotalOrders   int64   `json:"totalOrders"`
	TotalRevenue  float64 `json:"totalRevenue"`
	AvgOrderValue float64 `json:"avgOrderValue"`

	// 顧客ランク分布
	RankDistribution map[string]int64 `json:"rankDistribution"` // e.g., {"vip": 5, "gold": 10, ...}

	// 月別新規顧客
	MonthlyNewCustomers []MonthlyData `json:"monthlyNewCustomers"` // [{month, count}, ...]

	// 言語
	Language string `json:"language"` // "ja" or "en"
}

// MonthlyData: 月別統計
type MonthlyData struct {
	Month string `json:"month"` // YYYY-MM
	Count int64  `json:"count"` // 新規顧客数
}

// SummaryResponse: AI要約レスポンス
type SummaryResponse struct {
	Summary string `json:"summary"` // 要約テキスト
	Error   string `json:"error,omitempty"`
}

// Engine: AIエンジンのインターフェース
type Engine interface {
	// Summarize: ダッシュボード情報を要約テキストで返す
	Summarize(ctx context.Context, req SummaryRequest) (*SummaryResponse, error)
}

// Config: AI エンジン設定
type Config struct {
	// Engine type: "openai" or "ollama"
	Type string

	// OpenAI specific
	OpenAIAPIKey string
	OpenAIModel  string // e.g., "gpt-4" or "gpt-4o-mini"

	// Ollama specific
	OllamaEndpoint string // e.g., "http://localhost:11434"
	OllamaModel    string // e.g., "llama2", "mistral"

	// Common
	MaxTokens int
}

// NewEngine: 設定に基づいてエンジンを生成
func NewEngine(cfg Config) (Engine, error) {
	switch cfg.Type {
	case "openai":
		if cfg.OpenAIAPIKey == "" {
			return nil, fmt.Errorf("OpenAI API key is required")
		}
		return NewOpenAIEngine(cfg.OpenAIAPIKey, cfg.OpenAIModel, cfg.MaxTokens), nil

	case "ollama":
		if cfg.OllamaEndpoint == "" {
			return nil, fmt.Errorf("Ollama endpoint is required")
		}
		return NewOllamaEngine(cfg.OllamaEndpoint, cfg.OllamaModel, cfg.MaxTokens), nil

	default:
		return nil, fmt.Errorf("unsupported AI engine type: %s", cfg.Type)
	}
}
