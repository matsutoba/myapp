package repositories

import "github.com/matsubara/myapp/internal/crm/models"

// 今はDB接続なし。固定データを返す
func GetAllCustomers() []models.Customer {
	return []models.Customer{
		{ID: 1, Name: "株式会社サンプル", Email: "info@sample.com"},
		{ID: 2, Name: "テック合同会社", Email: "contact@tech.co.jp"},
	}
}
