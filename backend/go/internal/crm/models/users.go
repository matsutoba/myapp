package models

import "time"

type User struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	Name        string     `gorm:"size:255;not null" json:"name"`
	Email       string     `gorm:"size:255;unique;not null" json:"email"` // ログインIDとして利用
	Password    string     `gorm:"size:255;not null" json:"-"`            // JSON 出力時は隠す
	Role        string     `gorm:"size:50;not null" json:"role"`          // "admin", "user"
	IsActive    bool       `gorm:"default:true" json:"is_active"`         // 無効ユーザー管理用
	LastLoginAt *time.Time `json:"last_login_at"`                         // 最終ログイン日時(NULLを許容)
	CreatedAt   time.Time  `json:"created_at"`                            // レコード作成日時
	UpdatedAt   time.Time  `json:"updated_at"`                            // レコード更新日時
}
