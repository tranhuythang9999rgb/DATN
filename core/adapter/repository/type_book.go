package repository

import (
	"context"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionTypeBook struct {
	db *gorm.DB
}

// NewCollectionGenre tạo mới một instance của CollectionGenre
func NewCollectionGenre(db *adapter.PostGresql) domain.RepositoryGenre {
	return &CollectionTypeBook{
		db: db.CreateCollection(),
	}
}

// Create thêm một thể loại mới vào cơ sở dữ liệu
func (c *CollectionTypeBook) Create(ctx context.Context, genre *domain.TypeBooks) error {
	result := c.db.Create(genre)
	return result.Error
}

// Delete thay đổi trạng thái is_active của thể loại thành false
func (c *CollectionTypeBook) Delete(ctx context.Context, id int64) error {
	result := c.db.Model(&domain.TypeBooks{}).Where("id = ?", id).Update("is_active", false)
	return result.Error
}

// GetByID lấy thông tin một thể loại dựa trên ID và trạng thái is_active = true
func (c *CollectionTypeBook) GetByID(ctx context.Context, id int64) (*domain.TypeBooks, error) {
	var genre domain.TypeBooks
	result := c.db.Where("id = ? AND is_active = true", id).First(&genre)
	if result.Error != nil {
		return nil, result.Error
	}
	return &genre, nil
}

// List lấy danh sách các thể loại với trạng thái is_active = true, có thể phân trang
func (c *CollectionTypeBook) List(ctx context.Context) ([]*domain.TypeBooks, error) {
	var genres []*domain.TypeBooks
	result := c.db.Where("is_active = true").Find(&genres)
	if result.Error != nil {
		return nil, result.Error
	}
	return genres, nil
}

// Update cập nhật thông tin của một thể loại
func (c *CollectionTypeBook) Update(ctx context.Context, genre *domain.TypeBooks) error {
	result := c.db.Save(genre)
	return result.Error
}

func (c *CollectionTypeBook) GetNameTypeBook(ctx context.Context, book_name string) (*domain.TypeBooks, error) {
	var typeBook *domain.TypeBooks
	result := c.db.Where("name = ? and is_active = true", book_name).First(&typeBook)
	if result.Error == gorm.ErrRecordNotFound {
		return nil, nil
	}
	return typeBook, result.Error
}
