package dto

import (
	"time"

	"github.com/matsubara/myapp/internal/domain"
)

// AggregatesRequest は集計エンドポイントのクエリパラメータを表します。
// `start` と `end` は日付文字列（YYYY-MM-DD）で指定します。
type AggregatesRequest struct {
	Start  string `form:"start" binding:"required"`
	End    string `form:"end" binding:"required"`
	Period string `form:"period" binding:"omitempty,oneof=day month"`
	// Optional filters
	Status   string `form:"status" binding:"omitempty,oneof=completed pending refunded"`
	Category string `form:"category" binding:"omitempty,max=64"`
}

// ByCustomerRequest は顧客別注文取得エンドポイントのクエリパラメータを表します。
type ByCustomerRequest struct {
	CustomerID uint `form:"customer_id" binding:"required"`
	Limit      int  `form:"limit" binding:"omitempty,min=1"`
	Offset     int  `form:"offset" binding:"omitempty,min=0"`
}

// CreateOrderRequest は注文作成用のボディDTO
type CreateOrderRequest struct {
	CustomerID   uint    `json:"customerId" binding:"required"`
	Amount       float64 `json:"amount" binding:"required,gt=0"`
	Currency     string  `json:"currency" binding:"omitempty,len=3"`
	ItemsCount   int     `json:"itemsCount" binding:"omitempty,min=1"`
	OrderChannel string  `json:"orderChannel" binding:"omitempty,oneof=web app store phone"`
	Category     string  `json:"category" binding:"omitempty,max=64"`
	Status       string  `json:"status" binding:"omitempty,oneof=completed pending refunded"`
}

// UpdateOrderRequest は注文更新用のボディDTO（部分更新を許可）
type UpdateOrderRequest struct {
	Amount       *float64 `json:"amount" binding:"omitempty,gt=0"`
	Currency     *string  `json:"currency" binding:"omitempty,len=3"`
	ItemsCount   *int     `json:"itemsCount" binding:"omitempty,min=1"`
	OrderChannel *string  `json:"orderChannel" binding:"omitempty,oneof=web app store phone"`
	Category     *string  `json:"category" binding:"omitempty,max=64"`
	Status       *string  `json:"status" binding:"omitempty,oneof=completed pending refunded"`
}

// OrderResponse is the API response DTO for an order
type OrderResponse struct {
	ID           uint      `json:"id"`
	CustomerID   uint      `json:"customerId"`
	CompanyName  string    `json:"companyName,omitempty"`
	Total        float64   `json:"total"`
	Amount       float64   `json:"amount"`
	Currency     string    `json:"currency,omitempty"`
	ItemsCount   int       `json:"itemsCount"`
	OrderChannel string    `json:"orderChannel,omitempty"`
	Category     string    `json:"category,omitempty"`
	Status       string    `json:"status,omitempty"`
	CreatedAt    time.Time `json:"createdAt"`
}

// OrderListPagedResponse is a paged response for orders
type OrderListPagedResponse struct {
	Items []OrderResponse `json:"items"`
	Total int64           `json:"total"`
	Skip  int             `json:"skip"`
	Take  int             `json:"take"`
}

// ToOrderResponse converts a domain.Order to OrderResponse
func ToOrderResponse(o *domain.Order) *OrderResponse {
	if o == nil {
		return nil
	}
	// Use the customer's company as the displayed customer name
	customerName := o.Customer.Company
	return &OrderResponse{
		ID:           o.ID,
		CustomerID:   o.CustomerID,
		CompanyName:  customerName,
		Total:        o.Amount,
		Amount:       o.Amount,
		Currency:     o.Currency,
		ItemsCount:   o.ItemsCount,
		OrderChannel: o.OrderChannel,
		Category:     o.Category,
		Status:       o.Status,
		CreatedAt:    o.CreatedAt,
	}
}

// ToOrderListPagedResponse converts a slice of domain.Order to a paged response
func ToOrderListPagedResponse(list []domain.Order, total int64, skip int, take int) OrderListPagedResponse {
	items := make([]OrderResponse, 0, len(list))
	for _, o := range list {
		or := ToOrderResponse(&o)
		if or != nil {
			items = append(items, *or)
		}
	}
	return OrderListPagedResponse{
		Items: items,
		Total: total,
		Skip:  skip,
		Take:  take,
	}
}
