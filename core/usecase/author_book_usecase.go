package usecase

import (
	"context"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
)

type AuthorBookCaseUse struct {
	authorBook domain.RepositoryAuthor
}

func NewAuthorBookCaseUse(authorBook domain.RepositoryAuthor) *AuthorBookCaseUse {
	return &AuthorBookCaseUse{
		authorBook: authorBook,
	}
}
func (u *AuthorBookCaseUse) AddAuthorBook(ctx context.Context, req *entities.Author) errors.Error {
	author, err := u.authorBook.GetNameAuthorBook(ctx, req.Name)
	if err != nil {
		return errors.NewSystemError("error system")
	}
	if author != nil {
		return errors.NewCustomHttpError(200, 2, "author name exists")
	}
	err = u.authorBook.Create(ctx, &domain.Author{
		ID:          utils.GenerateUniqueKey(),
		Name:        req.Name,
		Biography:   req.Biography,
		BirthDate:   req.BirthDate,
		Nationality: req.Nationality,
	})
	if err != nil {
		return errors.NewSystemError("error system")
	}
	return nil
}
func (u *AuthorBookCaseUse) GetListAuThorBook(ctx context.Context) ([]*domain.Author, errors.Error) {
	list, err := u.authorBook.List(ctx)
	if err != nil {
		return nil, errors.NewSystemError("error system")
	}
	return list, nil
}
