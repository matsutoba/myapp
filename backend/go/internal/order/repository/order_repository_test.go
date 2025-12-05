package repository

import (
	"testing"
	"time"

	"github.com/matsubara/myapp/internal/domain"
	"github.com/stretchr/testify/require"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	require.NoError(t, err)
	require.NoError(t, db.AutoMigrate(&domain.Order{}))
	return db
}

func TestAggregate_DailyAndMonthly(t *testing.T) {
	db := setupTestDB(t)
	repo := NewOrderRepository(db)

	// seed orders across dates
	now := time.Now()
	// day1: 2025-01-01 two orders
	d1 := time.Date(2025, 1, 1, 10, 0, 0, 0, time.UTC)
	// day2: 2025-01-02 one order
	d2 := time.Date(2025, 1, 2, 12, 0, 0, 0, time.UTC)
	orders := []domain.Order{
		{CustomerID: 1, Amount: 1000, Currency: "JPY", ItemsCount: 1, CreatedAt: d1, UpdatedAt: d1},
		{CustomerID: 2, Amount: 2000, Currency: "JPY", ItemsCount: 2, CreatedAt: d1.Add(2 * time.Hour), UpdatedAt: d1.Add(2 * time.Hour)},
		{CustomerID: 1, Amount: 1500, Currency: "JPY", ItemsCount: 1, CreatedAt: d2, UpdatedAt: d2},
	}
	require.NoError(t, db.Create(&orders).Error)

	start := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(2025, 1, 3, 0, 0, 0, 0, time.UTC)

	// daily
	rows, err := repo.Aggregate(start, end, "day", "", "")
	require.NoError(t, err)
	require.Len(t, rows, 2)
	// verify totals
	// map by period
	m := map[string]float64{}
	for _, r := range rows {
		m[r.Period] = r.Total
	}
	require.Equal(t, 3000.0, m["2025-01-01"]) // 1000 + 2000
	require.Equal(t, 1500.0, m["2025-01-02"]) // 1500

	// monthly
	mrows, err := repo.Aggregate(start, end, "month", "", "")
	require.NoError(t, err)
	require.Len(t, mrows, 1)
	// expected sum for the month: 1000 + 2000 + 1500 = 4500
	require.InEpsilon(t, 4500.0, mrows[0].Total, 0.0001)

	_ = now
}

func TestGetByCustomer(t *testing.T) {
	db := setupTestDB(t)
	repo := NewOrderRepository(db)

	// seed
	o1 := domain.Order{CustomerID: 5, Amount: 500, Currency: "JPY", CreatedAt: time.Now(), UpdatedAt: time.Now()}
	o2 := domain.Order{CustomerID: 5, Amount: 700, Currency: "JPY", CreatedAt: time.Now(), UpdatedAt: time.Now()}
	require.NoError(t, db.Create(&[]domain.Order{o1, o2}).Error)

	rows, err := repo.GetByCustomer(5, 10, 0)
	require.NoError(t, err)
	require.Len(t, rows, 2)
}

func TestGetAllAndCount_CreateUpdateDelete_FindByID(t *testing.T) {
	db := setupTestDB(t)
	repo := NewOrderRepository(db)
	// ensure table is clean for this test (other tests may share in-memory DB)
	_ = db.Exec("DELETE FROM orders")

	// create several orders
	o1 := domain.Order{CustomerID: 10, Amount: 100, Currency: "JPY", ItemsCount: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	o2 := domain.Order{CustomerID: 11, Amount: 200, Currency: "JPY", ItemsCount: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	o3 := domain.Order{CustomerID: 12, Amount: 300, Currency: "JPY", ItemsCount: 3, CreatedAt: time.Now(), UpdatedAt: time.Now()}

	// Create
	created1, err := repo.Create(&o1)
	require.NoError(t, err)
	require.NotZero(t, created1.ID)

	created2, err := repo.Create(&o2)
	require.NoError(t, err)
	_, err = repo.Create(&o3)
	require.NoError(t, err)

	// GetAll with limit/offset
	rows, err := repo.GetAll(2, 0)
	require.NoError(t, err)
	require.Len(t, rows, 2)

	// CountAll
	cnt, err := repo.CountAll()
	require.NoError(t, err)
	require.EqualValues(t, 3, cnt)

	// FindByID success
	f, err := repo.FindByID(created2.ID)
	require.NoError(t, err)
	require.Equal(t, created2.ID, f.ID)

	// Update
	f.Amount = 999.5
	updated, err := repo.Update(f)
	require.NoError(t, err)
	require.Equal(t, 999.5, updated.Amount)

	// Delete success
	require.NoError(t, repo.Delete(created1.ID))

	// Delete not found
	err = repo.Delete(0)
	require.Error(t, err)
}
