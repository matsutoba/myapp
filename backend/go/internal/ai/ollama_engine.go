package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// OllamaEngine: ローカル Ollama を使用する実装
type OllamaEngine struct {
	endpoint  string
	model     string
	maxTokens int
	client    *http.Client
}

// NewOllamaEngine: Ollama エンジンを生成
func NewOllamaEngine(endpoint string, model string, maxTokens int) *OllamaEngine {
	if model == "" {
		model = "llama2" // デフォルトモデル
	}
	if maxTokens == 0 {
		maxTokens = 500
	}
	return &OllamaEngine{
		endpoint:  endpoint,
		model:     model,
		maxTokens: maxTokens,
		client:    &http.Client{},
	}
}

// Summarize: Ollama を使用して要約を生成
func (e *OllamaEngine) Summarize(ctx context.Context, req SummaryRequest) (*SummaryResponse, error) {
	prompt := buildPrompt(req)

	// Ollama API リクエスト
	ollamaReq := map[string]interface{}{
		"model":   e.model,
		"prompt":  prompt,
		"stream":  false,
		"context": nil,
	}

	reqBody, err := json.Marshal(ollamaReq)
	if err != nil {
		return &SummaryResponse{
			Error: fmt.Sprintf("Failed to marshal request: %v", err),
		}, err
	}

	// HTTP POST リクエスト
	httpReq, err := http.NewRequestWithContext(ctx, "POST", e.endpoint+"/api/generate", bytes.NewBuffer(reqBody))
	if err != nil {
		return &SummaryResponse{
			Error: fmt.Sprintf("Failed to create request: %v", err),
		}, err
	}

	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := e.client.Do(httpReq)
	if err != nil {
		return &SummaryResponse{
			Error: fmt.Sprintf("Ollama API error: %v", err),
		}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return &SummaryResponse{
			Error: fmt.Sprintf("Ollama API returned status %d: %s", resp.StatusCode, string(body)),
		}, fmt.Errorf("ollama api error: status %d", resp.StatusCode)
	}

	// レスポンスをパース
	var ollamaResp map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&ollamaResp); err != nil {
		return &SummaryResponse{
			Error: fmt.Sprintf("Failed to parse Ollama response: %v", err),
		}, err
	}

	// レスポンスから summary を抽出
	response, ok := ollamaResp["response"].(string)
	if !ok {
		return &SummaryResponse{
			Error: "Invalid Ollama response format",
		}, fmt.Errorf("invalid response format")
	}

	return &SummaryResponse{
		Summary: response,
	}, nil
}
