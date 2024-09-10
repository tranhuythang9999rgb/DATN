package entities

type Order struct {
	CustomerName string `form:"customer_name"` // Tên khách hàng
	BookID       int64  `form:"book_id"`       // ID sách
	Quantity     int    `form:"quantity"`      // Số lượng sách trong đơn hàng
	OrderId      int64  `form:"order_id"`      // check xem sachs do da chuan bij mua chua
	TypePayment  int    `form:"type_payment"`
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
