package dto

import (
	"time"

	"github.com/matsubara/myapp/internal/domain"
)

// CreateCustomerRequest: 顧客作成リクエスト
type CreateCustomerRequest struct {
	ContactName     string     `json:"contactName" binding:"required,max=100"`
	Company         string     `json:"company,omitempty" binding:"omitempty,max=255"`
	Email           string     `json:"email" binding:"required,email,max=100"`
	Phone           string     `json:"phone,omitempty"`
	Address         string     `json:"address,omitempty" binding:"omitempty,max=255"`
	Website         string     `json:"website,omitempty" binding:"omitempty,max=255"`
	Tags            string     `json:"tags,omitempty" binding:"omitempty,max=255"`
	Status          string     `json:"status,omitempty"`
	OwnerID         *uint      `json:"ownerId,omitempty"`
	LastContactedAt *time.Time `json:"lastContactedAt,omitempty"`
	NextActionAt    *time.Time `json:"nextActionAt,omitempty"`
	Notes           string     `json:"notes,omitempty"`
	CustomerRank    string     `json:"customerRank,omitempty" binding:"omitempty,oneof=vip gold silver bronze"`
}

// UpdateCustomerRequest: 顧客更新リクエスト
type UpdateCustomerRequest struct {
	ContactName     string     `json:"contactName,omitempty"`
	Company         string     `json:"company,omitempty" binding:"omitempty,max=255"`
	Email           string     `json:"email" binding:"required,email,max=100"`
	Phone           string     `json:"phone,omitempty"`
	Address         string     `json:"address,omitempty" binding:"omitempty,max=255"`
	Website         string     `json:"website,omitempty" binding:"omitempty,max=255"`
	Tags            string     `json:"tags,omitempty" binding:"omitempty,max=255"`
	Status          string     `json:"status,omitempty"`
	OwnerID         *uint      `json:"ownerId,omitempty"`
	LastContactedAt *time.Time `json:"lastContactedAt,omitempty"`
	NextActionAt    *time.Time `json:"nextActionAt,omitempty"`
	Notes           string     `json:"notes,omitempty" binding:"omitempty,max=500"`
	CustomerRank    string     `json:"customerRank,omitempty" binding:"omitempty,oneof=vip gold silver bronze"`
}

// CustomerResponse: API レスポンス用 DTO
type CustomerResponse struct {
	ID              uint       `json:"id"`
	Company         string     `json:"company,omitempty"`
	Email           string     `json:"email,omitempty"`
	Phone           string     `json:"phone,omitempty"`
	Address         string     `json:"address,omitempty"`
	Website         string     `json:"website,omitempty"`
	Tags            string     `json:"tags,omitempty"`
	Status          string     `json:"status,omitempty"`
	ContactName     string     `json:"contactName,omitempty"`
	OwnerID         *uint      `json:"ownerId,omitempty"`
	LastContactedAt *time.Time `json:"lastContactedAt,omitempty"`
	NextActionAt    *time.Time `json:"nextActionAt,omitempty"`
	Notes           string     `json:"notes,omitempty"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
	CustomerRank    string     `json:"customerRank,omitempty"`
	RankUpdatedAt   *time.Time `json:"rankUpdatedAt,omitempty"`
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
		CustomerRank:    c.CustomerRank,
		RankUpdatedAt:   c.RankUpdatedAt,
	}
}

// ToCustomerListResponse converts a list of domain.Customer to []*CustomerResponse
// CustomerListResponse は顧客一覧取得時の簡易レスポンス（テスト互換）
type CustomerListResponse struct {
	ID          uint   `json:"id"`
	Company     string `json:"company"`
	ContactName string `json:"contactName"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
}

// ToCustomerListResponse は複数顧客を一覧レスポンスDTOに変換（互換のため []CustomerListResponse を返す）
func ToCustomerListResponse(list []domain.Customer) []CustomerListResponse {
	resp := make([]CustomerListResponse, 0, len(list))
	for _, c := range list {
		resp = append(resp, CustomerListResponse{
			ID:          c.ID,
			Company:     c.Company,
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
