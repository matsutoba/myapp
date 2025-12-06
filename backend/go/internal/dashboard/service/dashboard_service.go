package service

import (
	"context"
	"time"

	"github.com/matsubara/myapp/internal/dashboard/dto"
	orderrepo "github.com/matsubara/myapp/internal/order/repository"
)

type DashboardService interface {
	GetOrderAnalytics(ctx context.Context, start time.Time, end time.Time, groupBy string) (*dto.DashboardResponse, error)
}

type dashboardService struct {
	orderRepo orderrepo.OrderRepository
}

func NewDashboardService(or orderrepo.OrderRepository) DashboardService {
	return &dashboardService{orderRepo: or}
}

func (s *dashboardService) GetOrderAnalytics(ctx context.Context, start time.Time, end time.Time, groupBy string) (*dto.DashboardResponse, error) {
	// GetDashboard はダッシュボード表示用の集計データを構築して返します。
	// 返却されるデータの構成:
	// - KPIs: 期間合計の要約値
	//   - TotalOrders: 期間内の注文数合計
	//   - TotalRevenue: 期間内の注文 `amount` 合計
	//   - AvgOrderValue: TotalRevenue / TotalOrders（注文が無い場合は 0）
	// - Timeseries: `groupBy`（day|week|month）単位の集計配列（OrderAggregateRow）
	//   - 各行は period, total, count, avg をもつ（例: { period: "2025-12-01", total: 1000, count: 5, avg: 200 }）
	// - GeneratedAt: レスポンス生成時刻
	// - Cached: キャッシュから提供されたかどうか
	//
	// 実装ノート:
	// - 内部では既存の OrderRepository.Aggregate を利用して時系列集計を取得します。
	// - `start`/`end` の範囲は inclusive として扱われます（service 側で end に 24h-1 を加算）。
	// - フィルタ（status, category）は現在空文字で渡しているため未指定となります。必要であれば引数を拡張してください。
	// - 重い集計は将来的にキャッシュやマテリアライズドビューで最適化してください。

	// Use order repository aggregate to get timeseries
	rows, err := s.orderRepo.Aggregate(start, end.Add(24*time.Hour-1), groupBy, "", "")
	if err != nil {
		return nil, err
	}

	var totalOrders int64 = 0
	var totalRevenue float64 = 0
	for _, r := range rows {
		totalOrders += r.Count
		totalRevenue += r.Total
	}

	avg := 0.0
	if totalOrders > 0 {
		avg = totalRevenue / float64(totalOrders)
	}

	if rows == nil {
		rows = []orderrepo.OrderAggregateRow{}
	}

	resp := &dto.DashboardResponse{
		KPIs: dto.KPIs{
			TotalOrders:   totalOrders,
			TotalRevenue:  totalRevenue,
			AvgOrderValue: avg,
		},
		Timeseries:  rows,
		From:        start.Format("2006-01-02"),
		To:          end.Format("2006-01-02"),
		GeneratedAt: time.Now().UTC(),
		Cached:      false,
	}

	return resp, nil
}
