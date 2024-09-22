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
	address   domain.RepositoryDeliveryAddress
	user      domain.RepositoryUser
}

func NewUseCaseOrder(order domain.RepositoryOrder,
	book domain.RepositoryBook,
	orderItem domain.RepositoryOrderItem,
	address domain.RepositoryDeliveryAddress,
	user domain.RepositoryUser,
	trans domain.RepositoryTransaction) *UseCaseOrder {
	return &UseCaseOrder{
		order:     order,
		book:      book,
		trans:     trans,
		orderItem: orderItem,
		address:   address,
		user:      user,
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

	err := u.order.UpdateStatusOrderSucsess(ctx, numberOrderId)
	if err != nil {
		log.Error(err, "error server")
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

func (u *UseCaseOrder) UpdateOrderOffline(ctx context.Context, orderId string) errors.Error {

	idNumber, _ := strconv.ParseInt(orderId, 10, 64)
	err := u.order.UpdateStatusPaymentOffline(ctx, idNumber, enums.ORDER_WAITING_FOR_SHIPMENT)
	if err != nil {
		return errors.NewSystemError(fmt.Sprintf("error system . %v", err))
	}
	return nil
}

func (u *UseCaseOrder) UpdateOrderCanCel(ctx context.Context, orderId string) errors.Error {

	idNumber, _ := strconv.ParseInt(orderId, 10, 64)
	err := u.order.UpdateOrder(ctx, &domain.Order{
		ID:     idNumber,
		Status: enums.ORDER_CANCEL,
	})
	if err != nil {
		log.Error(err, "error")
		return errors.NewSystemError(fmt.Sprintf("error system . %v", err))
	}
	listOrderId, err := u.orderItem.GetOrderByOrderId(ctx, idNumber)
	if err != nil {
		log.Error(err, "error")
		return errors.NewSystemError(fmt.Sprintf("error system . %v", err))
	}
	for _, v := range listOrderId {
		book, err := u.book.GetBookById(ctx, v.BookID)
		if err != nil {
			log.Error(err, "error")
			return errors.NewSystemError(fmt.Sprintf("error system . %v", err))
		}
		if book != nil {
			err = u.book.UpdateQuantity(ctx, v.BookID, book.Quantity+v.Quantity)
			if err != nil {
				log.Error(err, "error")
				return errors.NewSystemError(fmt.Sprintf("error system . %v", err))
			}
		}
	}

	return nil
}

func (u *UseCaseOrder) CreateOrderWhenBuyCart(ctx context.Context, req *entities.OrderRequestSubmitBuyFromCart) (int64, float64, errors.Error) {
	var orderItems []*entities.Items
	var count int
	var priceToal float64
	orderId := utils.GenerateUniqueKey()
	addressIdNum, _ := strconv.ParseInt(req.AddresId, 10, 64)
	err := json.Unmarshal([]byte(req.Items), &orderItems)
	if err != nil {
		log.Error(err, "Error unmarshalling JSON: %v")
		return 0, 0, errors.ErrSystem
	}

	orderDate := time.Now()
	orderDateString := orderDate.Format("2006-01-02 15:04:05")
	for _, v := range orderItems {
		count += v.Quantity
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
		TotalAmount:  float64(orderItems[0].TotalAmount),
		Status:       enums.ORDER_PEND,
		TypePayment:  enums.TYPE_PAYMENT_ONLINE,
		CreateTime:   time.Now(),
		CreateOrder:  utils.GenerateTimestamp(),
		AddressId:    addressIdNum,

		Items: req.Items,
	})
	if err != nil {
		log.Error(err, "Error unmarshalling JSON: %v")
		return 0, 0, errors.ErrSystem
	}
	log.Infof("data ", priceToal)
	return orderId, float64(orderItems[0].TotalAmount), nil
}

func (u *UseCaseOrder) CreateOrderWhenBuyOffLine(ctx context.Context, req *entities.OrderRequestSubmitBuyFromCart) errors.Error {
	addressIdNum, _ := strconv.ParseInt(req.AddresId, 10, 64)

	var orderItems []*entities.Items
	var count int
	var priceToal float64
	orderId := utils.GenerateUniqueKey()

	err := json.Unmarshal([]byte(req.Items), &orderItems)
	if err != nil {
		log.Error(err, "Error unmarshalling JSON: %v")
		return errors.ErrSystem
	}

	orderDate := time.Now()
	orderDateString := orderDate.Format("2006-01-02 15:04:05")
	for _, v := range orderItems {
		count += v.Quantity
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
		TotalAmount:  float64(orderItems[0].TotalAmount),
		Status:       enums.ORDER_PEND,
		TypePayment:  enums.TYPE_PAYMENT_OFFLINE,
		CreateTime:   time.Now(),
		CreateOrder:  utils.GenerateTimestamp(),
		AddressId:    addressIdNum,

		Items: req.Items,
	})
	if err != nil {
		log.Error(err, "Error system: %v")
		return errors.ErrSystem
	}
	log.Infof("data ", priceToal)
	return nil
}

func (u *UseCaseOrder) GetListOrderByUserProFile(ctx context.Context, name string) ([]*entities.OrderDetailsInterNal, error) {

	now := time.Now()
	estimatedDate := now.Add(3 * 24 * time.Hour)
	var listItemOrder = make([]entities.Item, 0)
	var detailListorder = make([]*entities.OrderDetailsInterNal, 0)
	listOrder, err := u.order.GetListorderByUser(ctx, name)
	if err != nil {
		log.Error(err, "Error unmarshalling JSON: %v")
		return nil, errors.ErrSystem
	}
	for _, v := range listOrder {

		orderItem, err := u.orderItem.GetOrderByOrderId(ctx, v.ID)
		if err != nil {
			log.Error(err, "Error system: %v")
			return nil, errors.ErrSystem
		}
		getaddress, err := u.address.GetAddressByUserName(ctx, name)
		if err != nil {
			log.Error(err, "Error system: %v")
			return nil, errors.ErrSystem
		}
		for _, v := range orderItem {
			book, _ := u.book.GetBookById(ctx, v.BookID)
			listItemOrder = append(listItemOrder, entities.Item{
				Name:     book.Title,
				Quantity: v.Quantity,
				Price:    v.Price,
			})
		}

		if orderItem != nil {
			detailListorder = append(detailListorder, &entities.OrderDetailsInterNal{
				OrderID:    v.ID,
				CreateTime: v.CreateTime,
				Address: &domain.DeliveryAddress{
					ID:          getaddress.ID,
					OrderID:     getaddress.OrderID,
					Email:       getaddress.Email,
					UserName:    name,
					PhoneNumber: getaddress.PhoneNumber,
					Province:    getaddress.PhoneNumber,
					District:    getaddress.District,
					Commune:     getaddress.Commune,
					Detailed:    getaddress.Detailed,
					NickName:    getaddress.NickName,
				},
				Amount:        v.TotalAmount,
				EstimatedDate: estimatedDate,
				Items:         listItemOrder,
				Status:        v.Status,
				PaymentType:   v.TypePayment,
			})
		}

	}

	return detailListorder, nil
}

func (u *UseCaseOrder) GetListOrderAdmin(ctx context.Context) ([]*entities.OrderDetailsAdmin, error) {

	now := time.Now()
	estimatedDate := now.Add(3 * 24 * time.Hour)
	var listItemOrder = make([]entities.Item, 0)
	var detailListorder = make([]*entities.OrderDetailsAdmin, 0)
	listOrder, err := u.order.ListOrders(ctx, &domain.OrderForm{})
	if err != nil {
		log.Error(err, "Error unmarshalling JSON: %v")
		return nil, errors.ErrSystem
	}
	for _, v := range listOrder {

		orderItem, err := u.orderItem.GetOrderByOrderId(ctx, v.ID)
		if err != nil {
			log.Error(err, "Error system: %v")
			return nil, errors.ErrSystem
		}
		getaddress, err := u.address.GetAddressByUserName(ctx, v.CustomerName)
		if err != nil {
			log.Error(err, "Error system: %v")
			return nil, errors.ErrSystem
		}
		for _, v := range orderItem {
			book, _ := u.book.GetBookById(ctx, v.BookID)
			listItemOrder = append(listItemOrder, entities.Item{
				Name:     book.Title,
				Quantity: v.Quantity,
				Price:    v.Price,
			})
		}

		if orderItem != nil {
			detailListorder = append(detailListorder, &entities.OrderDetailsAdmin{
				OrderID:    v.ID,
				CreateTime: v.CreateTime,
				Address: &domain.DeliveryAddress{
					ID:          getaddress.ID,
					OrderID:     getaddress.OrderID,
					Email:       getaddress.Email,
					UserName:    v.CustomerName,
					PhoneNumber: getaddress.PhoneNumber,
					Province:    getaddress.PhoneNumber,
					District:    getaddress.District,
					Commune:     getaddress.Commune,
					Detailed:    getaddress.Detailed,
					NickName:    getaddress.NickName,
				},
				Amount:        v.TotalAmount,
				EstimatedDate: estimatedDate,
				Items:         listItemOrder,
				Status:        v.Status,
				PaymentType:   v.TypePayment,
				UserName:      v.CustomerName,
			})
		}

	}

	return detailListorder, nil
}

func (u *UseCaseOrder) GetListOrderByThongkeHeader(ctx context.Context) (*entities.ListOrderDetailsAdminForHeader, error) {
	users, err := u.user.GetNewUsersInMonth()
	if err != nil {
		return nil, errors.NewSystemError(fmt.Sprintf("error system . %v", err))
	}
	now := time.Now()
	estimatedDate := now.Add(3 * 24 * time.Hour)
	var listItemOrder = make([]entities.Item, 0)
	var detailListorder = make([]*entities.OrderDetailsAdmin, 0)
	listOrder, err := u.order.ListOrders(ctx, &domain.OrderForm{})
	if err != nil {
		log.Error(err, "Error unmarshalling JSON: %v")
		return nil, errors.ErrSystem
	}
	for _, v := range listOrder {

		orderItem, err := u.orderItem.GetOrderByOrderId(ctx, v.ID)
		if err != nil {
			log.Error(err, "Error system: %v")
			return nil, errors.ErrSystem
		}
		getaddress, err := u.address.GetAddressByUserName(ctx, v.CustomerName)
		if err != nil {
			log.Error(err, "Error system: %v")
			return nil, errors.ErrSystem
		}
		for _, v := range orderItem {
			book, _ := u.book.GetBookById(ctx, v.BookID)
			listItemOrder = append(listItemOrder, entities.Item{
				Name:     book.Title,
				Quantity: v.Quantity,
				Price:    v.Price,
			})
		}

		if orderItem != nil {
			detailListorder = append(detailListorder, &entities.OrderDetailsAdmin{
				OrderID:    v.ID,
				CreateTime: v.CreateTime,
				Address: &domain.DeliveryAddress{
					ID:          getaddress.ID,
					OrderID:     getaddress.OrderID,
					Email:       getaddress.Email,
					UserName:    v.CustomerName,
					PhoneNumber: getaddress.PhoneNumber,
					Province:    getaddress.PhoneNumber,
					District:    getaddress.District,
					Commune:     getaddress.Commune,
					Detailed:    getaddress.Detailed,
					NickName:    getaddress.NickName,
				},
				Amount:        v.TotalAmount,
				EstimatedDate: estimatedDate,
				Items:         listItemOrder,
				Status:        v.Status,
				PaymentType:   v.TypePayment,
				UserName:      v.CustomerName,
			})
		}

	}
	return &entities.ListOrderDetailsAdminForHeader{
		OrderDetailsAdmin:          detailListorder,
		CountNewAccountUserInMonth: len(users),
	}, nil
}
