package repository

import (
	"context"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionFavorites struct {
	db *gorm.DB
}

// NewCollectionAuthor tạo mới một instance của CollectionAuthor
func NewCollectionFavorites(db *adapter.PostGresql) domain.RepositoryFavorites {
	return &CollectionFavorites{
		db: db.CreateCollection(),
	}
}

// UpSertFavorites implements domain.RepositoryFavorites.
func (c *CollectionFavorites) UpSertFavorites(ctx context.Context, req *domain.Favorites) error {
	result := c.db.Where(&domain.Favorites{
		UserId: req.UserId,
		BookId: req.BookId,
	}).FirstOrCreate(&req)
	return result.Error
}

// DeleteFavoritesByBookId implements domain.RepositoryFavorites.
func (c *CollectionFavorites) DeleteFavoritesByBookId(ctx context.Context, bookId int64) error {
	result := c.db.Where("book_id = ? ", bookId).Delete(&domain.Favorites{})
	return result.Error
}

// ListBookFavoritesByuserName implements domain.RepositoryFavorites.
func (c *CollectionFavorites) ListBookFavoritesByuserName(ctx context.Context, userId int64) ([]*domain.Favorites, error) {
	var likes = make([]*domain.Favorites, 0)
	result := c.db.Where("user_id = ?", userId).Find(&likes)
	return likes, result.Error
}
