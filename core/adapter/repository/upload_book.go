package repository

import (
	"context"
	"fmt"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionBook struct {
	book *gorm.DB
}

func NewCollectionBook(book *adapter.PostGresql) domain.RepositoryBook {
	return &CollectionBook{
		book: book.CreateCollection(),
	}
}

// Create implements domain.RepositoryBook.
func (c *CollectionBook) Create(ctx context.Context, tx *gorm.DB, book *domain.Book) error {
	result := tx.Create(&book)

	return result.Error
}

// Delete implements domain.RepositoryBook.
// Thay vì xóa cuốn sách, chỉ set is_active = false
func (c *CollectionBook) Delete(ctx context.Context, id int64) error {
	result := c.book.WithContext(ctx).Model(&domain.Book{}).Where("id = ?", id).UpdateColumn("is_active", false)
	return result.Error
}

// List implements domain.RepositoryBook.
// Chỉ lấy các cuốn sách có is_active = true
func (c *CollectionBook) List(ctx context.Context, req *domain.BookReqForm, limit int, offset int) ([]*domain.Book, error) {
	var books []*domain.Book
	result := c.book.Where(&domain.Book{
		ID:            req.ID,
		Title:         req.Title,
		AuthorName:    req.AuthorName,
		Publisher:     req.Publisher,
		PublishedDate: req.PublishedDate,
		ISBN:          req.Genre,
		Genre:         req.Genre,
		Description:   req.Description,
		Language:      req.Language,
		PageCount:     req.PageCount,
		Dimensions:    req.Dimensions,
		Weight:        req.Weight,
		Price:         req.Price,
		DiscountPrice: req.DiscountPrice,
		// PurchasePrice: req.PurchasePrice,
		Quantity:      req.Quantity,
		Notes:         req.Notes,
		IsActive:      req.IsActive,
		OpeningStatus: req.OpeningStatus,
	}).Limit(limit).Offset(offset).Find(&books)
	if result.Error != nil {
		return nil, result.Error
	}
	return books, nil
}

// Update implements domain.RepositoryBook.
func (c *CollectionBook) Update(ctx context.Context, book *domain.Book) error {
	result := c.book.Save(&book)
	return result.Error
}

func (c *CollectionBook) GetBookById(ctx context.Context, id int64) (*domain.Book, error) {
	var book *domain.Book
	result := c.book.Where("id = ? and is_active = true", id).First(&book)
	return book, result.Error
}
func (c *CollectionBook) GetListBookSellWell(ctx context.Context) ([]*domain.Book, error) {
	var books []*domain.Book
	var ordersCount int64

	// Kiểm tra số lượng đơn hàng
	if err := c.book.WithContext(ctx).
		Model(&domain.Order{}).
		Count(&ordersCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count orders: %w", err)
	}

	if ordersCount > 0 {
		// Lấy 5 sản phẩm bán chạy nhất từ bảng orders
		if err := c.book.WithContext(ctx).
			Model(&domain.Order{}).
			Select("book_id, book_title, SUM(quantity) AS quantity").
			Group("book_id, book_title").
			Order("quantity DESC").
			Limit(5).
			Find(&books).Error; err != nil {
			return nil, fmt.Errorf("failed to get top selling books: %w", err)
		}
	} else {
		// Nếu không có đơn hàng, lấy 4 sách đầu tiên theo thứ tự giảm dần của ID
		if err := c.book.WithContext(ctx).
			Model(&domain.Book{}).
			Order("id DESC").
			Limit(5).
			Find(&books).Error; err != nil {
			return nil, fmt.Errorf("failed to get books: %w", err)
		}
	}

	return books, nil
}

// todo
// GetFourBook lấy 4 sản phẩm bán chạy nhất dựa trên bảng orders, nếu bảng orders chưa có dữ liệu thì lấy 4 bản sách đầu tiên
func (c *CollectionBook) GetBookByIdTopSell(ctx context.Context, id int64) (*domain.Book, error) {
	var book *domain.Book
	result := c.book.Where("id = ? and is_active = true", id).First(&book)
	return book, result.Error
}
func (u *CollectionBook) UpdateQuantity(ctx context.Context, tx *gorm.DB, id int64, quantity int) error {
	result := tx.Model(&domain.Book{}).Where("id = ?", id).UpdateColumn("quantity", quantity)
	return result.Error
}
