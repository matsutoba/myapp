package repository

import (
	"fmt"
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

func TestUserRepository_GetPaginated(t *testing.T) {
	repo := NewUserRepository(testDB)

	// クリーンアップ: delete all existing users
	users, _ := repo.GetAll()
	for _, u := range users {
		_ = repo.Delete(u.ID)
	}

	// Insert 45 users
	total := 45
	for i := 1; i <= total; i++ {
		u := domain.User{
			Name:     fmt.Sprintf("User%d", i),
			Email:    fmt.Sprintf("user%d@example.com", i),
			Password: "pwd",
			Role:     "user",
			IsActive: true,
		}
		_, err := repo.Create(u)
		if err != nil {
			t.Fatalf("failed to create user %d: %v", i, err)
		}
	}

	// page1: skip=0,take=20
	page1, totalCount, err := repo.GetPaginated(0, 20, "")
	if err != nil {
		t.Fatalf("GetPaginated page1 error: %v", err)
	}
	if int(totalCount) != total {
		t.Fatalf("expected total %d, got %d", total, totalCount)
	}
	if len(page1) != 20 {
		t.Fatalf("expected 20 items for page1, got %d", len(page1))
	}

	// page2: skip=20,take=20
	page2, _, err := repo.GetPaginated(20, 20, "")
	if err != nil {
		t.Fatalf("GetPaginated page2 error: %v", err)
	}
	if len(page2) != 20 {
		t.Fatalf("expected 20 items for page2, got %d", len(page2))
	}

	// page3: skip=40,take=20 -> should have 5
	page3, _, err := repo.GetPaginated(40, 20, "")
	if err != nil {
		t.Fatalf("GetPaginated page3 error: %v", err)
	}
	if len(page3) != 5 {
		t.Fatalf("expected 5 items for page3, got %d", len(page3))
	}

	// check ordering: repository orders by id desc
	if page1[0].ID <= page1[len(page1)-1].ID {
		t.Fatalf("expected descending order in page1")
	}
}
