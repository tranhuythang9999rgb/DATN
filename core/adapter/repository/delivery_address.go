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

func (c *CollectionDeliveryAddress) GetAddressByUserName(ctx context.Context, username string) (*domain.DeliveryAddress, error) {
	var address *domain.DeliveryAddress
	result := c.db.Where("user_name = ? ", username).First(&address)
	if result.Error == gorm.ErrRecordNotFound {
		return nil, nil
	}
	return address, result.Error
}
