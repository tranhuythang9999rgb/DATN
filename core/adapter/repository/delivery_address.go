package repository

import (
	"context"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionDeliveryAddress struct {
	db *gorm.DB
}

func NewCollectionDeliveryAddress(db *adapter.PostGresql) domain.RepositoryDeliveryAddress {
	return &CollectionDeliveryAddress{
		db: db.CreateCollection(),
	}
}

// Create implements domain.RepositoryDeliveryAddress.
func (c *CollectionDeliveryAddress) Create(ctx context.Context, req *domain.DeliveryAddress) error {
	result := c.db.Create(&req)
	return result.Error
}

// UpdateEmailAndOtp implements domain.RepositoryDeliveryAddress.
func (c *CollectionDeliveryAddress) UpdateEmailAndOtp(ctx context.Context, req *domain.DeliveryAddress) error {
	result := c.db.Where("email = ? otp = ? ", req.Email, req.Otp).UpdateColumns(&req)
	return result.Error
}
