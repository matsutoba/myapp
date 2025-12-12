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
	From        string                        `json:"from,omitempty"`
	To          string                        `json:"to,omitempty"`
	GeneratedAt time.Time                     `json:"generatedAt"`
	Cached      bool                          `json:"cached"`
}

type RankCount struct {
	Rank  string `json:"rank"`
	Count int64  `json:"count"`
}

type MonthlyNew struct {
	Month        string `json:"month"`
	NewCustomers int64  `json:"newCustomers"`
}
