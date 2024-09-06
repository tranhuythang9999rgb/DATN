package domain

import "context"

type Cart struct {
	ID       int64 `json:"id"`
	UserID   int64 `json:"user_id"`
	BookID   int64 `json:"book_id"`
	Quantity int   `json:"quantity"`
}
type RepositoryCart interface {
	AddCart(ctx context.Context, req *Cart) error
	DeleteCart(ctx context.Context, id int64) error
	GetListCartByUserId(ctx context.Context, id int64) ([]*Cart, error)
	UpdateQuantityBookCartById(ctx context.Context, id int64, quantity int) error
}
