package repository

import (
    "testing"
    "time"

    "github.com/matsubara/myapp/internal/domain"
    "github.com/stretchr/testify/assert"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

func setupInMemoryDB(t *testing.T) *gorm.DB {
    db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    assert.NoError(t, err)

    err = db.AutoMigrate(&domain.Customer{})
    assert.NoError(t, err)
    return db
}

func TestCountByRankBetween(t *testing.T) {
    db := setupInMemoryDB(t)
    // seed customers with different ranks and created_at
    times := []string{"2025-06-01", "2025-07-15", "2025-08-20", "2025-10-05"}
    ranks := []string{"vip", "gold", "vip", "bronze"}

    for i := 0; i < len(times); i++ {
        ct, _ := time.Parse("2006-01-02", times[i])
        c := domain.Customer{ContactName: "T", Email: "t@example.com", CustomerRank: ranks[i], CreatedAt: ct, UpdatedAt: ct}
        if err := db.Create(&c).Error; err != nil {
            t.Fatalf("failed to seed customer: %v", err)
        }
    }

    repo := NewCustomerRepository(db)
    start := "2025-06-01"
    end := "2025-12-31"
    rows, err := repo.CountByRankBetween(start, end)
    assert.NoError(t, err)

    // convert to map for easy assertions
    m := map[string]int64{}
    for _, r := range rows {
        m[r.CustomerRank] = r.Count
    }

    assert.Equal(t, int64(2), m["vip"])   // two vip
    assert.Equal(t, int64(1), m["gold"])  // one gold
    assert.Equal(t, int64(1), m["bronze"])// one bronze
}

func TestMonthlyNewCustomers(t *testing.T) {
    db := setupInMemoryDB(t)
    // seed customers spanning several months
    seed := []struct{
        date string
        rank string
    }{
        {"2025-06-10", "vip"},
        {"2025-06-20", "gold"},
        {"2025-07-05", "vip"},
        {"2025-07-15", "bronze"},
        {"2025-08-01", "gold"},
    }

    for _, s := range seed {
        ct, _ := time.Parse("2006-01-02", s.date)
        c := domain.Customer{ContactName: "X", Email: "x@example.com", CustomerRank: s.rank, CreatedAt: ct, UpdatedAt: ct}
        if err := db.Create(&c).Error; err != nil {
            t.Fatalf("failed to seed customer: %v", err)
        }
    }

    repo := NewCustomerRepository(db)
    start := "2025-06-01"
    end := "2025-08-31"
    rows, err := repo.MonthlyNewCustomers(start, end)
    assert.NoError(t, err)

    // expect counts per month: 2025-06 => 2, 2025-07 => 2, 2025-08 => 1
    m := map[string]int64{}
    for _, r := range rows {
        m[r.YearMonth] = r.NewCustomers
    }

    assert.Equal(t, int64(2), m["2025-06"])
    assert.Equal(t, int64(2), m["2025-07"])
    assert.Equal(t, int64(1), m["2025-08"])
}

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
