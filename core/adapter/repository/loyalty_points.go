package repository

import (
	"context"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionLoyaltyPoints struct {
	loy *gorm.DB
}

func NewConllectionCollectionLoyaltyPoints(loy *adapter.PostGresql) domain.RepositoryLoyaltyPoints {
	return &CollectionLoyaltyPoints{
		loy: loy.CreateCollection(),
	}
}

// AddLoyaltyPoints implements domain.RepositoryLoyaltyPoints.
func (c *CollectionLoyaltyPoints) AddLoyaltyPoints(ctx context.Context, req *domain.LoyaltyPoints) error {
	result := c.loy.Where(&domain.LoyaltyPoints{
		UserID: req.UserID,
	}).FirstOrCreate(req)
	return result.Error
}

// GetLoyaltyPointsByUserid implements domain.RepositoryLoyaltyPoints.
func (c *CollectionLoyaltyPoints) GetLoyaltyPointsByUserid(ctx context.Context, userId int64) (*domain.LoyaltyPoints, error) {
	var LoyaltyPoints *domain.LoyaltyPoints
	result := c.loy.Where("user_id = ? ", userId).First(&LoyaltyPoints)
	return LoyaltyPoints, result.Error
}

func (u *CollectionLoyaltyPoints) GetListPoint(ctx context.Context) ([]*domain.LoyaltyPoints, error) {
	var list = make([]*domain.LoyaltyPoints, 0)
	result := u.loy.Find(&list)
	return list, result.Error
}
