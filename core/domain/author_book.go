package domain

import (
	"context"
	"time"
)

// Author đại diện cho một tác giả trong hệ thống
type Author struct {
	ID          int64     `json:"id"`          // Mã định danh duy nhất của tác giả
	Name        string    `json:"name"`        // Tên của tác giả
	Biography   string    `json:"biography"`   // Tiểu sử ngắn của tác giả
	BirthDate   time.Time `json:"birth_date"`  // Ngày sinh của tác giả
	Nationality string    `json:"nationality"` // Quốc tịch của tác giả
}
type RepositoryAuthor interface {
	Create(ctx context.Context, author *Author) (int64, error)
	Delete(ctx context.Context, id int64) error
	GetByID(ctx context.Context, id int64) (*Author, error)
	List(ctx context.Context, limit int, offset int) ([]*Author, error)
	Update(ctx context.Context, author *Author) error
	GetNameAuthorBook(ctx context.Context, authorName string) (bool, error)
}
