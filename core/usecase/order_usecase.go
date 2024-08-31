package usecase

import (
	"context"
	"shoe_shop_server/common/enums"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
	"strconv"
	"time"
)

type UseCaseOrder struct {
	order domain.RepositoryOrder
	book  domain.RepositoryBook
	trans domain.RepositoryTransaction
}

func NewUseCaseOrder(order domain.RepositoryOrder, book domain.RepositoryBook, trans domain.RepositoryTransaction) *UseCaseOrder {
	return &UseCaseOrder{
		order: order,
		book:  book,
		trans: trans,
	}
}

func (u *UseCaseOrder) CreateOrder(ctx context.Context, req *entities.Order) (int64, errors.Error) {

	orderId := utils.GenerateUniqueKey()
	orderDate := time.Now()
	tx, _ := u.trans.BeginTransaction(ctx)
	// Convert time.Time to string in the desired format
	orderDateString := orderDate.Format("2006-01-02 15:04:05")
	book, err := u.book.GetBookById(ctx, req.BookID)
	if err != nil {
		return 0, errors.NewSystemError("error system 1")
	}
	if req.Quantity > book.Quantity {
		return 0, errors.NewCustomHttpError(200, 0, "qua so luong")
	}
	err = u.order.CreateOrder(ctx, tx, &domain.Order{
		ID:                orderId,
		CustomerName:      req.CustomerName,
		OrderDate:         orderDateString,
		BookID:            req.BookID,
		BookTitle:         book.Title,
		BookAuthor:        book.AuthorName,
		BookPublisher:     book.Publisher,
		BookPublishedDate: book.PublishedDate,
		BookISBN:          book.ISBN,
		BookGenre:         book.Genre, // Thể loại hoặc danh mục của cuốn sách
		BookDescription:   book.Description,
		BookLanguage:      book.Language,
		BookPageCount:     book.PageCount,
		BookDimensions:    book.Dimensions, // Kích thước vật lý của cuốn sách
		BookWeight:        book.Weight,
		BookPrice:         book.Price,
		Quantity:          req.Quantity,
		TotalAmount:       book.Price * float64(req.Quantity),
		Status:            enums.ORDER_INIT,
	})
	if err != nil {
		return 0, errors.NewSystemError("error system 2")
	}
	err = u.book.UpdateQuantity(ctx, tx, req.BookID, book.Quantity-req.Quantity)
	if err != nil {
		return 0, errors.NewSystemError("error system 3")
	}
	tx.Commit()
	return orderId, nil
}

func (u *UseCaseOrder) GetOrderById(ctx context.Context, id string) (*domain.Order, errors.Error) {
	idNumber, _ := strconv.ParseInt(id, 10, 64)
	resp, err := u.order.GetOrderByID(ctx, idNumber)
	if err != nil {
		return nil, errors.NewSystemError("error system")
	}
	return resp, nil
}
