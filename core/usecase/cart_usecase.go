package usecase

import (
	"context"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
	"strconv"
)

type CartUseCase struct {
	cart domain.RepositoryCart
	user domain.RepositoryUser
	book domain.RepositoryBook
	file domain.RepositoryFileStorages
}

func NerCartUseCase(cart domain.RepositoryCart, user domain.RepositoryUser,
	book domain.RepositoryBook, file domain.RepositoryFileStorages) *CartUseCase {
	return &CartUseCase{
		cart: cart,
		user: user,
		book: book,
		file: file,
	}
}

func (u *CartUseCase) AddCart(ctx context.Context, req *entities.Cart) errors.Error {
	user, _ := u.user.GetProFile(ctx, req.UserName)

	err := u.cart.AddCart(ctx, &domain.Cart{
		ID:       utils.GenerateUniqueKey(),
		UserID:   user.ID,
		BookID:   req.BookID,
		Quantity: req.Quantity,
	})
	if err != nil {
		return errors.ErrSystem
	}
	return nil
}

func (u *CartUseCase) ListCartByUser(ctx context.Context, username string) (*entities.ListCart, errors.Error) {
	user, _ := u.user.GetProFile(ctx, username)
	var listCartResp = make([]*entities.CartResp, 0)
	carts, err := u.cart.GetListCartByUserId(ctx, user.ID)
	if err != nil {
		return nil, errors.ErrSystem
	}
	for _, v := range carts {
		book, _ := u.book.GetBookById(ctx, v.BookID)
		if book != nil {
			files, _ := u.file.GetFileByObjectId(ctx, book.ID)
			fileUrl := "" // Mặc định là chuỗi rỗng

			if files != nil {
				fileUrl = files.URL
			}

			listCartResp = append(listCartResp, &entities.CartResp{
				CartId:      v.ID,
				BookId:      v.BookID,
				BookName:    book.Title,
				Quantity:    v.Quantity,
				Price:       book.Price,
				TotalAmount: float64(v.Quantity) * book.Price,
				Url:         fileUrl, // Gán giá trị URL hoặc chuỗi rỗng nếu files là nil
			})
		}
	}
	return &entities.ListCart{
		Carts: listCartResp,
		Count: len(listCartResp),
	}, nil
}

func (u *CartUseCase) DeleteCart(ctx context.Context, id string) errors.Error {
	idNumber, _ := strconv.ParseInt(id, 10, 64)
	err := u.cart.DeleteCart(ctx, idNumber)
	if err != nil {
		return errors.ErrSystem
	}
	return nil
}

func (u *CartUseCase) UpdateQuantityCartById(ctx context.Context, idCart string, quanlity string) errors.Error {
	numberCartId, _ := strconv.ParseInt(idCart, 10, 64)
	numberSl, _ := strconv.ParseInt(quanlity, 10, 64)
	err := u.cart.UpdateQuantityBookCartById(ctx, numberCartId, int(numberSl))
	if err != nil {
		return errors.ErrSystem
	}
	return nil
}
