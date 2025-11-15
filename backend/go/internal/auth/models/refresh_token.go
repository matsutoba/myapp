package models

import (
	"time"
)

// RefreshToken represents a persisted refresh token for rotation and revocation
// Table name: refresh_tokens
// Each JTI can be used only once. When rotated, the old one is marked UsedAt.
// Multiple active tokens per user are allowed (multi-device) by default.

type RefreshToken struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"index;not null"`
	JTI       string    `gorm:"uniqueIndex;size:64;not null"`
	ExpiresAt time.Time `gorm:"index;not null"`
	Revoked   bool      `gorm:"default:false;not null"`
	UsedAt    *time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (RefreshToken) TableName() string { return "refresh_tokens" }
