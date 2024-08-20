package repository

import (
	"context"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionPublisher struct {
	db *gorm.DB
}

// NewCollectionPublisher tạo mới một instance của CollectionPublisher
func NewCollectionPublisher(db *adapter.PostGresql) domain.RepositoryPublisher {
	return &CollectionPublisher{
		db: db.CreateCollection(),
	}
}

// Create thêm một nhà xuất bản mới vào cơ sở dữ liệu
func (c *CollectionPublisher) Create(ctx context.Context, publisher *domain.Publisher) (int64, error) {
	result := c.db.WithContext(ctx).Create(publisher)
	if result.Error != nil {
		return 0, result.Error
	}
	return int64(publisher.ID), nil
}

// Delete thay đổi trạng thái is_active của nhà xuất bản thành false
func (c *CollectionPublisher) Delete(ctx context.Context, id int64) error {
	result := c.db.WithContext(ctx).Model(&domain.Publisher{}).Where("id = ?", id).Update("is_active", false)
	return result.Error
}

// GetByID lấy thông tin một nhà xuất bản dựa trên ID và trạng thái is_active = true
func (c *CollectionPublisher) GetByID(ctx context.Context, id int64) (*domain.Publisher, error) {
	var publisher domain.Publisher
	result := c.db.WithContext(ctx).Where("id = ? AND is_active = true", id).First(&publisher)
	if result.Error != nil {
		return nil, result.Error
	}
	return &publisher, nil
}

// List lấy danh sách các nhà xuất bản với trạng thái is_active = true, có thể phân trang
func (c *CollectionPublisher) List(ctx context.Context, limit int, offset int) ([]*domain.Publisher, error) {
	var publishers []*domain.Publisher
	result := c.db.WithContext(ctx).Where("is_active = true").Limit(limit).Offset(offset).Find(&publishers)
	if result.Error != nil {
		return nil, result.Error
	}
	return publishers, nil
}

// Update cập nhật thông tin của một nhà xuất bản
func (c *CollectionPublisher) Update(ctx context.Context, publisher *domain.Publisher) error {
	result := c.db.WithContext(ctx).Save(publisher)
	return result.Error
}
