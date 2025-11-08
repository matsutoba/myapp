package services

import (
	"github.com/matsubara/myapp/internal/crm/models"
	"github.com/matsubara/myapp/internal/crm/repositories"
)

// 今はDB接続なし。固定データを返す
func GetAllCustomers() []models.Customer {
	customers := repositories.GetAllCustomers()
	return customers
}
