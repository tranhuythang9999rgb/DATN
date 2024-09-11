package entities

import "shoe_shop_server/core/domain"

type Favorites struct {
	UserId int64 `json:"user_id"`
	BookId int64 `json:"book_id"`
}
type ListBookFavorites struct {
	Books []*domain.Book `json:"books"`
}
