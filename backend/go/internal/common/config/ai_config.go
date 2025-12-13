package config

import (
	"os"

	"github.com/matsubara/myapp/internal/ai"
)

// LoadAIConfig: 環境変数から AI 設定を読み込む
func LoadAIConfig() ai.Config {
	engineType := os.Getenv("AI_ENGINE")
	if engineType == "" {
		engineType = "ollama" // デフォルト
	}

	cfg := ai.Config{
		Type:      engineType,
		MaxTokens: 500,
	}

	switch engineType {
	case "openai":
		cfg.OpenAIAPIKey = os.Getenv("OPENAI_API_KEY")
		cfg.OpenAIModel = os.Getenv("OPENAI_MODEL")
		if cfg.OpenAIModel == "" {
			cfg.OpenAIModel = "gpt-4o-mini"
		}
	case "ollama":
		cfg.OllamaEndpoint = os.Getenv("OLLAMA_ENDPOINT")
		if cfg.OllamaEndpoint == "" {
			cfg.OllamaEndpoint = "http://localhost:11434"
		}
		cfg.OllamaModel = os.Getenv("OLLAMA_MODEL")
		if cfg.OllamaModel == "" {
			cfg.OllamaModel = "llama2"
		}
	}

	return cfg
}
