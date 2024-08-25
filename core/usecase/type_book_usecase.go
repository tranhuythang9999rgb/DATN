package usecase

import (
	"context"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
)

type TypeBookUseCase struct {
	book domain.RepositoryGenre
}

func NewTypeBookUseCase(book domain.RepositoryGenre) *TypeBookUseCase {
	return &TypeBookUseCase{
		book: book,
	}
}
func (u *TypeBookUseCase) AddTypeBook(ctx context.Context, req *entities.TypeBooks) errors.Error {
	typeBook, err := u.book.GetNameTypeBook(ctx, req.Name)
	if err != nil {
		return errors.NewSystemError("error system")
	}
	if typeBook != nil {
		return errors.NewCustomHttpError(200, 2, "type name exists")
	}
	err = u.book.Create(ctx, &domain.TypeBooks{
		ID:       utils.GenerateUniqueKey(),
		Name:     req.Name,
		IsActive: true,
	})
	if err != nil {
		return errors.NewSystemError("error system")
	}
	return nil
}

func (u *TypeBookUseCase) GetListTypeBook(ctx context.Context) ([]*domain.TypeBooks, errors.Error) {

	typeBooks, err := u.book.List(ctx)
	if err != nil {
		return nil, errors.NewSystemError("error system")
	}
	return typeBooks, nil
}
