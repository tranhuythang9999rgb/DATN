package usecase

import (
	"context"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
	"strconv"
)

type FavoritesUseCase struct {
	favorite domain.RepositoryFavorites
	book     domain.RepositoryBook
}

func NewFavoritesUseCase(favorites domain.RepositoryFavorites, book domain.RepositoryBook) *FavoritesUseCase {
	return &FavoritesUseCase{
		favorite: favorites,
		book:     book,
	}
}

func (u *FavoritesUseCase) UpsertFavorites(ctx context.Context, req *entities.Favorites) errors.Error {
	err := u.favorite.UpSertFavorites(ctx, &domain.Favorites{
		UserId: req.UserId,
		BookId: req.BookId,
	})
	if err != nil {
		log.Error(err, "error")
		return errors.ErrSystem
	}
	return nil
}
func (u *FavoritesUseCase) DeleteLikeByBookId(ctx context.Context, id string) errors.Error {
	idNumber, _ := strconv.ParseInt(id, 10, 64)
	err := u.favorite.DeleteFavoritesByBookId(ctx, idNumber)
	if err != nil {
		log.Error(err, "error")
		return errors.ErrSystem
	}
	return nil
}

func (u *FavoritesUseCase) FindFavoritesByUserId(ctx context.Context, userId string) (*entities.ListBookFavorites, errors.Error) {

	var listBooks = make([]*domain.Book, 0)
	idNumber, _ := strconv.ParseInt(userId, 10, 64)
	listBook, err := u.favorite.ListBookFavoritesByuserName(ctx, idNumber)
	if err != nil {
		log.Error(err, "error")
		return nil, errors.ErrSystem
	}
	for _, favorites := range listBook {
		book, _ := u.book.GetBookById(ctx, favorites.BookId)
		if book != nil {
			listBooks = append(listBooks, book)
		}
	}
	return &entities.ListBookFavorites{
		Books: listBooks,
	}, nil
}
