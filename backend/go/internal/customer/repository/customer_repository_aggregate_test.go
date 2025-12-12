package repository

import (
	"testing"
	"time"

	"github.com/matsubara/myapp/internal/domain"
)

func TestCustomerRepository_Aggregates(t *testing.T) {
	repo := NewCustomerRepository(testDB)

	// clean table
	testDB.Exec("DELETE FROM customers")

	// seed customers with ranks and created_at across months
	samples := []domain.Customer{
		{ContactName: "A", Email: "a@example.com", CustomerRank: "vip", CreatedAt: time.Date(2025, 1, 10, 0, 0, 0, 0, time.UTC)},
		{ContactName: "B", Email: "b@example.com", CustomerRank: "gold", CreatedAt: time.Date(2025, 1, 15, 0, 0, 0, 0, time.UTC)},
		{ContactName: "C", Email: "c@example.com", CustomerRank: "vip", CreatedAt: time.Date(2025, 2, 5, 0, 0, 0, 0, time.UTC)},
		{ContactName: "D", Email: "d@example.com", CustomerRank: "bronze", CreatedAt: time.Date(2025, 2, 20, 0, 0, 0, 0, time.UTC)},
		{ContactName: "E", Email: "e@example.com", CustomerRank: "gold", CreatedAt: time.Date(2025, 3, 1, 0, 0, 0, 0, time.UTC)},
	}

	for _, s := range samples {
		_, err := repo.Create(s)
		if err != nil {
			t.Fatalf("failed to create sample customer: %v", err)
		}
	}

	// Test CountByRank
	rankRows, err := repo.CountByRank()
	if err != nil {
		t.Fatalf("CountByRank failed: %v", err)
	}
	// Expect counts: vip=2, gold=2, bronze=1 (order not guaranteed)
	counts := map[string]int64{}
	for _, r := range rankRows {
		counts[r.CustomerRank] = r.Count
	}
	if counts["vip"] != 2 {
		t.Fatalf("expected vip=2, got %d", counts["vip"])
	}
	if counts["gold"] != 2 {
		t.Fatalf("expected gold=2, got %d", counts["gold"])
	}
	if counts["bronze"] != 1 {
		t.Fatalf("expected bronze=1, got %d", counts["bronze"])
	}

	// Test MonthlyNewCustomers between 2025-01-01 and 2025-03-31
	rows, err := repo.MonthlyNewCustomers("2025-01-01", "2025-03-31")
	if err != nil {
		t.Fatalf("MonthlyNewCustomers failed: %v", err)
	}
	monthMap := map[string]int64{}
	for _, r := range rows {
		monthMap[r.YearMonth] = r.NewCustomers
	}
	if monthMap["2025-01"] != 2 {
		t.Fatalf("expected 2025-01=2, got %d", monthMap["2025-01"])
	}
	if monthMap["2025-02"] != 2 {
		t.Fatalf("expected 2025-02=2, got %d", monthMap["2025-02"])
	}
	if monthMap["2025-03"] != 1 {
		t.Fatalf("expected 2025-03=1, got %d", monthMap["2025-03"])
	}
}
