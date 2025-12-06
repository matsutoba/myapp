package dto

import (
	"time"

	orderrepo "github.com/matsubara/myapp/internal/order/repository"
)

type KPIs struct {
	TotalOrders   int64   `json:"totalOrders"`
	TotalRevenue  float64 `json:"totalRevenue"`
	AvgOrderValue float64 `json:"avgOrderValue"`
}

type DashboardResponse struct {
	KPIs        KPIs                          `json:"kpis"`
	Timeseries  []orderrepo.OrderAggregateRow `json:"timeseries"`
	GeneratedAt time.Time                     `json:"generatedAt"`
	Cached      bool                          `json:"cached"`
}
