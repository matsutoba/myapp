package service

import (
	"testing"

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
