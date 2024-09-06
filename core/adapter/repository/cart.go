package repository

import (
	"context"
	"errors"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type Collectioncart struct {
	db *gorm.DB
}

// NewCollectionAuthor tạo mới một instance của CollectionAuthor
func NewCollectionCart(db *adapter.PostGresql) domain.RepositoryCart {
	return &Collectioncart{
		db: db.CreateCollection(),
	}
}

// AddCart implements domain.RepositoryCart.
func (c *Collectioncart) AddCart(ctx context.Context, req *domain.Cart) error {
	var existingCart *domain.Cart
	result := c.db.Where("user_id = ? AND book_id = ?", req.UserID, req.BookID).First(&existingCart)

	if result.Error == nil {
		// Cart exists, update quantity
		existingCart.Quantity = req.Quantity // Just update, don't add
		updateResult := c.db.Save(&existingCart)
		return updateResult.Error
	} else if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		// Cart doesn't exist, create new
		createResult := c.db.Create(req)
		return createResult.Error
	} else {
		// Some other error occurred
		return result.Error
	}
}

// DeleteCart implements domain.RepositoryCart.
func (c *Collectioncart) DeleteCart(ctx context.Context, id int64) error {
	result := c.db.Where("id = ? ", id).Delete(&domain.Cart{})
	return result.Error
}
func (c *Collectioncart) GetListCartByUserId(ctx context.Context, id int64) ([]*domain.Cart, error) {
	var carts = make([]*domain.Cart, 0)
	result := c.db.Where("user_id = ?", id).Order("create_at DESC").Find(&carts)
	return carts, result.Error
}

func (u *Collectioncart) UpdateQuantityBookCartById(ctx context.Context, id int64, quantity int) error {
	result := u.db.Model(&domain.Cart{}).Where("id = ?", id).UpdateColumn("quantity", quantity)
	return result.Error
}
