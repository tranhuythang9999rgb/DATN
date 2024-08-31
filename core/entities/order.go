package entities

type Order struct {
	CustomerName string `form:"customer_name"` // Tên khách hàng
	BookID       int64  `form:"book_id"`       // ID sách
	Quantity     int    `form:"quantity"`      // Số lượng sách trong đơn hàng
	OrderId      int64  `form:"order_id"`      // check xem sachs do da chuan bij mua chua
}
