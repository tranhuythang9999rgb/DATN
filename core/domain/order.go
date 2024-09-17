package domain

import (
	"context"
	"time"
)

// Order đại diện cho bảng orders trong cơ sở dữ liệu
type Order struct {
	ID                int64     `json:"id"`                  // ID đơn hàng
	CustomerName      string    `json:"customer_name"`       // Tên khách hàng
	OrderDate         string    `json:"order_date"`          // Ngày đặt hàng
	BookID            int64     `json:"book_id"`             // ID sách
	BookTitle         string    `json:"book_title"`          // Tiêu đề sách
	BookAuthor        string    `json:"book_author"`         // Tên tác giả
	BookPublisher     string    `json:"book_publisher"`      // Nhà xuất bản
	BookPublishedDate string    `json:"book_published_date"` // Ngày xuất bản
	BookISBN          string    `json:"book_isbn"`           // ISBN
	BookGenre         string    `json:"book_genre"`          // Thể loại
	BookDescription   string    `json:"book_description"`    // Mô tả
	BookLanguage      string    `json:"book_language"`       // Ngôn ngữ
	BookPageCount     int       `json:"book_page_count"`     // Số trang
	BookDimensions    string    `json:"book_dimensions"`     // Kích thước
	BookWeight        string    `json:"book_weight"`         // Trọng lượng
	BookPrice         float64   `json:"book_price"`          // Giá sách
	Quantity          int       `json:"quantity"`            // Số lượng sách trong đơn hàng
	TotalAmount       float64   `json:"total_amount"`        // Tổng số tiền
	Status            int       `json:"status"`              // Trạng thái đơn hàng
	TypePayment       int       `json:"type_payment"`
	CreateTime        time.Time `json:"create_time"`
	CreateOrder       int64     `json:"create_order"`
	AddressId         int64     `json:"address_id"`
	Items             string    `json:"items"`
	StatusCancel      int       `json:"status_cancel"`
}

type OrderForm struct {
	ID                int64   `form:"id"`                  // ID đơn hàng
	CustomerName      string  `form:"customer_name"`       // Tên khách hàng
	OrderDate         string  `form:"order_date"`          // Ngày đặt hàng
	BookID            int64   `form:"book_id"`             // ID sách
	BookTitle         string  `form:"book_title"`          // Tiêu đề sách
	BookAuthor        string  `form:"book_author"`         // Tên tác giả
	BookPublisher     string  `form:"book_publisher"`      // Nhà xuất bản
	BookPublishedDate string  `form:"book_published_date"` // Ngày xuất bản
	BookISBN          string  `form:"book_isbn"`           // ISBN
	BookGenre         string  `form:"book_genre"`          // Thể loại
	BookDescription   string  `form:"book_description"`    // Mô tả
	BookLanguage      string  `form:"book_language"`       // Ngôn ngữ
	BookPageCount     int     `form:"book_page_count"`     // Số trang
	BookDimensions    string  `form:"book_dimensions"`     // Kích thước
	BookWeight        string  `form:"book_weight"`         // Trọng lượng
	BookPrice         float64 `form:"book_price"`          // Giá sách
	Quantity          int     `form:"quantity"`            // Số lượng sách trong đơn hàng
	TotalAmount       float64 `form:"total_amount"`        // Tổng số tiền
	Status            int     `form:"status"`              // Trạng thái đơn hàng
}

type OrderFormUseTk struct {
	StartTime int64 `form:"start_time"`
	EndTime   int64 `form:"end_time"`
}

type RepositoryOrder interface {
	// CreateOrder thêm một đơn hàng mới vào cơ sở dữ liệu
	CreateOrder(ctx context.Context, order *Order) error

	// GetOrderByID lấy thông tin đơn hàng theo ID
	GetOrderByID(ctx context.Context, id int64) (*Order, error)

	// UpdateOrder cập nhật thông tin của đơn hàng
	UpdateOrder(ctx context.Context, order *Order) error

	// DeleteOrder xóa đơn hàng theo ID
	DeleteOrder(ctx context.Context, id int64) error

	// ListOrders lấy danh sách các đơn hàng với các tùy chọn lọc
	ListOrders(ctx context.Context, filter *OrderForm) ([]*Order, error)

	// GetOrderCount lấy số lượng đơn hàng theo trạng thái
	GetOrderCount(ctx context.Context, status int) (int64, error)

	GetInforMationBook(ctx context.Context, order_id, book_id int64) (*Order, error)

	UpdateStatusOrder(ctx context.Context, id int64, status int) error

	UpdateStatusOrderSucsess(ctx context.Context, id int64) error

	UpdateOrderForSend(ctx context.Context, id int64, status int) error

	ListOrdersUseTk(ctx context.Context, filter *OrderFormUseTk) ([]*Order, error)

	UpdateStatusPaymentOffline(ctx context.Context, id int64, status int) error

	GetListOrderByTimeOneDay(ctx context.Context, day int64) ([]*Order, error)

	GetListorderByUser(ctx context.Context, username string) ([]*Order, error)
}
