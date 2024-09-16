package repository

import (
	"context"
	"errors"
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
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return book, result.Error
}

func (c *CollectionBook) GetListBookSellWell(ctx context.Context) ([]*domain.Book, error) {
	var topSellingBooks []*domain.Book
	var newestBooks []*domain.Book
	var totalOrders int64

	// Bước 1: Kiểm tra tổng số đơn hàng trong bảng orders
	if err := c.book.WithContext(ctx).
		Model(&domain.Order{}).
		Count(&totalOrders).Error; err != nil {
		return nil, fmt.Errorf("failed to count orders: %w", err)
	}

	// Bước 2: Nếu có đơn hàng, lấy ra danh sách sách bán chạy nhất
	if totalOrders > 0 {
		if err := c.book.WithContext(ctx).
			Table("orders").
			Select("books.id, books.title, books.author_name, books.price, SUM(orders.quantity) AS total_quantity").
			Joins("JOIN books ON orders.book_id = books.id").
			Where("orders.status != 7"). // Bỏ qua các đơn hàng có status là 7
			Group("books.id, books.title, books.author_name, books.price").
			Order("total_quantity DESC").
			Limit(15).
			Scan(&topSellingBooks).Error; err != nil {
			return nil, fmt.Errorf("failed to get top selling books: %w", err)
		}
	}

	// Bước 3: Nếu số sách bán chạy ít hơn 15, bổ sung sách mới nhất theo create_time
	if len(topSellingBooks) < 15 {
		missingCount := 15 - len(topSellingBooks)

		if err := c.book.WithContext(ctx).
			Model(&domain.Book{}).
			Where("is_active = true"). // Lọc sách đang hoạt động
			Order("create_time DESC"). // Sắp xếp theo thời gian tạo mới nhất
			Limit(missingCount).
			Find(&newestBooks).Error; err != nil {
			return nil, fmt.Errorf("failed to get newest books: %w", err)
		}

		// Kết hợp sách bán chạy và sách mới nhất
		topSellingBooks = append(topSellingBooks, newestBooks...)
	}

	// Bước 4: Trả về danh sách 15 sách
	log.Infof("Total books returned: %d", len(topSellingBooks))
	return topSellingBooks, nil
}

// todo ko dung
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

func (u *CollectionBook) GetListBookByTypeBook(ctx context.Context, typeBook string, startPrice, endPrice float64) ([]*domain.Book, error) {
	// Đặt giá trị mặc định cho startPrice và endPrice nếu chúng bằng 0
	if startPrice == 0 {
		startPrice = 0 // Giá trị mặc định nếu không có startPrice
	}
	if endPrice == 0 {
		endPrice = 9999999999999999 // Giá trị tối đa cho endPrice nếu không có
	}

	// Tạo mảng chứa kết quả
	var books = make([]*domain.Book, 0)

	// Thực hiện truy vấn để tìm các sách dựa theo loại sách và khoảng giá
	result := u.book.Where("genre = ? AND is_active = true AND price BETWEEN ? AND ?", typeBook, startPrice, endPrice).Find(&books)

	// Trả về danh sách sách và lỗi nếu có
	return books, result.Error
}

func (u *CollectionBook) GetBookByName(ctx context.Context, bookName string) ([]*domain.Book, error) {
	var books []*domain.Book

	// Sử dụng ILIKE để tìm kiếm không phân biệt chữ hoa chữ thường
	result := u.book.Where("title ILIKE ? AND is_active = true", "%"+bookName+"%").Find(&books)

	if result.Error != nil {
		// Trả về lỗi nếu truy vấn thất bại
		return nil, result.Error
	}

	// Trả về slice rỗng nếu không tìm thấy sách
	if len(books) == 0 {
		return []*domain.Book{}, nil
	}

	return books, nil
}

func (u *CollectionBook) GetListFiveLatestBooks(ctx context.Context) ([]*domain.Book, error) {
	var books = make([]*domain.Book, 0)
	result := u.book.Order("create_time DESC").Limit(7).Find(&books)
	if result.Error != nil {
		return nil, result.Error
	}
	return books, nil
}
