package dto

import (
	"time"

	"github.com/matsubara/myapp/internal/domain"
)

// CreateCustomerRequest: 顧客作成リクエスト
type CreateCustomerRequest struct {
	ContactName  string     `json:"contact_name" binding:"required,max=100"`
	Company      string     `json:"company,omitempty" binding:"omitempty,max=255"`
	Email        string     `json:"email" binding:"required,email,max=100"`
	Phone        string     `json:"phone,omitempty"`
	Address      string     `json:"address,omitempty" binding:"omitempty,max=255"`
	Website      string     `json:"website,omitempty" binding:"omitempty,max=255"`
	Tags         string     `json:"tags,omitempty" binding:"omitempty,max=255"`
	Status       string     `json:"status,omitempty"`
	OwnerID      *uint      `json:"owner_id,omitempty"`
	NextActionAt *time.Time `json:"next_action_at,omitempty"`
	Notes        string     `json:"notes,omitempty"`
}

// UpdateCustomerRequest: 顧客更新リクエスト
type UpdateCustomerRequest struct {
	ContactName  string     `json:"contact_name,omitempty"`
	Company      string     `json:"company,omitempty" binding:"omitempty,max=255"`
	Email        string     `json:"email" binding:"required,email,max=100"`
	Phone        string     `json:"phone,omitempty"`
	Address      string     `json:"address,omitempty" binding:"omitempty,max=255"`
	Website      string     `json:"website,omitempty" binding:"omitempty,max=255"`
	Tags         string     `json:"tags,omitempty" binding:"omitempty,max=255"`
	Status       string     `json:"status,omitempty"`
	OwnerID      *uint      `json:"owner_id,omitempty"`
	NextActionAt *time.Time `json:"next_action_at,omitempty"`
	Notes        string     `json:"notes,omitempty" binding:"omitempty,max=500"`
}

// CustomerResponse: API レスポンス用 DTO
type CustomerResponse struct {
	ID              uint       `json:"id"`
	ContactName     string     `json:"contact_name,omitempty"`
	Company         string     `json:"company,omitempty"`
	Email           string     `json:"email,omitempty"`
	Phone           string     `json:"phone,omitempty"`
	Address         string     `json:"address,omitempty"`
	Website         string     `json:"website,omitempty"`
	Tags            string     `json:"tags,omitempty"`
	Status          string     `json:"status,omitempty"`
	OwnerID         *uint      `json:"owner_id,omitempty"`
	LastContactedAt *time.Time `json:"last_contacted_at,omitempty"`
	NextActionAt    *time.Time `json:"next_action_at,omitempty"`
	Notes           string     `json:"notes,omitempty"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

// ToCustomerResponse converts domain.Customer -> CustomerResponse
func ToCustomerResponse(c *domain.Customer) *CustomerResponse {
	if c == nil {
		return nil
	}
	return &CustomerResponse{
		ID:              c.ID,
		ContactName:     c.ContactName,
		Company:         c.Company,
		Email:           c.Email,
		Phone:           c.Phone,
		Address:         c.Address,
		Website:         c.Website,
		Tags:            c.Tags,
		Status:          c.Status,
		OwnerID:         c.OwnerID,
		LastContactedAt: c.LastContactedAt,
		NextActionAt:    c.NextActionAt,
		Notes:           c.Notes,
		CreatedAt:       c.CreatedAt,
		UpdatedAt:       c.UpdatedAt,
	}
}

// ToCustomerListResponse converts a list of domain.Customer to []*CustomerResponse
// CustomerListResponse は顧客一覧取得時の簡易レスポンス（テスト互換）
type CustomerListResponse struct {
	ID          uint   `json:"id"`
	ContactName string `json:"contact_name"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
}

// ToCustomerListResponse は複数顧客を一覧レスポンスDTOに変換（互換のため []CustomerListResponse を返す）
func ToCustomerListResponse(list []domain.Customer) []CustomerListResponse {
	resp := make([]CustomerListResponse, 0, len(list))
	for _, c := range list {
		resp = append(resp, CustomerListResponse{
			ID:          c.ID,
			ContactName: c.ContactName,
			Email:       c.Email,
			Phone:       c.Phone,
		})
	}
	return resp
}

// Paged response for customer list
type CustomerListPagedResponse struct {
	Items []CustomerListResponse `json:"items"`
	Total int64                  `json:"total"`
	Skip  int                    `json:"skip"`
	Take  int                    `json:"take"`
}

func ToCustomerListPagedResponse(list []domain.Customer, total int64, skip int, take int) CustomerListPagedResponse {
	return CustomerListPagedResponse{
		Items: ToCustomerListResponse(list),
		Total: total,
		Skip:  skip,
		Take:  take,
	}
}
