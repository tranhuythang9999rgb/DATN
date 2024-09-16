package usecase

import (
	"context"
	"encoding/json"
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
	order     domain.RepositoryOrder
	book      domain.RepositoryBook
	trans     domain.RepositoryTransaction
	orderItem domain.RepositoryOrderItem
}

func NewUseCaseOrder(order domain.RepositoryOrder, book domain.RepositoryBook,
	orderItem domain.RepositoryOrderItem,
	trans domain.RepositoryTransaction) *UseCaseOrder {
	return &UseCaseOrder{
		order:     order,
		book:      book,
		trans:     trans,
		orderItem: orderItem,
	}
}

func (u *UseCaseOrder) CreateOrder(ctx context.Context, req *entities.Order) (int64, errors.Error) {
	orderId := utils.GenerateUniqueKey()
	orderDate := time.Now()
	orderDateString := orderDate.Format("2006-01-02 15:04:05")

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
			CreateOrder:       utils.GenerateTimestamp(),
			CreateTime:        time.Now(),
			AddressId:         int64(req.AddressId),
		})
		if err != nil {
			return 0, errors.NewSystemError("error system")
		}
		// log.Infof("id ", checkorderExists.Quantity, "req ", req.Quantity, "count : ", book.Quantity-(checkorderExists.Quantity-req.Quantity))
		// Update book quantity

		return req.OrderId, nil
	} else {
		// Create a new order
		err = u.order.CreateOrder(ctx, &domain.Order{
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
			CreateOrder:       utils.GenerateTimestamp(),
			AddressId:         int64(req.AddressId),
		})
		if err != nil {
			return 0, errors.NewSystemError("error system 5")
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

func (u *UseCaseOrder) UpdateStatusOrder(ctx context.Context, orderId string) errors.Error {
	numberOrderId, _ := strconv.ParseInt(orderId, 10, 64)
	//statusNumber, _ := strconv.ParseInt(status, 10, 64)
	//log.Infof("req ", statusNumber)
	orderInfor, err := u.order.GetOrderByID(ctx, numberOrderId)
	if err != nil {
		return errors.NewSystemError(fmt.Sprintf("error system . %v", err))
	}
	bookInfor, err := u.book.GetBookById(ctx, orderInfor.BookID)
	if err != nil {
		return errors.NewSystemError(fmt.Sprintf("error system . %v", err))
	}
	u.book.UpdateQuantity(ctx, orderInfor.BookID, bookInfor.Quantity-orderInfor.Quantity)
	err = u.order.UpdateStatusOrderSucsess(ctx, numberOrderId)
	if err != nil {
		return errors.NewSystemError(fmt.Sprintf("error system . %v", err))
	}
	return nil
}

func (u *UseCaseOrder) ListOrder(ctx context.Context, req *domain.OrderForm) ([]*domain.Order, errors.Error) {
	var orders []*domain.Order

	listOrder, err := u.order.ListOrders(ctx, req)
	if err != nil {
		return nil, errors.ErrSystem
	}
	for _, v := range listOrder {
		if v.Status != 7 {
			orders = append(orders, v)
		}
	}
	return orders, nil
}

func (u *UseCaseOrder) UpdateOrderForSend(ctx context.Context, id string) errors.Error {
	idNumber, _ := strconv.ParseInt(id, 10, 64)
	err := u.order.UpdateOrderForSend(ctx, idNumber, enums.ORDER_STATUS_SUBMIT_SEND)
	if err != nil {
		return errors.NewSystemError(fmt.Sprintf("error system . %v", err))
	}
	return nil
}

func (u *UseCaseOrder) ListOrdersUseTk(ctx context.Context, start, end string) ([]*domain.Order, errors.Error) {
	startN, _ := strconv.ParseInt(start, 10, 64)
	endN, _ := strconv.ParseInt(end, 10, 64)
	listOrder, err := u.order.ListOrdersUseTk(ctx, &domain.OrderFormUseTk{
		StartTime: startN,
		EndTime:   endN,
	})
	if err != nil {
		return nil, errors.ErrSystem
	}
	return listOrder, nil
}

func (u *UseCaseOrder) CreateOrderInCart(ctx context.Context, req []*entities.OrderItemReq) errors.Error {
	// Tạo Order mới

	orderId := utils.GenerateUniqueKey()

	var totalAmount float64
	for _, item := range req {
		// Lấy thông tin sách
		book, err := u.book.GetBookById(ctx, item.BookId)
		if err != nil {
			log.Error(err, "error 1")
			return errors.ErrSystem
		}
		// Kiểm tra số lượng tồn kho
		if book.Quantity < item.Quantity {
			log.Error(err, "ko du san pham")
			return errors.NewCustomHttpError(200, 10, "ko du san pham")
		}

		// Tạo OrderItem mới
		orderItem := &domain.OrderItem{
			ID:       utils.GenerateUniqueKey(),
			OrderID:  orderId,
			BookID:   item.BookId,
			Quantity: item.Quantity,
			Price:    item.Price,
		}

		if err := u.orderItem.CreateOrderItem(ctx, orderItem); err != nil {
			log.Error(err, "error 3")
			return errors.ErrSystem
		}

		// Cập nhật số lượng sách trong kho
		if err := u.book.UpdateQuantity(ctx, book.ID, int(book.Quantity)-int(item.Quantity)); err != nil {
			log.Error(err, "error 4")
			return errors.ErrSystem
		}

		// Cập nhật tổng số tiền của đơn hàng
		totalAmount += item.TotalAmount
	}

	order := &domain.Order{
		ID:           orderId,
		CustomerName: req[0].UserName, // Giả sử tất cả các mục đều có cùng tên khách hàng
		OrderDate:    time.Now().Format("2006-01-02"),
		Status:       enums.ORDER_INIT,           // Giả sử đây là trạng thái mặc định
		TypePayment:  enums.TYPE_PAYMENT_OFFLINE, // Giả sử đây là loại thanh toán mặc định
		BookPrice:    totalAmount,
		CreateTime:   time.Now(),
	}

	if err := u.order.CreateOrder(ctx, order); err != nil {
		return errors.ErrSystem
	}

	return nil
}

func (u *UseCaseOrder) UpdateOrderOffline(ctx context.Context, orderId string) errors.Error {

	idNumber, _ := strconv.ParseInt(orderId, 10, 64)
	err := u.order.UpdateStatusPaymentOffline(ctx, idNumber, enums.ORDER_WAITING_FOR_SHIPMENT)
	if err != nil {
		return errors.NewSystemError(fmt.Sprintf("error system . %v", err))
	}
	return nil
}

func (u *UseCaseOrder) GetListOrderBuyOneDay(ctx context.Context, day string) (*entities.GetOrderBuyOneDayResponse, errors.Error) {

	dayNumber, _ := strconv.ParseInt(day, 10, 64)
	var amount float64
	listOrder, err := u.order.GetListOrderByTimeOneDay(ctx, dayNumber)
	if err != nil {
		return nil, errors.NewSystemError(fmt.Sprintf("error system . %v", err))
	}
	for _, v := range listOrder {
		amount = v.TotalAmount
	}
	return &entities.GetOrderBuyOneDayResponse{
		CountOrder:   len(listOrder),
		CountProduct: 0,
		Amount:       amount,
		NewCustomer:  0,
	}, nil
}

// {
//     "cart_id": 2594695,
//     "book_id": 8113677,
//     "book_name": "8",
//     "quantity": 1,
//     "price": 8,
//     "total_amount": 8,
//     "url": "http://localhost:8080/manager/shader/thao/6284312.png"
// }

func (u *UseCaseOrder) CreateOrderWhenBuyCart(ctx context.Context, req *entities.OrderRequestSubmitBuyFromCart) (int64, float64, errors.Error) {

	var orderItems []*entities.Items
	var count int
	var priceToal float64
	orderId := utils.GenerateUniqueKey()

	err := json.Unmarshal([]byte(req.Items), &orderItems)
	if err != nil {
		log.Error(err, "Error unmarshalling JSON: %v")
		return 0, 0, errors.ErrSystem
	}

	orderDate := time.Now()
	orderDateString := orderDate.Format("2006-01-02 15:04:05")
	for _, v := range orderItems {
		count += v.Quantity
		priceToal += v.Price
		book, _ := u.book.GetBookById(ctx, v.BookID)
		u.book.UpdateQuantity(ctx, v.BookID, book.Quantity-v.Quantity)
		u.orderItem.CreateOrderItem(ctx, &domain.OrderItem{
			ID:       utils.GenerateUniqueKey(),
			OrderID:  orderId,
			BookID:   v.BookID,
			Quantity: v.Quantity,
			Price:    v.Price,
		})
	}
	err = u.order.CreateOrder(ctx, &domain.Order{
		ID:           orderId,
		CustomerName: req.CustomerName,
		OrderDate:    orderDateString,
		Quantity:     count,
		TotalAmount:  priceToal,
		Status:       enums.ORDER_ARE_PAYING,
		TypePayment:  enums.TYPE_PAYMENT_ONLINE,
		CreateTime:   time.Now(),
		CreateOrder:  utils.GenerateTimestamp(),
		AddressId:    0,

		Items: req.Items,
	})
	if err != nil {
		log.Error(err, "Error unmarshalling JSON: %v")
		return 0, 0, errors.ErrSystem
	}

	return orderId, priceToal, nil
}
