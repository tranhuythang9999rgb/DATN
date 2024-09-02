package usecase

import (
	"context"
	"fmt"
	"shoe_shop_server/common/enums"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"
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
	orderDateString := orderDate.Format("2006-01-02 15:04:05")

	// Start a transaction
	tx, err := u.trans.BeginTransaction(ctx)
	if err != nil {
		return 0, errors.NewSystemError("error system 1")
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		} else if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	// Fetch the book details
	book, err := u.book.GetBookById(ctx, req.BookID)
	if err != nil {
		return 0, errors.NewSystemError("error system 1")
	}

	// Check if requested quantity is available
	if req.Quantity > book.Quantity {
		return 0, errors.NewCustomHttpError(200, 0, "Requested quantity exceeds available stock")
	}

	// Check if the order already exists
	checkorderExists, err := u.order.GetInforMationBook(ctx, req.OrderId, req.BookID)
	if err != nil {
		return 0, errors.NewSystemError("error system 2")
	}

	if checkorderExists != nil {
		// Update existing order
		err = u.order.UpdateOrder(ctx, &domain.Order{
			ID:                req.OrderId,
			CustomerName:      req.CustomerName,
			OrderDate:         checkorderExists.OrderDate,
			BookID:            req.BookID,
			BookTitle:         checkorderExists.BookTitle,
			BookAuthor:        checkorderExists.BookAuthor,
			BookPublisher:     checkorderExists.BookPublisher,
			BookPublishedDate: checkorderExists.BookPublishedDate,
			BookISBN:          checkorderExists.BookISBN,
			BookGenre:         checkorderExists.BookGenre,
			BookDescription:   checkorderExists.BookDescription,
			BookLanguage:      checkorderExists.BookLanguage,
			BookPageCount:     checkorderExists.BookPageCount,
			BookDimensions:    checkorderExists.BookDimensions,
			BookWeight:        checkorderExists.BookWeight,
			BookPrice:         checkorderExists.BookPrice,
			Quantity:          req.Quantity,
			TotalAmount:       checkorderExists.BookPrice * float64(req.Quantity),
			Status:            enums.ORDER_INIT,
		})
		if err != nil {
			return 0, errors.NewSystemError("error system")
		}
		log.Infof("id ", checkorderExists.Quantity, "req ", req.Quantity, "count : ", book.Quantity-(checkorderExists.Quantity-req.Quantity))
		// Update book quantity
		err = u.book.UpdateQuantity(ctx, tx, req.BookID, book.Quantity-(req.Quantity-checkorderExists.Quantity))
		if err != nil {
			return 0, errors.NewSystemError("error system 4")
		}
		return req.OrderId, nil
	} else {
		// Create a new order
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
			BookGenre:         book.Genre,
			BookDescription:   book.Description,
			BookLanguage:      book.Language,
			BookPageCount:     book.PageCount,
			BookDimensions:    book.Dimensions,
			BookWeight:        book.Weight,
			BookPrice:         book.Price,
			Quantity:          req.Quantity,
			TotalAmount:       book.Price * float64(req.Quantity),
			Status:            enums.ORDER_INIT,
		})
		if err != nil {
			return 0, errors.NewSystemError("error system 5")
		}

		// Update book quantity
		err = u.book.UpdateQuantity(ctx, tx, req.BookID, book.QuantityOrigin-req.Quantity)
		if err != nil {
			return 0, errors.NewSystemError("error system 6")
		}
		return orderId, nil
	}
}

func (u *UseCaseOrder) GetOrderById(ctx context.Context, id string) (*domain.Order, errors.Error) {
	idNumber, _ := strconv.ParseInt(id, 10, 64)
	resp, err := u.order.GetOrderByID(ctx, idNumber)
	if err != nil {
		return nil, errors.NewSystemError("error system")
	}
	return resp, nil
}

func (u *UseCaseOrder) UpdateStatusOrder(ctx context.Context, orderId, status string) errors.Error {
	numberOrderId, _ := strconv.ParseInt(orderId, 10, 64)
	statusNumber, _ := strconv.ParseInt(status, 10, 64)
	err := u.order.UpdateStatusOrder(ctx, numberOrderId, int(statusNumber))
	if err != nil {
		return errors.NewSystemError(fmt.Sprintf("error system . %v", err))
	}
	return nil
}
