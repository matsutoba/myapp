package dto

import (
	"time"

	"github.com/matsubara/myapp/internal/crm/models"
)

type CreateCustomerRequest struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Address string `json:"address" binding:"required"`
	Phone   string `json:"phone" binding:"required"`
}

type UpdateCustomerRequest struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Address string `json:"address" binding:"required"`
	Phone   string `json:"phone" binding:"required"`
}

// CustomerResponse は単一顧客取得時のレスポンス
type CustomerResponse struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Address   string    `json:"address"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// CustomerListResponse は顧客一覧取得時のレスポンス（簡易版）
type CustomerListResponse struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
}

// ToCustomerResponse はモデルをレスポンスDTOに変換
func ToCustomerResponse(customer *models.Customer) *CustomerResponse {
	if customer == nil {
		return nil
	}
	return &CustomerResponse{
		ID:        customer.ID,
		Name:      customer.Name,
		Email:     customer.Email,
		Phone:     customer.Phone,
		Address:   customer.Address,
		CreatedAt: customer.CreatedAt,
		UpdatedAt: customer.UpdatedAt,
	}
}

// ToCustomerListResponse は複数顧客を一覧レスポンスDTOに変換
func ToCustomerListResponse(customers []models.Customer) []CustomerListResponse {
	result := make([]CustomerListResponse, len(customers))
	for i, c := range customers {
		result[i] = CustomerListResponse{
			ID:    c.ID,
			Name:  c.Name,
			Email: c.Email,
			Phone: c.Phone,
		}
	}
	return result
}
