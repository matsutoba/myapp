package repository

import (
	"strings"

	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

/*
 * interface
 */
type CustomerRepository interface {
	GetAll() ([]domain.Customer, error)
	GetPaginated(skip int, take int, keyword string) ([]domain.Customer, int64, error)
	FindByID(id uint) (*domain.Customer, error)
	Create(customer domain.Customer) (*domain.Customer, error)
	Update(customer domain.Customer) (*domain.Customer, error)
	Delete(id uint) error
	CountByRank() ([]RankCountRow, error)
	// CountByRankBetween: count customers grouped by rank within created_at between start and end (YYYY-MM-DD)
	CountByRankBetween(start, end string) ([]RankCountRow, error)
	MonthlyNewCustomers(start, end string) ([]MonthCountRow, error)
}

/*
 * struct
 */
type customerRepository struct {
	db *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) CustomerRepository {
	return &customerRepository{db: db}
}

func (r *customerRepository) GetAll() ([]domain.Customer, error) {
	var customers []domain.Customer
	err := r.db.Find(&customers).Error
	return customers, err
}

func (r *customerRepository) GetPaginated(skip int, take int, keyword string) ([]domain.Customer, int64, error) {
	var customers []domain.Customer
	var total int64

	db := r.db.Model(&domain.Customer{})
	if keyword != "" {
		like := "%" + strings.ToLower(keyword) + "%"
		db = db.Where("LOWER(contact_name) LIKE ? OR LOWER(email) LIKE ?", like, like)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	q := r.db.Model(&domain.Customer{})
	if keyword != "" {
		like := "%" + strings.ToLower(keyword) + "%"
		q = q.Where("LOWER(contact_name) LIKE ? OR LOWER(email) LIKE ?", like, like)
	}

	if err := q.Order("id desc").Offset(skip).Limit(take).Find(&customers).Error; err != nil {
		return nil, 0, err
	}

	return customers, total, nil
}

func (r *customerRepository) FindByID(id uint) (*domain.Customer, error) {
	var customer domain.Customer
	err := r.db.First(&customer, id).Error
	if err != nil {
		return nil, errors.ErrNotFound
	}
	return &customer, err
}

func (r *customerRepository) Create(newCustomer domain.Customer) (*domain.Customer, error) {
	result := r.db.Create(&newCustomer)
	if result.Error != nil {
		return nil, errors.ErrInsertFailed
	}
	return &newCustomer, result.Error
}

func (r *customerRepository) Update(customer domain.Customer) (*domain.Customer, error) {
	result := r.db.Save(customer)
	if result.Error != nil {
		return nil, errors.ErrUpdateFailed
	}
	return &customer, nil
}

func (r *customerRepository) Delete(id uint) error {
	result := r.db.Delete(&domain.Customer{}, id)
	if result.Error != nil {
		return errors.ErrDeleteFailed
	}
	if result.RowsAffected == 0 {
		return errors.ErrNotFound
	}
	return nil
}

type RankCountRow struct {
	CustomerRank string
	Count        int64
}

type MonthCountRow struct {
	YearMonth    string
	NewCustomers int64
}

func (r *customerRepository) CountByRank() ([]RankCountRow, error) {
	var rows []RankCountRow
	result := r.db.Table("customers").Select("customer_rank as customer_rank, COUNT(*) as count").Group("customer_rank").Scan(&rows)
	if result.Error != nil {
		return nil, result.Error
	}
	return rows, nil
}

func (r *customerRepository) MonthlyNewCustomers(start, end string) ([]MonthCountRow, error) {
	var rows []MonthCountRow
	dialect := r.db.Dialector.Name()
	var timeExpr string
	switch dialect {
	case "sqlite":
		timeExpr = "strftime('%%Y-%%m', created_at)"
	default:
		// MySQL の `DATE_FORMAT(..., '%Y-%m')` のように `%` を含む書式は、
		// Go の `fmt` / `log` 等で誤ってフォーマット指定子として解釈され、
		// SQL 文字列が壊れる（% が展開・消失する）恐れがあります。
		// そのため `%` を使わない `YEAR()`/`MONTH()` の組み合わせで年月キーを生成し、
		// アプリ側でのフォーマット依存やエスケープの問題を回避します。
		timeExpr = "CONCAT(YEAR(created_at), '-', LPAD(MONTH(created_at), 2, '0'))"
	}
	sql := "SELECT " + timeExpr + " AS `year_month`, COUNT(*) AS `new_customers` FROM `customers` WHERE `created_at` BETWEEN ? AND ? GROUP BY `year_month` ORDER BY `year_month`"
	result := r.db.Raw(sql, start, end).Scan(&rows)
	if result.Error != nil {
		return nil, result.Error
	}
	return rows, nil
}

func (r *customerRepository) CountByRankBetween(start, end string) ([]RankCountRow, error) {
	var rows []RankCountRow
	q := r.db.Table("customers").Select("customer_rank as customer_rank, COUNT(*) as count").Where("created_at BETWEEN ? AND ?", start, end).Group("customer_rank")
	if err := q.Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}
