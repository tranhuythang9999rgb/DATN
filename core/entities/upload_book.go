package entities

import (
	"mime/multipart"
	"shoe_shop_server/core/domain"
)

// Book đại diện cho một cuốn sách trong hệ thống
type Book struct {
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
	Weight        string  `form:"weight"`         // Trọng lượng của cuốn sách
	Price         float64 `form:"price"`          // Giá bán của cuốn sách
	DiscountPrice float64 `form:"discount_price"` // Giá khuyến mãi của cuốn sách (nếu có)
	// PurchasePrice float64                 `form:"purchase_price"` // Giá nhập của cuốn sách để quản lý tồn kho
	Condition     string                  `form:"condition"`      // Tình trạng của cuốn sách (mới, đã qua sử dụng, v.v.)
	Quantity      int                     `form:"quantity"`       // Số lượng cuốn sách còn trong kho
	Notes         string                  `form:"notes"`          // Các ghi chú bổ sung về cuốn sách
	OpeningStatus int                     `form:"opening_status"` // Trạng thái mở bán (0: Chưa mở bán, 1: Đang mở bán, 2: Đã đóng bán)
	File          []*multipart.FileHeader `form:"file"`
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
	Weight        string  `form:"weight"`         // Trọng lượng của cuốn sách
	Price         float64 `form:"price"`          // Giá bán của cuốn sách
	DiscountPrice float64 `form:"discount_price"` // Giá khuyến mãi của cuốn sách (nếu có)
	PurchasePrice float64 `form:"purchase_price"` // Giá nhập của cuốn sách để quản lý tồn kho
	Condition     string  `form:"condition"`      // Tình trạng của cuốn sách (mới, đã qua sử dụng, v.v.)
	Quantity      int     `form:"quantity"`       // Số lượng cuốn sách còn trong kho
	Notes         string  `form:"notes"`          // Các ghi chú bổ sung về cuốn sách
	IsActive      bool    `form:"is_active"`      // Xác định cuốn sách có đang được hiển thị hay không
	OpeningStatus int     `form:"opening_status"` // Trạng thái mở bán (0: Chưa mở bán, 1: Đang mở bán, 2: Đã đóng bán)
	Limit         int     `form:"limit"`          // giới hạn bản ghi
	Offset        int     `form:"offset"`         //đến bản ghi thứ
}
type BookReqUpdate struct {
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
	Weight        string  `form:"weight"`         // Trọng lượng của cuốn sách
	Price         float64 `form:"price"`          // Giá bán của cuốn sách
	DiscountPrice float64 `form:"discount_price"` // Giá khuyến mãi của cuốn sách (nếu có)
	PurchasePrice float64 `form:"purchase_price"` // Giá nhập của cuốn sách để quản lý tồn kho
	Quantity      int     `form:"quantity"`       // Số lượng cuốn sách còn trong kho
	Notes         string  `form:"notes"`          // Các ghi chú bổ sung về cuốn sách
	OpeningStatus int     `form:"opening_status"` // Trạng thái mở bán (0: Chưa mở bán, 1: Đang mở bán, 2: Đã đóng bán)
}
type BookSellWells struct {
	Books []*BookRespSellWell `json:"books"`
}
type BookRespSellWell struct {
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
	Weight        string  `json:"weight"`         // Trọng lượng của cuốn sách
	Price         float64 `json:"price"`          // Giá bán của cuốn sách
	DiscountPrice float64 `json:"discount_price"` // Giá khuyến mãi của cuốn sách (nếu có)
	// PurchasePrice float64 `json:"purchase_price"` // Giá nhập của cuốn sách để quản lý tồn kho
	Quantity      int    `json:"quantity"`       // Số lượng cuốn sách còn trong kho
	Notes         string `json:"notes"`          // Các ghi chú bổ sung về cuốn sách
	IsActive      bool   `json:"is_active"`      // Xác định cuốn sách có đang được hiển thị hay không
	OpeningStatus int    `json:"opening_status"` // Trạng thái mở bán (0: Chưa mở bán, 1: Đang mở bán, 2: Đã đóng bán)
	FileDescFirst string `json:"file_desc_first"`
}

// Book đại diện cho một cuốn sách trong hệ thống
type BookRespDetail struct {
	ID            int64    `json:"id"`             // Mã định danh duy nhất của cuốn sách
	Title         string   `json:"title"`          // Tiêu đề của cuốn sách
	AuthorName    string   `json:"author_name"`    // Tên của tác giả
	Publisher     string   `json:"publisher"`      // Nhà xuất bản của cuốn sách
	PublishedDate string   `json:"published_date"` // Ngày xuất bản của cuốn sách
	ISBN          string   `json:"isbn"`           // Mã số quốc tế của cuốn sách (International Standard Book Number)
	Genre         string   `json:"genre"`          // Thể loại hoặc danh mục của cuốn sách
	Description   string   `json:"description"`    // Mô tả nội dung của cuốn sách
	Language      string   `json:"language"`       // Ngôn ngữ của cuốn sách
	PageCount     int      `json:"page_count"`     // Số trang của cuốn sách
	Dimensions    string   `json:"dimensions"`     // Kích thước vật lý của cuốn sách
	Weight        string   `json:"weight"`         // Trọng lượng của cuốn sách
	Price         float64  `json:"price"`          // Giá bán của cuốn sách
	DiscountPrice float64  `json:"discount_price"` // Giá khuyến mãi của cuốn sách (nếu có)
	Quantity      int      `json:"quantity"`       // Số lượng cuốn sách còn trong kho
	Notes         string   `json:"notes"`          // Các ghi chú bổ sung về cuốn sách
	IsActive      bool     `json:"is_active"`      // Xác định cuốn sách có đang được hiển thị hay không
	OpeningStatus int      `json:"opening_status"` // Trạng thái mở bán (0: Chưa mở bán, 1: Đang mở bán, 2: Đã đóng bán)
	Files         []string `json:"files"`
}

type BookDetailList struct {
	Book  *domain.Book `json:"book"`
	Files []string     `json:"files"`
}

type BookRespDetailList struct {
	BookDetailList []*BookDetailList `json:"book_detail_list"`
	Count          int               `json:"count"`
}
