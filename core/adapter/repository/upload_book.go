package repository

import (
	"context"
	"fmt"
	"shoe_shop_server/common/log"
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
		Quantity:      req.Quantity,
		Notes:         req.Notes,
		IsActive:      req.IsActive,
		OpeningStatus: req.OpeningStatus,
	}).Order("published_date DESC, create_time DESC").Limit(limit).Offset(offset).Find(&books)

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
	if result.Error == gorm.ErrRecordNotFound {
		return nil, nil
	}
	return book, result.Error
}

func (c *CollectionBook) GetListBookSellWell(ctx context.Context) ([]*domain.Book, error) {
	var books []*domain.Book
	var ordersCount int64
	var topSellingBooks []*domain.Book

	// Kiểm tra số lượng đơn hàng
	if err := c.book.WithContext(ctx).
		Model(&domain.Order{}).
		Count(&ordersCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count orders: %w", err)
	}

	// Nếu có đơn hàng, lấy 15 sản phẩm bán chạy nhất
	if ordersCount > 1 {
		if err := c.book.WithContext(ctx).
			Table("orders").
			Select("books.id, books.title, SUM(orders.quantity) AS quantity").
			Joins("JOIN books ON orders.book_id = books.id").
			Where("orders.status != 7").
			Group("books.id, books.title").
			Order("quantity DESC").
			Limit(15).
			Scan(&topSellingBooks).Error; err != nil {
			return nil, fmt.Errorf("failed to get top selling books: %w", err)
		}
	}

	// Nếu số lượng sách bán chạy ít hơn 15, bổ sung thêm sách mới nhất
	if len(topSellingBooks) < 15 {
		missingCount := 15 - len(topSellingBooks)
		if err := c.book.WithContext(ctx).
			Model(&domain.Book{}).
			Where("is_active = true").
			Order("create_time DESC").
			Limit(missingCount).
			Find(&books).Error; err != nil {
			return nil, fmt.Errorf("failed to get newest books: %w", err)
		}

		// Kết hợp danh sách sách bán chạy và sách mới nhất
		books = append(topSellingBooks, books...)
	} else {
		// Nếu đã đủ 15 sách bán chạy, sử dụng danh sách này
		books = topSellingBooks
	}
	log.Infof("len : ", len(books))
	return books, nil
}

// todo
// GetFourBook lấy 4 sản phẩm bán chạy nhất dựa trên bảng orders, nếu bảng orders chưa có dữ liệu thì lấy 4 bản sách đầu tiên
func (c *CollectionBook) GetBookByIdTopSell(ctx context.Context, id int64) (*domain.Book, error) {
	var book *domain.Book
	result := c.book.Where("id = ? and is_active = true", id).First(&book)
	return book, result.Error
}
func (u *CollectionBook) UpdateQuantity(ctx context.Context, id int64, quantity int) error {
	result := u.book.Model(&domain.Book{}).Where("id = ?", id).UpdateColumn("quantity", quantity)
	return result.Error
}

func (u *CollectionBook) GetListBookByTypeBook(ctx context.Context, typeBook string) ([]*domain.Book, error) {
	var books = make([]*domain.Book, 0)
	result := u.book.Where("genre = ? and  is_active = true", typeBook).Find(&books)
	return books, result.Error
}
