package domain

import (
	"context"

	"gorm.io/gorm"
)

// Book đại diện cho một cuốn sách trong hệ thống
type Book struct {
	ID            int64   `json:"id"`             // Mã định danh duy nhất của cuốn sách
	Title         string  `json:"title"`          // Tiêu đề của cuốn sách
	AuthorName    string  `json:"author_name"`    // Tên của tác giả
	Publisher     string  `json:"publisher"`      // Nhà xuất bản của cuốn sách
	PublishedDate string  `json:"published_date"` // Ngày xuất bản của cuốn sách
	ISBN          string  `json:"isbn"`           // Mã số quốc tế của cuốn sách (International Standard Book Number)
	Genre         string  `json:"genre"`          // Thể loại hoặc danh mục của cuốn sách
	Description   string  `json:"description"`    // Mô tả nội dung của cuốn sách
	Language      string  `json:"language"`       // Ngôn ngữ của cuốn sách
	PageCount     int     `json:"page_count"`     // Số trang của cuốn sách
	Dimensions    string  `json:"dimensions"`     // Kích thước vật lý của cuốn sách
	Weight        float64 `json:"weight"`         // Trọng lượng của cuốn sách
	Price         float64 `json:"price"`          // Giá bán của cuốn sách
	DiscountPrice float64 `json:"discount_price"` // Giá khuyến mãi của cuốn sách (nếu có)
	PurchasePrice float64 `json:"purchase_price"` // Giá nhập của cuốn sách để quản lý tồn kho
	Stock         int     `json:"stock"`          // Số lượng cuốn sách còn trong kho
	Notes         string  `json:"notes"`          // Các ghi chú bổ sung về cuốn sách
	IsActive      bool    `json:"is_active"`      // Xác định cuốn sách có đang được hiển thị hay không
	OpeningStatus int     `json:"opening_status"` // Trạng thái mở bán (0: Chưa mở bán, 1: Đang mở bán, 2: Đã đóng bán)
}

type BookReqForm struct {
	ID            int64   `form:"id"`             // Mã định danh duy nhất của cuốn sách
	Title         string  `form:"title"`          // Tiêu đề của cuốn sách
	AuthorName    string  `form:"author_name"`    // Tên của tác giả
	Publisher     string  `form:"publisher"`      // Nhà xuất bản của cuốn sách
	PublishedDate string  `form:"published_date"` // Ngày xuất bản của cuốn sách
	ISBN          string  `form:"isbn"`           // Mã số quốc tế của cuốn sách (International Standard Book Number)
	Genre         string  `form:"genre"`          // Thể loại hoặc danh mục của cuốn sách
	Description   string  `form:"description"`    // Mô tả nội dung của cuốn sách
	Language      string  `form:"language"`       // Ngôn ngữ của cuốn sách
	PageCount     int     `form:"page_count"`     // Số trang của cuốn sách
	Dimensions    string  `form:"dimensions"`     // Kích thước vật lý của cuốn sách
	Weight        float64 `form:"weight"`         // Trọng lượng của cuốn sách
	Price         float64 `form:"price"`          // Giá bán của cuốn sách
	DiscountPrice float64 `form:"discount_price"` // Giá khuyến mãi của cuốn sách (nếu có)
	PurchasePrice float64 `form:"purchase_price"` // Giá nhập của cuốn sách để quản lý tồn kho
	Stock         int     `form:"stock"`          // Số lượng cuốn sách còn trong kho
	Notes         string  `form:"notes"`          // Các ghi chú bổ sung về cuốn sách
	IsActive      bool    `form:"is_active"`      // Xác định cuốn sách có đang được hiển thị hay không
	OpeningStatus int     `form:"opening_status"` // Trạng thái mở bán (0: Chưa mở bán, 1: Đang mở bán, 2: Đã đóng bán)
}

// BookRepository định nghĩa các phương thức cho các hoạt động CRUD đối với sách
type RepositoryBook interface {
	Create(ctx context.Context, tx *gorm.DB, book *Book) error                      // Tạo một cuốn sách mới
	GetByID(ctx context.Context, id int64) (*Book, error)                           // Lấy một cuốn sách theo ID
	Update(ctx context.Context, book *Book) error                                   // Cập nhật thông tin một cuốn sách
	Delete(ctx context.Context, id int64) error                                     // Xóa một cuốn sách theo ID
	List(ctx context.Context, req *BookReqForm, limit, offset int) ([]*Book, error) // Liệt kê sách với phân trang
	GetBookById(ctx context.Context, id int64) (*Book, error)
}
