package repository

import (
	"testing"

	"github.com/matsubara/myapp/internal/domain"
)

func TestUserRepository_CRUD(t *testing.T) {
	repo := NewUserRepository(testDB)

	// ======================
	// Create
	// ======================
	user := domain.User{
		Name:     "Taro",
		Email:    "taro@example.com",
		Password: "hashedpassword",
		Role:     "user",
		IsActive: true,
	}

	created, err := repo.Create(user)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}
	if created.ID == 0 {
		t.Fatal("expected ID to be set")
	}

	// ======================
	// FindAll
	// ======================
	users, err := repo.GetAll()
	if err != nil {
		t.Fatalf("FindAll failed: %v", err)
	}
	if len(users) != 1 {
		t.Fatalf("expected 1 user, got %d", len(users))
	}

	// ======================
	// FindByID
	// ======================
	found, err := repo.FindByID(created.ID)
	if err != nil {
		t.Fatalf("FindByID failed: %v", err)
	}
	if found.Email != "taro@example.com" {
		t.Errorf("expected email taro@example.com, got %s", found.Email)
	}

	// ======================
	// Update
	// ======================
	found.Name = "Jiro"
	_, err = repo.Update(*found)
	if err != nil {
		t.Fatalf("Update failed: %v", err)
	}

	updated, _ := repo.FindByID(found.ID)
	if updated.Name != "Jiro" {
		t.Errorf("expected name Jiro, got %s", updated.Name)
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
		t.Fatal("expected error after delete, got nil")
	}
}

// ======================
// FindByEmail
// ======================
func TestUserRepository_FindByEmail(t *testing.T) {
	repo := NewUserRepository(testDB)

	user := domain.User{
		Name:     "Hanako",
		Email:    "hanako@example.com",
		Password: "hashedpassword",
		Role:     "user",
		IsActive: true,
	}
	repo.Create(user)

	found, err := repo.FindByEmail("hanako@example.com")
	if err != nil {
		t.Fatalf("FindByEmail failed: %v", err)
	}
	if found.Email != "hanako@example.com" {
		t.Errorf("expected email hanako@example.com, got %s", found.Email)
	}

	// 存在しない場合
	_, err = repo.FindByEmail("nonexistent@example.com")
	if err == nil {
		t.Fatal("expected error for nonexistent email")
	}
}
