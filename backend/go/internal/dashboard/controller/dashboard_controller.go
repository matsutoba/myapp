package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/dashboard/service"
)

type DashboardController struct {
	svc service.DashboardService
}

func NewDashboardController(s service.DashboardService) *DashboardController {
	return &DashboardController{svc: s}
}

func (dc *DashboardController) GetOrderAnalytics(c *gin.Context) {
	// GetOrderAnalytics は注文情報の分析（ダッシュボード向け集計）を返します。内容は以下の通りです。
	// - KPIs: 指定期間の総括値
	//   - TotalOrders: 期間内の注文数合計
	//   - TotalRevenue: 期間内の注文 `amount` の合計
	//   - AvgOrderValue: TotalRevenue / TotalOrders（注文が無い場合は 0）
	// - Timeseries: 期間ごとの集計配列（period, total, count, avg）
	//   - 各エントリは `group_by`（day|week|month）に対応するバケットを表します。
	//   - period: バケットの日付表現（例: "2025-12-01"）
	//   - total: そのバケット内の `amount` 合計
	//   - count: そのバケット内の注文数
	//   - avg: そのバケット内の平均注文額
	// - GeneratedAt: レスポンス生成時のタイムスタンプ
	// - Cached: キャッシュから返却されたかどうかを示す真偽値
	//
	// 注意事項:
	// - ステータスやカテゴリによる絞り込みはリポジトリの Aggregate メソッドでサポートされています（サービス層で利用）。
	// - `from`/`to` は `YYYY-MM-DD` 形式でパースされ、省略時は直近30日（デフォルト）となります。`to` は包含的です。
	// - 金額は浮動小数点で返され、データベースに格納されている単位に従います。
	// - KPIs: 指定期間の総括値
	//   - TotalOrders: 期間内の注文数合計
	//   - TotalRevenue: 期間内の注文 `amount` の合計
	//   - AvgOrderValue: TotalRevenue / TotalOrders（注文が無い場合は 0）
	// - Timeseries: 期間ごとの集計配列（period, total, count, avg）
	//   - 各エントリは `group_by`（day|week|month）に対応するバケットを表します。
	//   - period: バケットの日付表現（例: "2025-12-01"）
	//   - total: そのバケット内の `amount` 合計
	//   - count: そのバケット内の注文数
	//   - avg: そのバケット内の平均注文額
	// - GeneratedAt: レスポンス生成時のタイムスタンプ
	// - Cached: キャッシュから返却されたかどうかを示す真偽値
	//
	// 注意事項:
	// - ステータスやカテゴリによる絞り込みはリポジトリの Aggregate メソッドでサポートされています（サービス層で利用）。
	// - `from`/`to` は `YYYY-MM-DD` 形式でパースされ、省略時は直近30日（デフォルト）となります。`to` は包含的です。
	// - 金額は浮動小数点で返され、データベースに格納されている単位に従います。

	// parse query params
	from := c.Query("from")
	to := c.Query("to")
	groupBy := c.DefaultQuery("group_by", "day")

	// defaults: last 30 days
	var start time.Time
	var end time.Time
	var err error
	if from == "" || to == "" {
		// set default range: today-29 .. today
		end = time.Now()
		start = end.AddDate(0, 0, -29)
	} else {
		start, err = time.Parse("2006-01-02", from)
		if err != nil {
			errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
			return
		}
		end, err = time.Parse("2006-01-02", to)
		if err != nil {
			errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
			return
		}
	}

	resp, err := dc.svc.GetOrderAnalytics(c.Request.Context(), start, end, groupBy)
	if err != nil {
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, resp)
}

// ランク別の顧客分布を返します
func (dc *DashboardController) GetCustomersByRank(c *gin.Context) {
	from := c.Query("from")
	to := c.Query("to")

	var start time.Time
	var end time.Time
	var err error
	if from == "" || to == "" {
		end = time.Now()
		start = end.AddDate(0, -6, 0) // default: last 6 months
	} else {
		start, err = time.Parse("2006-01-02", from)
		if err != nil {
			errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
			return
		}
		end, err = time.Parse("2006-01-02", to)
		if err != nil {
			errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
			return
		}
	}

	resp, err := dc.svc.GetCustomersByRank(c.Request.Context(), start, end)
	if err != nil {
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, resp)
}

// 月別の新規顧客数を返します。クエリパラメータ: from, to (YYYY-MM-DD)
func (dc *DashboardController) GetNewSignups(c *gin.Context) {
	from := c.Query("from")
	to := c.Query("to")

	var start time.Time
	var end time.Time
	var err error
	if from == "" || to == "" {
		end = time.Now()
		start = end.AddDate(0, -6, 0) // default: last 6 months
	} else {
		start, err = time.Parse("2006-01-02", from)
		if err != nil {
			errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
			return
		}
		end, err = time.Parse("2006-01-02", to)
		if err != nil {
			errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
			return
		}
	}

	resp, err := dc.svc.GetMonthlyNewCustomers(c.Request.Context(), start, end)
	if err != nil {
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, resp)
}

// SummarizeDashboard: AI がダッシュボード全体を要約
func (dc *DashboardController) SummarizeDashboard(c *gin.Context) {
	from := c.Query("from")
	to := c.Query("to")
	language := c.DefaultQuery("language", "ja")

	var start time.Time
	var end time.Time
	var err error
	if from == "" || to == "" {
		end = time.Now()
		start = end.AddDate(0, -6, 0) // default: last 6 months
	} else {
		start, err = time.Parse("2006-01-02", from)
		if err != nil {
			errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
			return
		}
		end, err = time.Parse("2006-01-02", to)
		if err != nil {
			errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
			return
		}
	}

	resp, err := dc.svc.SummarizeDashboard(c.Request.Context(), start, end, language)
	if err != nil {
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, resp)
}
