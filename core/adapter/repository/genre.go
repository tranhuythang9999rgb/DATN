package repository

import (
	"context"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionGenre struct {
	db *gorm.DB
}

// NewCollectionGenre tạo mới một instance của CollectionGenre
func NewCollectionGenre(db *adapter.PostGresql) domain.RepositoryGenre {
	return &CollectionGenre{
		db: db.CreateCollection(),
	}
}

// Create thêm một thể loại mới vào cơ sở dữ liệu
func (c *CollectionGenre) Create(ctx context.Context, genre *domain.Genre) (int64, error) {
	result := c.db.WithContext(ctx).Create(genre)
	if result.Error != nil {
		return 0, result.Error
	}
	return int64(genre.ID), nil
}

// Delete thay đổi trạng thái is_active của thể loại thành false
func (c *CollectionGenre) Delete(ctx context.Context, id int64) error {
	result := c.db.WithContext(ctx).Model(&domain.Genre{}).Where("id = ?", id).Update("is_active", false)
	return result.Error
}

// GetByID lấy thông tin một thể loại dựa trên ID và trạng thái is_active = true
func (c *CollectionGenre) GetByID(ctx context.Context, id int64) (*domain.Genre, error) {
	var genre domain.Genre
	result := c.db.WithContext(ctx).Where("id = ? AND is_active = true", id).First(&genre)
	if result.Error != nil {
		return nil, result.Error
	}
	return &genre, nil
}

// List lấy danh sách các thể loại với trạng thái is_active = true, có thể phân trang
func (c *CollectionGenre) List(ctx context.Context, limit int, offset int) ([]*domain.Genre, error) {
	var genres []*domain.Genre
	result := c.db.WithContext(ctx).Where("is_active = true").Limit(limit).Offset(offset).Find(&genres)
	if result.Error != nil {
		return nil, result.Error
	}
	return genres, nil
}

// Update cập nhật thông tin của một thể loại
func (c *CollectionGenre) Update(ctx context.Context, genre *domain.Genre) error {
	result := c.db.WithContext(ctx).Save(genre)
	return result.Error
}
