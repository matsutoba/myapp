package repository

import (
	"testing"

	"github.com/matsubara/myapp/internal/domain"
)

func TestCustomerRepository_CRUD(t *testing.T) {
	repo := NewCustomerRepository(testDB)

	// ======================
	// Create
	// ======================
	customer := domain.Customer{
		Name:    "Acme Corp",
		Email:   "customer1@example.com",
		Address: "123 Main St",
		Phone:   "555-1234",
	}

	created, err := repo.Create(customer)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}
	if created.ID == 0 {
		t.Fatal("expected ID to be set")
	}

	// ======================
	// FindAll
	// ======================
	customers, err := repo.GetAll()
	if err != nil {
		t.Fatalf("FindAll failed: %v", err)
	}
	if len(customers) != 1 {
		t.Fatalf("expected 1 customer, got %d", len(customers))
	}

	// ======================
	// FindByID
	// ======================
	found, err := repo.FindByID(created.ID)
	if err != nil {
		t.Fatalf("FindByID failed: %v", err)
	}
	if found.ID != created.ID {
		t.Fatalf("expected ID %d, got %d", created.ID, found.ID)
	}

	// ======================
	// Update
	// ======================
	found.Name = "Acme Corporation"
	_, err = repo.Update(*found)
	if err != nil {
		t.Fatalf("Update failed: %v", err)
	}

	updated, err := repo.FindByID(found.ID)
	if err != nil {
		t.Fatalf("FindByID after update failed: %v", err)
	}
	if updated.Name != "Acme Corporation" {
		t.Fatalf("expected Name to be 'Acme Corporation', got %s", updated.Name)
	}

	// ======================
	// Delete
	// ======================
	err = repo.Delete(updated.ID)
	if err != nil {
		t.Fatalf("Delete failed: %v", err)
	}

	_, err = repo.FindByID(updated.ID)
	if err == nil {
		t.Fatal("expected error when finding deleted customer, got nil")
	}
}
