package domain

import "time"

type User struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	Name        string     `gorm:"size:255;not null" json:"name"`
	Email       string     `gorm:"size:255;unique;not null" json:"email"` // ログインIDとして利用
	Password    string     `gorm:"size:255;not null" json:"password"`
	Role        string     `gorm:"size:50;not null" json:"role"` // "admin", "user"
	IsActive    bool       `gorm:"default:true" json:"isActive"` // 無効ユーザー管理用
	LastLoginAt *time.Time `json:"lastLoginAt"`                  // 最終ログイン日時(NULLを許容)
	CreatedAt   time.Time  `json:"createdAt"`                    // レコード作成日時
	UpdatedAt   time.Time  `json:"updatedAt"`                    // レコード更新日時
}
