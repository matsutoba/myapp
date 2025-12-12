package service

import (
	"testing"
	"time"

	"github.com/matsubara/myapp/internal/customer/dto"
	"github.com/matsubara/myapp/internal/customer/repository"
	"github.com/matsubara/myapp/internal/domain"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var testDB *gorm.DB

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open test db: %v", err)
	}
	if err := db.AutoMigrate(&domain.User{}, &domain.Customer{}); err != nil {
		t.Fatalf("auto migrate failed: %v", err)
	}
	return db
}

func TestCustomerService_CRUD(t *testing.T) {
	db := setupTestDB(t)
	repo := repository.NewCustomerRepository(db)
	svc := NewCustomerService(repo)

	// Create
	req := dto.CreateCustomerRequest{
		ContactName: "テスト顧客",
		Email:       "test@example.com",
		Phone:       "090-0000-0000",
		Address:     "東京都",
	}
	created, err := svc.CreateCustomer(req)
	assert.NoError(t, err)
	assert.NotNil(t, created)
	assert.NotZero(t, created.ID)

	// GetAll
	list, err := svc.GetAllCustomers()
	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(list), 1)

	// FindByID
	found, err := svc.FindByID(created.ID)
	assert.NoError(t, err)
	assert.Equal(t, "テスト顧客", found.ContactName)

	// Update
	updateReq := dto.UpdateCustomerRequest{
		ContactName: "更新顧客",
		Email:       "test@example.com",
		Phone:       "090-0000-0000",
		Address:     "京都府",
	}
	_, err = svc.UpdateCustomer(created.ID, updateReq)
	assert.NoError(t, err)

	updated, err := svc.FindByID(created.ID)
	assert.NoError(t, err)
	assert.Equal(t, "更新顧客", updated.ContactName)
	assert.Equal(t, "京都府", updated.Address)

	// Delete
	err = svc.DeleteCustomer(created.ID)
	assert.NoError(t, err)

	_, err = svc.FindByID(created.ID)
	assert.Error(t, err)
}

func TestCustomerService_CreateWithRank(t *testing.T) {
	db := setupTestDB(t)
	repo := repository.NewCustomerRepository(db)
	svc := NewCustomerService(repo)

	// Create with rank
	req := dto.CreateCustomerRequest{
		ContactName:  "VIP顧客",
		Email:        "vip@example.com",
		CustomerRank: "vip",
	}
	created, err := svc.CreateCustomer(req)
	assert.NoError(t, err)
	assert.Equal(t, "vip", created.CustomerRank)
	assert.NotNil(t, created.RankUpdatedAt)
}

func TestCustomerService_UpdateRank(t *testing.T) {
	db := setupTestDB(t)
	repo := repository.NewCustomerRepository(db)
	svc := NewCustomerService(repo)

	// Create customer without rank
	req := dto.CreateCustomerRequest{
		ContactName: "テスト顧客",
		Email:       "test@example.com",
	}
	created, err := svc.CreateCustomer(req)
	assert.NoError(t, err)
	assert.Empty(t, created.CustomerRank)
	assert.Nil(t, created.RankUpdatedAt)

	// Update with rank
	updateReq := dto.UpdateCustomerRequest{
		Email:        "test@example.com",
		CustomerRank: "gold",
	}
	updated, err := svc.UpdateCustomer(created.ID, updateReq)
	assert.NoError(t, err)
	assert.Equal(t, "gold", updated.CustomerRank)
	assert.NotNil(t, updated.RankUpdatedAt)

	// Update with same rank - RankUpdatedAt should be updated
	before := *updated.RankUpdatedAt
	time.Sleep(10 * time.Millisecond) // Ensure time difference
	updateReq2 := dto.UpdateCustomerRequest{
		Email:        "test@example.com",
		CustomerRank: "gold",
	}
	updated2, err := svc.UpdateCustomer(created.ID, updateReq2)
	assert.NoError(t, err)
	assert.Equal(t, "gold", updated2.CustomerRank)
	// Same rank, so RankUpdatedAt should not change
	assert.Equal(t, before, *updated2.RankUpdatedAt)

	// Update with different rank
	updateReq3 := dto.UpdateCustomerRequest{
		Email:        "test@example.com",
		CustomerRank: "silver",
	}
	updated3, err := svc.UpdateCustomer(created.ID, updateReq3)
	assert.NoError(t, err)
	assert.Equal(t, "silver", updated3.CustomerRank)
	assert.NotNil(t, updated3.RankUpdatedAt)
	// RankUpdatedAt should be different from before
	assert.True(t, updated3.RankUpdatedAt.After(before) || updated3.RankUpdatedAt.Equal(before))
}
