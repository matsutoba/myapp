package seeder

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

// SeedCustomers は開発用のサンプル顧客データを挿入します。
// 既に同じメールアドレスのレコードが存在する場合は作成しません（FirstOrCreate）。
func SeedCustomers(db *gorm.DB) {
	customers := []domain.Customer{}

	// 自動生成で合計20件になるように追加で作成
	// 顧客ランクはラウンドロビンで割り当て、created_at と rank_updated_at は
	// 過去12ヶ月にわたって月ごとにばらつかせて格納します。
	ranks := []string{"vip", "gold", "silver", "bronze"}
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	monthsBack := 12
	for i := 3; i <= 20; i++ {
		rank := ranks[(i-3)%len(ranks)]
		// distribute created_at across past months
		offset := (i - 3) % monthsBack
		base := time.Now().AddDate(0, -offset, 0)
		// choose a day in month 1..28 to avoid month length issues
		day := 1 + rng.Intn(28)
		hour := rng.Intn(24)
		min := rng.Intn(60)
		sec := rng.Intn(60)
		created := time.Date(base.Year(), base.Month(), day, hour, min, sec, 0, time.UTC)
		// rank updated slightly after created (0-10 days)
		ru := created.AddDate(0, 0, rng.Intn(11))
		if ru.After(time.Now()) {
			ru = time.Now()
		}

		c := domain.Customer{
			ContactName:   fmt.Sprintf("担当者%d", i),
			Company:       fmt.Sprintf("会社%d", i),
			Email:         fmt.Sprintf("customer%d@example.com", i),
			Phone:         fmt.Sprintf("080-1111-%04d", i),
			Address:       fmt.Sprintf("東京都区%d-1-1", i),
			Website:       fmt.Sprintf("https://company%d.example.com", i),
			Tags:          "seed",
			Status:        "lead",
			CustomerRank:  rank,
			RankUpdatedAt: &ru,
			CreatedAt:     created,
			UpdatedAt:     created,
		}
		customers = append(customers, c)
	}

	for _, c := range customers {
		if err := db.FirstOrCreate(&c, domain.Customer{Email: c.Email}).Error; err != nil {
			log.Printf("failed to seed customer %s: %v", c.Email, err)
		}
	}
}
