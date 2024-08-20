package domain

import "context"

// Genre đại diện cho một thể sachs loại trong hệ thống
type Genre struct {
	ID       int    `json:"id"`   // Mã định danh duy nhất cho thể loại
	Name     string `json:"name"` // Tên của thể loại
	IsActive bool   `json:"is_active"`
}

// RepositoryGenre định nghĩa các phương thức CRUD cho thể loại sách
type RepositoryGenre interface {
	Create(ctx context.Context, genre *Genre) (int64, error)
	Delete(ctx context.Context, id int64) error
	GetByID(ctx context.Context, id int64) (*Genre, error)
	List(ctx context.Context, limit int, offset int) ([]*Genre, error)
	Update(ctx context.Context, genre *Genre) error
}
