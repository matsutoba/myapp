package domain

import (
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	ID uint `gorm:"primaryKey" json:"id"`
	// ContactName: 担当者名（顧客窓口のフルネーム）
	ContactName string `json:"contactName,omitempty"`
	// Company: 会社名（法人顧客の場合）
	Company string `json:"company,omitempty"`
	// Email: 主要な連絡先メールアドレス
	Email string `json:"email,omitempty"`
	// Phone: 主要な電話番号（国番号含めたフォーマットを推奨）
	Phone string `json:"phone,omitempty"`
	// Address: 住所（郵送や表示用の自由テキスト）
	Address string `json:"address,omitempty"`
	// Website: ウェブサイトのURL
	Website string `json:"website,omitempty"`
	// Tags: 検索・分類用のタグをカンマ区切りで保持（小規模用）
	Tags string `json:"tags,omitempty"` // comma-separated tags
	// Status: 顧客の状態（例: lead, prospect, customer, churned）
	Status string `json:"status,omitempty"`
	// OwnerID: 担当ユーザーのID（usersテーブル参照）
	OwnerID *uint `json:"ownerId,omitempty"`
	// CustomerRank: 顧客ランク（例: vip, gold, silver, bronze）
	CustomerRank string `gorm:"type:varchar(32);default:'bronze'" json:"customerRank,omitempty"`
	// RankUpdatedAt: ランクが最後に更新された日時
	RankUpdatedAt *time.Time `json:"rankUpdatedAt,omitempty"`
	// LastContactedAt: 最後にコンタクトした日時
	LastContactedAt *time.Time `json:"lastContactedAt,omitempty"`
	// NextActionAt: 次に行うアクションの予定日時（フォローリマインド等）
	NextActionAt *time.Time `json:"nextActionAt,omitempty"`
	// Notes: フリー形式のメモや履歴要約（長文対応）
	Notes     string         `gorm:"type:text" json:"notes,omitempty"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
