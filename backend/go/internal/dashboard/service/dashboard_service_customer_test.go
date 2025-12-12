package service_test

import (
	"context"
	"testing"
	"time"

	customerrepo "github.com/matsubara/myapp/internal/customer/repository"
	svc "github.com/matsubara/myapp/internal/dashboard/service"
	"github.com/matsubara/myapp/internal/domain"
)

// fake customer repo
type fakeCustomerRepo struct{}

func (f *fakeCustomerRepo) GetAll() ([]domain.Customer, error) { return nil, nil }
func (f *fakeCustomerRepo) GetPaginated(skip int, take int, keyword string) ([]domain.Customer, int64, error) {
	return nil, 0, nil
}
func (f *fakeCustomerRepo) FindByID(id uint) (*domain.Customer, error)         { return nil, nil }
func (f *fakeCustomerRepo) Create(c domain.Customer) (*domain.Customer, error) { return nil, nil }
func (f *fakeCustomerRepo) Update(c domain.Customer) (*domain.Customer, error) { return nil, nil }
func (f *fakeCustomerRepo) Delete(id uint) error                               { return nil }

func (f *fakeCustomerRepo) CountByRank() ([]customerrepo.RankCountRow, error) {
	return []customerrepo.RankCountRow{{CustomerRank: "vip", Count: 3}, {CustomerRank: "gold", Count: 1}}, nil
}

func (f *fakeCustomerRepo) MonthlyNewCustomers(start, end string) ([]customerrepo.MonthCountRow, error) {
	return []customerrepo.MonthCountRow{{YearMonth: "2025-01", NewCustomers: 2}, {YearMonth: "2025-02", NewCustomers: 4}}, nil
}

// fake order repo (only to satisfy constructor)
// reuse fakeOrderRepo defined in other test file

func TestDashboardService_CustomersEndpoints(t *testing.T) {
	orderRepo := &fakeOrderRepo{}
	custRepo := &fakeCustomerRepo{}
	s := svc.NewDashboardService(orderRepo, custRepo)

	// Test GetCustomersByRank
	ranks, err := s.GetCustomersByRank(context.Background())
	if err != nil {
		t.Fatalf("GetCustomersByRank error: %v", err)
	}
	if len(ranks) != 2 {
		t.Fatalf("expected 2 rank rows, got %d", len(ranks))
	}
	// simple content checks
	if ranks[0].Rank != "vip" || ranks[0].Count != 3 {
		t.Fatalf("unexpected first rank row: %+v", ranks[0])
	}

	// Test GetMonthlyNewCustomers
	start := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(2025, 2, 28, 0, 0, 0, 0, time.UTC)
	months, err := s.GetMonthlyNewCustomers(context.Background(), start, end)
	if err != nil {
		t.Fatalf("GetMonthlyNewCustomers error: %v", err)
	}
	if len(months) != 2 {
		t.Fatalf("expected 2 months, got %d", len(months))
	}
	if months[0].Month != "2025-01" || months[0].NewCustomers != 2 {
		t.Fatalf("unexpected first month row: %+v", months[0])
	}
}
