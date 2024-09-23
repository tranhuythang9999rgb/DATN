package repository

import (
	"context"
	"errors"
	"fmt"
	"shoe_shop_server/common/enums"
	"shoe_shop_server/common/log"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"
	"time"

	"gorm.io/gorm"
)

// CollectionOrder đại diện cho kho lưu trữ đơn hàng sử dụng GORM
type CollectionOrder struct {
	db *gorm.DB
}

func NewCollectionOrder(db *adapter.PostGresql) domain.RepositoryOrder {
	return &CollectionOrder{
		db: db.CreateCollection(),
	}
}

// CreateOrder thêm một đơn hàng mới vào cơ sở dữ liệu
func (c *CollectionOrder) CreateOrder(ctx context.Context, order *domain.Order) error {
	result := c.db.Create(&order)
	return result.Error
}

// DeleteOrder xóa đơn hàng theo ID
func (c *CollectionOrder) DeleteOrder(ctx context.Context, id int64) error {
	result := c.db.Delete(&domain.Order{}, id)
	return result.Error
}

// GetOrderByID lấy thông tin đơn hàng theo ID
func (c *CollectionOrder) GetOrderByID(ctx context.Context, id int64) (*domain.Order, error) {
	var order *domain.Order
	if err := c.db.First(&order, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get order by ID: %w", err)
	}
	return order, nil
}

// GetOrderCount lấy số lượng đơn hàng theo trạng thái
func (c *CollectionOrder) GetOrderCount(ctx context.Context, status int) (int64, error) {
	var count int64
	if err := c.db.Model(&domain.Order{}).Where("status = ?", status).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to get order count: %w", err)
	}
	return count, nil
}

// ListOrders lấy danh sách các đơn hàng với các tùy chọn lọc
func (c *CollectionOrder) ListOrders(ctx context.Context, filter *domain.OrderForm) ([]*domain.Order, error) {
	var orders []*domain.Order
	result := c.db.Where(&domain.Order{
		ID:                filter.ID,
		CustomerName:      filter.CustomerName,
		OrderDate:         filter.OrderDate,
		BookID:            filter.BookID,
		BookTitle:         filter.BookTitle,
		BookAuthor:        filter.BookAuthor,
		BookPublisher:     filter.BookPublisher,
		BookPublishedDate: filter.BookPublishedDate,
		BookISBN:          filter.BookISBN,
		BookGenre:         filter.BookGenre,
		BookDescription:   filter.BookDescription,
		BookLanguage:      filter.BookLanguage,
		BookPageCount:     filter.BookPageCount,
		BookDimensions:    filter.BookDimensions,
		BookWeight:        filter.BookWeight,
		BookPrice:         filter.BookPrice,
		Quantity:          filter.Quantity,
		TotalAmount:       filter.TotalAmount,
		Status:            filter.Status,
	}).Order("create_order desc").Find(&orders)

	return orders, result.Error
}

// UpdateOrder cập nhật thông tin của đơn hàng
func (c *CollectionOrder) UpdateOrder(ctx context.Context, order *domain.Order) error {
	result := c.db.Where("id  = ?", order.ID).Updates(&order)
	return result.Error
}

func (c *CollectionOrder) GetInforMationBook(ctx context.Context, order_id, book_id int64) (*domain.Order, error) {
	var order *domain.Order
	result := c.db.Where("id = ? and book_id = ? and status = ?", order_id, book_id, enums.ORDER_INIT).First(&order)
	if result.Error == gorm.ErrRecordNotFound {
		return nil, nil
	}
	return order, result.Error
}
func (u *CollectionOrder) UpdateStatusOrder(ctx context.Context, id int64, status int) error {
	result := u.db.Model(&domain.Order{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":       status,
			"type_payment": enums.TYPE_PAYMENT_ONLINE,
		})
	return result.Error
}

func (u *CollectionOrder) UpdateStatusOrderSucsess(ctx context.Context, id int64) error {

	if id <= 0 {
		return errors.New("invalid order ID")
	}

	paymentType := enums.TYPE_PAYMENT_ONLINE

	result := u.db.Model(&domain.Order{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":       enums.AWAITING_CONFIRMATION,
			"type_payment": paymentType,
		})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows affected; check if the order exists")
	}

	return nil
}

func (u *CollectionOrder) UpdateOrderForSend(ctx context.Context, id int64, status int) error {
	result := u.db.Model(&domain.Order{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status": status,
		})
	return result.Error
}

func (c *CollectionOrder) ListOrdersUseTk(ctx context.Context, filter *domain.OrderFormUseTk) ([]*domain.Order, error) {
	var orders []*domain.Order

	// Truy vấn với khoảng thời gian
	result := c.db.Where("create_order BETWEEN ? AND ?", filter.StartTime, filter.EndTime).Find(&orders)

	return orders, result.Error
}

func (u *CollectionOrder) UpdateStatusPaymentOffline(ctx context.Context, id int64, status int) error {
	result := u.db.Model(&domain.Order{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":       status,
			"type_payment": enums.TYPE_PAYMENT_OFFLINE,
		})
	return result.Error
}

// các đơn hàng trong ngaỳ tính từ 0h ->24h<-
func (u *CollectionOrder) GetListOrderByTimeOneDay(ctx context.Context, day int64) ([]*domain.Order, error) {
	t := time.Unix(day, 0)

	startOfDay := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.UTC)
	endOfDay := startOfDay.Add(24 * time.Hour).Add(-time.Nanosecond)
	log.Infof("daye", startOfDay.Unix(), endOfDay.Unix())
	var listOrder []*domain.Order

	result := u.db.Where("create_order BETWEEN ? AND ? AND status = ?", startOfDay.Unix(), endOfDay.Unix(), enums.ORDER_SUCESS).Find(&listOrder)

	if result.Error != nil {
		return nil, result.Error
	}
	log.Infof("data ", listOrder)
	return listOrder, nil
}

func (u *CollectionOrder) GetListorderByUser(ctx context.Context, username string) ([]*domain.Order, error) {
	var orders = make([]*domain.Order, 0)
	result := u.db.Where("customer_name = ?", username).Find(&orders)
	return orders, result.Error
}
