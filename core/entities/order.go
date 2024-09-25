package entities

import (
	"shoe_shop_server/core/domain"
	"time"
)

type Order struct {
	CustomerName string `form:"customer_name"` // Tên khách hàng
	BookID       int64  `form:"book_id"`       // ID sách
	Quantity     int    `form:"quantity"`      // Số lượng sách trong đơn hàng
	OrderId      int64  `form:"order_id"`      // check xem sachs do da chuan bij mua chua
	TypePayment  int    `form:"type_payment"`
	AddressId    int    `form:"address_id"`
}

type OrderItemReq struct {
	CartId      int64   `json:"cart_id"`
	BookId      int64   `json:"book_id"`
	BookName    string  `json:"book_name"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
	TotalAmount float64 `json:"total_amount"`
	UserName    string  `json:"user_name"`
}

type GetOrderBuyOneDayResponse struct {
	CountOrder   int     `json:"count"`
	CountProduct int     `json:"count_product"`
	Amount       float64 `json:"amount"`
	NewCustomer  int     `json:"new_customer"`
}
type OrderRequestSubmitBuyFromCart struct {
	CustomerName string `json:"customer_name"` // Tên khách hàng
	Items        string `json:"items"`
	AddresId     string `json:"addres_id"`
}
type Items struct {
	CartID      int64   `json:"cart_id"`      // ID của giỏ hàng
	BookID      int64   `json:"book_id"`      // ID của sách
	BookName    string  `json:"book_name"`    // Tên sách
	Quantity    int     `json:"quantity"`     // Số lượng
	Price       float64 `json:"price"`        // Giá của sách
	TotalAmount float64 `json:"total_amount"` // Tổng số tiền
	URL         string  `json:"url"`          // URL ảnh sách
}

type OrderDetailsInterNal struct {
	OrderID       int64                   `json:"order_id"`
	CreateTime    time.Time               `json:"create_time"`
	Address       *domain.DeliveryAddress `json:"address"`
	Amount        float64                 `json:"amount"`
	EstimatedDate time.Time               `json:"estimated_date"` // Dự kiến ngày nhận
	Items         []Item                  `json:"items"`          // Danh sách các item
	Status        int                     `json:"status"`
	PaymentType   int                     `json:"payment_type"`
}
type OrderDetailsAdmin struct {
	UserName      string                  `json:"user_name"`
	OrderID       int64                   `json:"order_id"`
	CreateTime    time.Time               `json:"create_time"`
	Address       *domain.DeliveryAddress `json:"address"`
	Amount        float64                 `json:"amount"`
	EstimatedDate time.Time               `json:"estimated_date"` // Dự kiến ngày nhận
	Items         []Item                  `json:"items"`          // Danh sách các item
	Status        int                     `json:"status"`
	PaymentType   int                     `json:"payment_type"`
}
type ListOrderDetailsAdminForHeader struct {
	OrderDetailsAdmin          []*OrderDetailsAdmin `json:"order_details_admin"`
	CountNewAccountUserInMonth int                  `json:"count_new_account_user_in_month"`
}

type Bill struct {
	OrderId    int64                   `json:"order_id"`
	Code       string                  `json:"code"` //encode
	Amount     float64                 `json:"amount"`
	Items      []Item                  `json:"items"` // Danh sách các item
	Address    *domain.DeliveryAddress `json:"address"`
	CreateTime time.Time               `json:"create_time"`
}
