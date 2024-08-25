package domain

import "context"

// Thể loại sách
type TypeBooks struct {
	ID       int64  `json:"id"`   // Mã định danh duy nhất cho thể loại
	Name     string `json:"name"` // Tên của thể loại
	IsActive bool   `json:"is_active"`
}

// RepositoryGenre định nghĩa các phương thức CRUD cho thể loại sách
type RepositoryGenre interface {
	Create(ctx context.Context, genre *TypeBooks) error
	Delete(ctx context.Context, id int64) error
	GetByID(ctx context.Context, id int64) (*TypeBooks, error)
	List(ctx context.Context) ([]*TypeBooks, error)
	Update(ctx context.Context, genre *TypeBooks) error
	GetNameTypeBook(ctx context.Context, book_name string) (*TypeBooks, error)
}
