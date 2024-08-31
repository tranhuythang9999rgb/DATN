package usecase

import (
	"context"
	"shoe_shop_server/common/enums"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
)

type DeliveryAddressUseCase struct {
	delivery_address domain.RepositoryDeliveryAddress
	order            domain.RepositoryOrder
}

func NewDeliveryAddressUseCase(delivery_address domain.RepositoryDeliveryAddress,
	order domain.RepositoryOrder,
) *DeliveryAddressUseCase {
	return &DeliveryAddressUseCase{
		delivery_address: delivery_address,
		order:            order,
	}
}

func (u *DeliveryAddressUseCase) AddDeliveryAddress(ctx context.Context, req *entities.DeliveryAddress) errors.Error {
	log.Infof("req ", req.OrderID)
	err := u.delivery_address.Create(ctx, &domain.DeliveryAddress{
		ID:          utils.GenerateUniqueKey(),
		OrderID:     req.OrderID,
		Email:       req.Email,
		UserName:    req.UserName,
		PhoneNumber: req.PhoneNumber,
		Province:    req.Province,
		District:    req.District,
		Commune:     req.Commune,
		Detailed:    req.Detailed,
	})
	if err != nil {
		return errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	err = u.order.UpdateStatusOrder(ctx, req.OrderID)
	if err != nil {
		return errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	return nil
}
