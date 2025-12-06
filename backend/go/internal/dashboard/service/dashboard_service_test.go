package service_test

import (
	"context"
	"testing"
	"time"

	svc "github.com/matsubara/myapp/internal/dashboard/service"
	"github.com/matsubara/myapp/internal/domain"
	orderrepo "github.com/matsubara/myapp/internal/order/repository"
)

// fake repository implementing OrderRepository with minimal stubs
type fakeOrderRepo struct{}

func (f *fakeOrderRepo) GetByCustomer(customerID uint, limit int, offset int) ([]domain.Order, error) {
	return nil, nil
}
func (f *fakeOrderRepo) GetAll(limit int, offset int) ([]domain.Order, error) { return nil, nil }
func (f *fakeOrderRepo) Search(q string, limit int, offset int) ([]domain.Order, error) {
	return nil, nil
}
func (f *fakeOrderRepo) CountSearch(q string) (int64, error) { return 0, nil }
func (f *fakeOrderRepo) CountAll() (int64, error)            { return 0, nil }
func (f *fakeOrderRepo) Aggregate(start time.Time, end time.Time, period string, status string, category string) ([]orderrepo.OrderAggregateRow, error) {
	return []orderrepo.OrderAggregateRow{
		{Period: "2025-11-01", Total: 1000, Count: 2, Avg: 500},
		{Period: "2025-11-02", Total: 1500, Count: 3, Avg: 500},
	}, nil
}
func (f *fakeOrderRepo) Create(order *domain.Order) (*domain.Order, error) { return nil, nil }
func (f *fakeOrderRepo) Update(order *domain.Order) (*domain.Order, error) { return nil, nil }
func (f *fakeOrderRepo) Delete(id uint) error                              { return nil }
func (f *fakeOrderRepo) FindByID(id uint) (*domain.Order, error)           { return nil, nil }

// Note: Some methods above use placeholder types to satisfy the interface; tests only exercise Aggregate.

func TestGetOrderAnalytics_ServiceAggregates(t *testing.T) {
	repo := &fakeOrderRepo{}
	s := svc.NewDashboardService(repo)

	start := time.Date(2025, 11, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(2025, 11, 2, 0, 0, 0, 0, time.UTC)

	resp, err := s.GetOrderAnalytics(context.Background(), start, end, "day")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.KPIs.TotalOrders != 5 {
		t.Fatalf("expected total orders 5, got %d", resp.KPIs.TotalOrders)
	}
	if resp.KPIs.TotalRevenue != 2500 {
		t.Fatalf("expected total revenue 2500, got %f", resp.KPIs.TotalRevenue)
	}
	if resp.KPIs.AvgOrderValue != 500 {
		t.Fatalf("expected avg order value 500, got %f", resp.KPIs.AvgOrderValue)
	}
	if len(resp.Timeseries) != 2 {
		t.Fatalf("expected 2 timeseries rows, got %d", len(resp.Timeseries))
	}
}
