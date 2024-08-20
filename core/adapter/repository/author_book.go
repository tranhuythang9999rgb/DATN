package repository

import (
	"context"
	"errors"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionAuthor struct {
	db *gorm.DB
}

// NewCollectionAuthor tạo mới một instance của CollectionAuthor
func NewCollectionAuthor(db *adapter.PostGresql) domain.RepositoryAuthor {
	return &CollectionAuthor{
		db: db.CreateCollection(),
	}
}

// Create thêm một tác giả mới vào cơ sở dữ liệu
func (c *CollectionAuthor) Create(ctx context.Context, author *domain.Author) (int64, error) {
	result := c.db.WithContext(ctx).Create(author)
	if result.Error != nil {
		return 0, result.Error
	}
	return int64(author.ID), nil
}

// Delete xóa một tác giả khỏi cơ sở dữ liệu
func (c *CollectionAuthor) Delete(ctx context.Context, id int64) error {
	result := c.db.WithContext(ctx).Delete(&domain.Author{}, id)
	return result.Error
}

// GetByID lấy thông tin một tác giả dựa trên ID
func (c *CollectionAuthor) GetByID(ctx context.Context, id int64) (*domain.Author, error) {
	var author domain.Author
	result := c.db.WithContext(ctx).First(&author, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &author, nil
}

// List lấy danh sách các tác giả với phân trang
func (c *CollectionAuthor) List(ctx context.Context, limit int, offset int) ([]*domain.Author, error) {
	var authors []*domain.Author
	result := c.db.WithContext(ctx).Limit(limit).Offset(offset).Find(&authors)
	if result.Error != nil {
		return nil, result.Error
	}
	return authors, nil
}

// Update cập nhật thông tin của một tác giả
func (c *CollectionAuthor) Update(ctx context.Context, author *domain.Author) error {
	result := c.db.WithContext(ctx).Save(author)
	return result.Error
}

// GetNameAuthorBook kiểm tra xem có bất kỳ cuốn sách nào được viết bởi một tác giả có tên cụ thể không
func (c *CollectionAuthor) GetNameAuthorBook(ctx context.Context, authorName string) (bool, error) {
	var author *domain.Author
	var isCheck bool

	err := c.db.Model(&domain.Author{}).Where("name = ?", authorName).First(&author).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			isCheck = false
		} else {
			return false, err
		}
	} else {
		isCheck = true
	}
	return isCheck, nil
}
