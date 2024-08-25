package repository

import (
	"context"
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

// GetByID implements domain.RepositoryBook.
func (c *CollectionBook) GetByID(ctx context.Context, id int64) (*domain.Book, error) {
	var book domain.Book
	result := c.book.WithContext(ctx).Where("id = ? AND is_active = true", id).First(&book)
	if result.Error != nil {
		return nil, result.Error
	}
	return &book, nil
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
		PurchasePrice: req.PurchasePrice,
		Stock:         req.Stock,
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
func (u *CollectionBook) GetListBookSellWell(ctx context.Context) ([]*domain.Book, error) {
	return nil, nil
}
