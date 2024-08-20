package usecase

import (
	"context"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/core/domain"
)

type AuthorBookCaseUse struct {
	authorBook domain.RepositoryAuthor
}

func NewAuthorBookCaseUse(authorBook domain.RepositoryAuthor) *AuthorBookCaseUse {
	return &AuthorBookCaseUse{
		authorBook: authorBook,
	}
}
func (u *AuthorBookCaseUse) AddAuthorBook(ctx context.Context) errors.Error {
	return nil
}
