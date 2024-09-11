package domain

import (
	"context"
)

// CREATE TABLE  if not exists  favorites (
//     user_id INT NOT NULL,
//     book_id INT NOT NULL,
//     liked_at TIMESTAMP DEFAULT NOW(),
//     PRIMARY KEY (user_id, book_id)
// );

type Favorites struct {
	UserId int64 `json:"user_id"`
	BookId int64 `json:"book_id"`
}

type RepositoryFavorites interface {
	UpSertFavorites(ctx context.Context, req *Favorites) error
	DeleteFavoritesByBookId(ctx context.Context, bookId int64) error
	ListBookFavoritesByuserName(ctx context.Context, userId int64) ([]*Favorites, error)
}
