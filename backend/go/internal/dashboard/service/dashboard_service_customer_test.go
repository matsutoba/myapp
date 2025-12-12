package service

import (
	"context"
	"testing"
	"time"

	customerrepo "github.com/matsubara/myapp/internal/customer/repository"
	"github.com/matsubara/myapp/internal/domain"
	orderrepo "github.com/matsubara/myapp/internal/order/repository"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// fake order repo that satisfies the OrderRepository interface's Aggregate method
type fakeOrderRepo struct{}

func (f *fakeOrderRepo) Aggregate(start time.Time, end time.Time, period string, status string, category string) ([]orderrepo.OrderAggregateRow, error) {
	return []orderrepo.OrderAggregateRow{}, nil
}

func (f *fakeOrderRepo) GetByCustomer(customerID uint, limit int, offset int) ([]domain.Order, error) {
	return nil, nil
}

func (f *fakeOrderRepo) GetAll(limit int, offset int) ([]domain.Order, error) {
	return nil, nil
}

func (f *fakeOrderRepo) Search(q string, limit int, offset int) ([]domain.Order, error) {
	return nil, nil
}

func (f *fakeOrderRepo) CountSearch(q string) (int64, error) {
	return 0, nil
}

func (f *fakeOrderRepo) CountAll() (int64, error) {
	return 0, nil
}

func (f *fakeOrderRepo) Create(order *domain.Order) (*domain.Order, error) {
	return nil, nil
}

func (f *fakeOrderRepo) Update(order *domain.Order) (*domain.Order, error) {
	return nil, nil
}

func (f *fakeOrderRepo) Delete(id uint) error {
	return nil
}

func (f *fakeOrderRepo) FindByID(id uint) (*domain.Order, error) {
	return nil, nil
}

func setupDBAndRepo(t *testing.T) (*gorm.DB, customerrepo.CustomerRepository) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	err = db.AutoMigrate(&domain.Customer{})
	assert.NoError(t, err)
	repo := customerrepo.NewCustomerRepository(db)
	return db, repo
}

func TestGetCustomersByRank_Service(t *testing.T) {
	_, repo := setupDBAndRepo(t)

	// seed customers
	samples := []domain.Customer{
		{ContactName: "A", Email: "a@example.com", CustomerRank: "vip", CreatedAt: time.Date(2025, 6, 1, 0, 0, 0, 0, time.UTC), UpdatedAt: time.Date(2025, 6, 1, 0, 0, 0, 0, time.UTC)},
		{ContactName: "B", Email: "b@example.com", CustomerRank: "gold", CreatedAt: time.Date(2025, 7, 1, 0, 0, 0, 0, time.UTC), UpdatedAt: time.Date(2025, 7, 1, 0, 0, 0, 0, time.UTC)},
		{ContactName: "C", Email: "c@example.com", CustomerRank: "vip", CreatedAt: time.Date(2025, 8, 1, 0, 0, 0, 0, time.UTC), UpdatedAt: time.Date(2025, 8, 1, 0, 0, 0, 0, time.UTC)},
	}
	for _, s := range samples {
		if _, err := repo.Create(s); err != nil {
			t.Fatalf("failed to seed: %v", err)
		}
	}

	// create service with fake order repo
	svc := NewDashboardService(&fakeOrderRepo{}, repo)

	start := time.Date(2025, 6, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(2025, 9, 1, 0, 0, 0, 0, time.UTC)

	res, err := svc.GetCustomersByRank(context.Background(), start, end)
	assert.NoError(t, err)

	// convert to map
	m := map[string]int64{}
	for _, r := range res {
		m[r.Rank] = r.Count
	}

	assert.Equal(t, int64(2), m["vip"])  // two vip
	assert.Equal(t, int64(1), m["gold"]) // one gold
}
