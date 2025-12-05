package domain

import (
	"time"

	"gorm.io/gorm"
)

// Order は顧客の注文（取引）を表します。
type Order struct {
	ID uint `gorm:"primaryKey" json:"id"`
	// CustomerID は domain.Customer の参照です
	CustomerID uint `gorm:"index" json:"customerId"`
	// Amount は通貨単位の金額（小数）
	Amount       float64        `json:"amount"`
	Currency     string         `gorm:"size:3;default:JPY" json:"currency"`
	ItemsCount   int            `gorm:"default:1" json:"itemsCount"`
	OrderChannel string         `gorm:"size:32;default:web" json:"orderChannel"`
	Category     string         `gorm:"size:64" json:"category"`
	Status       string         `gorm:"size:32;default:completed" json:"status"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`

	// optional relation
	Customer Customer `gorm:"foreignKey:CustomerID" json:"-"`
}
