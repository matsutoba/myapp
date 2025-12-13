package controller_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	ctrl "github.com/matsubara/myapp/internal/dashboard/controller"
	"github.com/matsubara/myapp/internal/dashboard/dto"
	orderrepo "github.com/matsubara/myapp/internal/order/repository"
)

// minimal service implementation matching DashboardService for tests
type svcImpl struct{}

func (s *svcImpl) GetOrderAnalytics(ctx context.Context, start time.Time, end time.Time, groupBy string) (*dto.DashboardResponse, error) {
	return &dto.DashboardResponse{
		KPIs:        dto.KPIs{TotalOrders: 2, TotalRevenue: 3000, AvgOrderValue: 1500},
		Timeseries:  []orderrepo.OrderAggregateRow{},
		GeneratedAt: time.Now().UTC(),
		Cached:      false,
	}, nil
}

func (s *svcImpl) GetCustomersByRank(ctx context.Context, start time.Time, end time.Time) ([]dto.RankCount, error) {
	return []dto.RankCount{}, nil
}

func (s *svcImpl) GetMonthlyNewCustomers(ctx context.Context, start time.Time, end time.Time) ([]dto.MonthlyNew, error) {
	return []dto.MonthlyNew{}, nil
}

func (s *svcImpl) SummarizeDashboard(ctx context.Context, start time.Time, end time.Time, language string) (interface{}, error) {
	return nil, nil
}

func TestGetOrderAnalytics_ControllerReturns200(t *testing.T) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	req := httptest.NewRequest(http.MethodGet, "/api/dashboard", nil)
	c.Request = req

	svc := &svcImpl{}
	controller := ctrl.NewDashboardController(svc)
	controller.GetOrderAnalytics(c)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var resp dto.DashboardResponse
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}
	if resp.KPIs.TotalOrders != 2 {
		t.Fatalf("expected TotalOrders 2, got %d", resp.KPIs.TotalOrders)
	}
}
