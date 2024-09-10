package domain

import (
	"context"
)

// Author đại diện cho một tác giả trong hệ thống
type Author struct {
	ID          int64  `json:"id"`          // Mã định danh duy nhất của tác giả
	Name        string `json:"name"`        // Tên của tác giả
	Biography   string `json:"biography"`   // Tiểu sử ngắn của tác giả
	BirthDate   string `json:"birth_date"`  // Ngày sinh của tác giả
	Nationality string `json:"nationality"` // Quốc tịch của tác giả
	Avatar      string `json:"avatar"`
}
type RepositoryAuthor interface {
	Create(ctx context.Context, author *Author) error
	Delete(ctx context.Context, id int64) error
	GetByID(ctx context.Context, id int64) (*Author, error)
	List(ctx context.Context) ([]*Author, error)
	Update(ctx context.Context, author *Author) error
	GetNameAuthorBook(ctx context.Context, authorName string) (*Author, error)
}
