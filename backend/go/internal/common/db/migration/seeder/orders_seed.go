package seeder

import (
	"log"
	"math"
	"math/rand"
	"time"

	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

// SeedOrders は開発用に orders テーブルへサンプル注文を追加します。
//
// 生成ルール（要点）:
// - 既に orders テーブルにレコードが存在する場合は処理をスキップし、冪等性を保ちます。
// - 既存の `customers` を読み込み、各顧客に対してランダムな件数の注文を作成します。
//   - 件数分布: 15%が0件、35%が1件、残りは1〜4件のランダム（合計で主に0〜5件程度）
//
// - 金額 (`Amount`) は対数正規分布に近い形で生成し、現実的な分布（小額多数・一部高額）を表現します。
//   - 約2%は意図的な高額の外れ値（大口顧客）にします。
//
// - `ItemsCount` は小さなポアソン風の分布（1〜5）を採用します。
// - `OrderChannel` は `web/app/store/phone` のいずれか、`Category` は数カテゴリからランダムに選択します。
// - `Status` は通常 `completed`、一部は `refunded`/`pending` としてもよいが現在は `completed` 固定。
// - `CreatedAt` は過去約720日（約2年）以内でランダムに割り当て、季節性や時系列解析に使えるようにしています。
// - 最後にバッチ挿入でDBに格納します（エラー時はログ出力）。
//
// このシーダーは開発・デモ用のサンプルデータを目的としており、実データとは異なることに注意してください。
func SeedOrders(db *gorm.DB) {
	var count int64
	if err := db.Model(&domain.Order{}).Count(&count).Error; err != nil {
		log.Printf("failed to count orders: %v", err)
		return
	}
	if count > 0 {
		log.Printf("orders already seeded (count=%d), skipping", count)
		return
	}

	// 既存の顧客を取得
	var customers []domain.Customer
	if err := db.Find(&customers).Error; err != nil {
		log.Printf("failed to load customers for seeding orders: %v", err)
		return
	}
	if len(customers) == 0 {
		log.Printf("no customers found for order seeding")
		return
	}

	// ローカル乱数生成器を使う（rand.Seed は非推奨のため）
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	// ヘルパー：対数正規っぽい金額生成（Box-Muller を使って正規分布を作る）
	amountFor := func() float64 {
		mu := 7.5
		sigma := 0.9
		// Box-Muller transform
		u1 := rng.Float64()
		if u1 <= 0 {
			u1 = 1e-12
		}
		u2 := rng.Float64()
		z := math.Sqrt(-2.0*math.Log(u1)) * math.Cos(2.0*math.Pi*u2)
		z = z*sigma + mu
		v := math.Exp(z)
		return math.Round(v*100) / 100
	}

	var orders []domain.Order
	for _, c := range customers {
		// 各顧客に対してランダムに 0-5 件
		var n int
		r := rng.Float64()
		if r < 0.15 {
			n = 0
		} else if r < 0.5 {
			n = 1
		} else {
			n = 1 + rand.Intn(4)
		}

		for i := 0; i < n; i++ {
			amt := amountFor()
			// 2% を大口にする
			if rng.Float64() < 0.02 {
				amt = math.Round((amt*(5+rand.Float64()*20))*100) / 100
			}
			created := time.Now().Add(-time.Duration(rng.Intn(720)) * 24 * time.Hour)

			o := domain.Order{
				CustomerID:   c.ID,
				Amount:       amt,
				Currency:     "JPY",
				ItemsCount:   1 + rng.Intn(5),
				OrderChannel: func() string { ch := []string{"web", "app", "store", "phone"}; return ch[rng.Intn(len(ch))] }(),
				Category: func() string {
					cats := []string{"electronics", "fashion", "grocery", "home", "books", "beauty"}
					return cats[rng.Intn(len(cats))]
				}(),
				Status:    "completed",
				CreatedAt: created,
				UpdatedAt: created,
			}
			orders = append(orders, o)
		}
	}

	if len(orders) == 0 {
		log.Printf("no orders to seed")
		return
	}

	// バッチ挿入
	if err := db.CreateInBatches(orders, 100).Error; err != nil {
		log.Printf("failed to seed orders: %v", err)
		return
	}
	log.Printf("seeded %d orders for %d customers", len(orders), len(customers))
}
