package domain

import "context"

type OrderItem struct {
	ID       int64   `json:"id"`
	OrderID  int64   `json:"order_id"`
	BookID   int64   `json:"book_id"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
}

type RepositoryOrderItem interface {
	CreateOrderItem(ctx context.Context, req *OrderItem) error
	GetOrderByOrderId(ctx context.Context, orderId int64) ([]*OrderItem, error)
}
