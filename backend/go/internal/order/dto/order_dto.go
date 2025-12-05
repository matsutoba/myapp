package dto

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
