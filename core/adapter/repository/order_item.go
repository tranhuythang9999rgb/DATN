package repository

import (
	"context"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionOrderItem struct {
	item *gorm.DB
}

func NewConllectionOrderItem(item *adapter.PostGresql) domain.RepositoryOrderItem {
	return &CollectionOrderItem{
		item: item.CreateCollection(),
	}
}

// CreateOrderItem implements domain.RepositoryOrderItem.
func (c *CollectionOrderItem) CreateOrderItem(ctx context.Context, req *domain.OrderItem) error {
	result := c.item.Create(&req)
	return result.Error
}

// GetOrderByOrderId implements domain.RepositoryOrderItem.
func (c *CollectionOrderItem) GetOrderByOrderId(ctx context.Context, orderId int64) ([]*domain.OrderItem, error) {
	var orderItems = make([]*domain.OrderItem, 0)
	result := c.item.Where("order_id = ?", orderId).Find(&orderItems)
	return orderItems, result.Error
}
