package ai

import (
	"context"
	"fmt"

	"github.com/sashabaranov/go-openai"
)

// OpenAIEngine: OpenAI GPT API を使用する実装
type OpenAIEngine struct {
	client    *openai.Client
	model     string
	maxTokens int
}

// NewOpenAIEngine: OpenAI エンジンを生成
func NewOpenAIEngine(apiKey string, model string, maxTokens int) *OpenAIEngine {
	if model == "" {
		model = "gpt-4o-mini" // デフォルトモデル
	}
	if maxTokens == 0 {
		maxTokens = 500
	}
	return &OpenAIEngine{
		client:    openai.NewClient(apiKey),
		model:     model,
		maxTokens: maxTokens,
	}
}

// Summarize: OpenAI API を使用して要約を生成
func (e *OpenAIEngine) Summarize(ctx context.Context, req SummaryRequest) (*SummaryResponse, error) {
	// プロンプト作成
	prompt := buildPrompt(req)

	// OpenAI API 呼び出し
	resp, err := e.client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: e.model,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: "You are a business analytics expert. Analyze and summarize dashboard data in a concise, actionable way.",
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
		MaxTokens:   e.maxTokens,
		Temperature: 0.7,
	})

	if err != nil {
		return &SummaryResponse{
			Error: fmt.Sprintf("OpenAI API error: %v", err),
		}, err
	}

	if len(resp.Choices) == 0 {
		return &SummaryResponse{
			Error: "No response from OpenAI API",
		}, fmt.Errorf("no choices in OpenAI response")
	}

	return &SummaryResponse{
		Summary: resp.Choices[0].Message.Content,
	}, nil
}

// buildPrompt: SummaryRequest からプロンプトを構築
func buildPrompt(req SummaryRequest) string {
	rankStr := ""
	if len(req.RankDistribution) > 0 {
		rankStr = "\nCustomer Rank Distribution:\n"
		for rank, count := range req.RankDistribution {
			rankStr += fmt.Sprintf("- %s: %d customers\n", rank, count)
		}
	}

	monthlyStr := ""
	if len(req.MonthlyNewCustomers) > 0 {
		monthlyStr = "\nMonthly New Customers:\n"
		for _, m := range req.MonthlyNewCustomers {
			monthlyStr += fmt.Sprintf("- %s: %d new customers\n", m.Month, m.Count)
		}
	}

	lang := req.Language
	if lang == "ja" {
		return fmt.Sprintf(`ダッシュボード分析データ (%s ～ %s)

主要指標:
- 総注文数: %d 件
- 売上合計: ¥%.0f
- 平均注文額: ¥%.0f

%s
%s

上記データを分析して、日本語で3-5文の短い要約を作成してください。トレンド、見どころ、改善提案があれば含めてください。`,
			req.From, req.To,
			req.TotalOrders,
			req.TotalRevenue,
			req.AvgOrderValue,
			rankStr,
			monthlyStr,
		)
	}

	// Default to English
	return fmt.Sprintf(`Dashboard Analysis Data (%s to %s)

KPIs:
- Total Orders: %d
- Total Revenue: $%.2f
- Average Order Value: $%.2f

%s
%s

Analyze the above data and provide a brief 3-5 sentence summary in English. Include trends, highlights, and actionable insights if available.`,
		req.From, req.To,
		req.TotalOrders,
		req.TotalRevenue,
		req.AvgOrderValue,
		rankStr,
		monthlyStr,
	)
}
