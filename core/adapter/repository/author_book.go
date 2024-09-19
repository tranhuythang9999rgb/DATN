package repository

import (
	"context"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionAuthorBook struct {
	db *gorm.DB
}

// NewCollectionAuthor tạo mới một instance của CollectionAuthor
func NewCollectionAuthor(db *adapter.PostGresql) domain.RepositoryAuthor {
	return &CollectionAuthorBook{
		db: db.CreateCollection(),
	}
}

// Create thêm một tác giả mới vào cơ sở dữ liệu
func (c *CollectionAuthorBook) Create(ctx context.Context, author *domain.Author) error {
	result := c.db.Create(author)
	return result.Error
}

// Delete xóa một tác giả khỏi cơ sở dữ liệu
func (c *CollectionAuthorBook) Delete(ctx context.Context, id int64) error {
	result := c.db.Delete(&domain.Author{}, id)
	return result.Error
}

// GetByID lấy thông tin một tác giả dựa trên ID
func (c *CollectionAuthorBook) GetByID(ctx context.Context, id int64) (*domain.Author, error) {
	var author *domain.Author
	result := c.db.First(&author, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return author, nil
}

// List lấy danh sách các tác giả với phân trang
func (c *CollectionAuthorBook) List(ctx context.Context) ([]*domain.Author, error) {
	var authors []*domain.Author
	result := c.db.Find(&authors)
	if result.Error != nil {
		return nil, result.Error
	}
	return authors, nil
}

// Update cập nhật thông tin của một tác giả
func (c *CollectionAuthorBook) Update(ctx context.Context, author *domain.Author) error {
	result := c.db.Where("id = ?", author.ID).Updates(&author)
	return result.Error
}

// GetNameAuthorBook kiểm tra xem có bất kỳ cuốn sách nào được viết bởi một tác giả có tên cụ thể không
func (c *CollectionAuthorBook) GetNameAuthorBook(ctx context.Context, authorName string) (*domain.Author, error) {
	var author *domain.Author
	result := c.db.Where("name = ? ", authorName).First(&author)
	if result.Error == gorm.ErrRecordNotFound {
		return nil, nil
	}
	return author, result.Error
}
