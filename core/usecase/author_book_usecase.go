package usecase

import (
	"context"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
	"strconv"
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
	respFile, err := utils.SetByCurlImage(ctx, req.File)
	if respFile.Result.Code != 0 || err != nil {
		return errors.ErrSystem
	}
	err = u.authorBook.Create(ctx, &domain.Author{
		ID:          utils.GenerateUniqueKey(),
		Name:        req.Name,
		Biography:   req.Biography,
		BirthDate:   req.BirthDate,
		Nationality: req.Nationality,
		Avatar:      respFile.URL,
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

func (u *AuthorBookCaseUse) DeleteAuthorBookById(ctx context.Context, id string) errors.Error {
	number, _ := strconv.ParseInt(id, 10, 64)
	err := u.authorBook.Delete(ctx, number)
	if err != nil {
		return errors.NewSystemError("error system")
	}
	return nil
}

func (u *AuthorBookCaseUse) GetAuthorBook(ctx context.Context, name string) (*domain.Author, errors.Error) {
	authorBook, err := u.authorBook.GetNameAuthorBook(ctx, name)
	if err != nil {
		return nil, errors.ErrSystem
	}
	return authorBook, nil
}

func (u *AuthorBookCaseUse) UpdateAuthorBookById(ctx context.Context, req *entities.AuthorUpdate) errors.Error {

	err := u.authorBook.Update(ctx, &domain.Author{
		ID:          req.ID,
		Name:        req.Name,
		Biography:   req.Biography,
		BirthDate:   req.BirthDate,
		Nationality: req.Nationality,
	})
	if err != nil {
		log.Error(err, "error")
		return errors.NewSystemError("error system")
	}
	return nil
}
