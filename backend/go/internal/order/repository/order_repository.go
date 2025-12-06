package repository

import (
	"fmt"
	"time"

	"github.com/matsubara/myapp/internal/domain"
	"gorm.io/gorm"
)

type OrderAggregateRow struct {
	Period string  `json:"period"`
	Total  float64 `json:"total"`
	Count  int64   `json:"count"`
	Avg    float64 `json:"avg"`
}

type OrderRepository interface {
	GetByCustomer(customerID uint, limit int, offset int) ([]domain.Order, error)
	GetAll(limit int, offset int) ([]domain.Order, error)
	// Search orders by query (partial match against order id and customer company)
	Search(q string, limit int, offset int) ([]domain.Order, error)
	// Count matching search results
	CountSearch(q string) (int64, error)
	CountAll() (int64, error)
	Aggregate(start time.Time, end time.Time, period string, status string, category string) ([]OrderAggregateRow, error)
	Create(order *domain.Order) (*domain.Order, error)
	Update(order *domain.Order) (*domain.Order, error)
	Delete(id uint) error
	FindByID(id uint) (*domain.Order, error)
}

func (r *orderRepository) FindByID(id uint) (*domain.Order, error) {
	var o domain.Order
	if err := r.db.Preload("Customer").First(&o, id).Error; err != nil {
		return nil, err
	}
	return &o, nil
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) GetByCustomer(customerID uint, limit int, offset int) ([]domain.Order, error) {
	var orders []domain.Order
	q := r.db.Preload("Customer").Where("customer_id = ?", customerID).Order("created_at desc")
	if limit > 0 {
		q = q.Limit(limit)
	}
	if offset > 0 {
		q = q.Offset(offset)
	}
	if err := q.Find(&orders).Error; err != nil {
		return nil, err
	}
	return orders, nil
}

func (r *orderRepository) GetAll(limit int, offset int) ([]domain.Order, error) {
	var orders []domain.Order
	q := r.db.Preload("Customer").Order("created_at desc")
	if limit > 0 {
		q = q.Limit(limit)
	}
	if offset > 0 {
		q = q.Offset(offset)
	}
	if err := q.Find(&orders).Error; err != nil {
		return nil, err
	}
	return orders, nil
}

func (r *orderRepository) CountAll() (int64, error) {
	var count int64
	if err := r.db.Model(&domain.Order{}).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *orderRepository) CountSearch(q string) (int64, error) {
	var count int64
	pattern := "%" + q + "%"
	// join with customers to search company name
	if err := r.db.Model(&domain.Order{}).
		Joins("JOIN customers ON customers.id = orders.customer_id").
		Where("CAST(orders.id AS CHAR) LIKE ? OR customers.company LIKE ?", pattern, pattern).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *orderRepository) Search(q string, limit int, offset int) ([]domain.Order, error) {
	var orders []domain.Order
	pattern := "%" + q + "%"
	qdb := r.db.Preload("Customer").Joins("JOIN customers ON customers.id = orders.customer_id").Order("created_at desc").Where("CAST(orders.id AS CHAR) LIKE ? OR customers.company LIKE ?", pattern, pattern)
	if limit > 0 {
		qdb = qdb.Limit(limit)
	}
	if offset > 0 {
		qdb = qdb.Offset(offset)
	}
	if err := qdb.Find(&orders).Error; err != nil {
		return nil, err
	}
	return orders, nil
}

func (r *orderRepository) Aggregate(start time.Time, end time.Time, period string, status string, category string) ([]OrderAggregateRow, error) {
	var rows []OrderAggregateRow
	var timeExpr string
	// Use dialect-aware date formatting: MySQL uses DATE_FORMAT, SQLite uses strftime
	dialect := r.db.Dialector.Name()
	switch dialect {
	case "sqlite":
		if period == "month" {
			timeExpr = "strftime('%Y-%m-01', created_at)"
		} else {
			timeExpr = "date(created_at)"
		}
	default:
		if period == "month" {
			timeExpr = "DATE_FORMAT(created_at, '%Y-%m-01')"
		} else {
			timeExpr = "DATE(created_at)"
		}
	}

	// Build query with optional filters
	base := fmt.Sprintf("SELECT %s AS period, SUM(amount) AS total, COUNT(*) AS count, AVG(amount) AS avg FROM orders WHERE created_at BETWEEN ? AND ?", timeExpr)
	args := []interface{}{start, end}
	if status != "" {
		base += " AND status = ?"
		args = append(args, status)
	}
	if category != "" {
		base += " AND category = ?"
		args = append(args, category)
	}
	base += fmt.Sprintf(" GROUP BY %s ORDER BY %s", timeExpr, timeExpr)

	if err := r.db.Raw(base, args...).Scan(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *orderRepository) Create(order *domain.Order) (*domain.Order, error) {
	if err := r.db.Create(order).Error; err != nil {
		return nil, err
	}
	return order, nil
}

func (r *orderRepository) Update(order *domain.Order) (*domain.Order, error) {
	if err := r.db.Save(order).Error; err != nil {
		return nil, err
	}
	return order, nil
}

func (r *orderRepository) Delete(id uint) error {
	res := r.db.Delete(&domain.Order{}, id)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
