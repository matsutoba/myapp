package dto

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
