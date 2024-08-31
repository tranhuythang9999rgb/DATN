package entities

type Order struct {
	CustomerName string `form:"customer_name"` // Tên khách hàng
	BookID       int64  `form:"book_id"`       // ID sách
	Quantity     int    `form:"quantity"`      // Số lượng sách trong đơn hàng
}
