package usecase

import (
	"context"
	"shoe_shop_server/common/enums"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
	"strconv"
)

type DeliveryAddressUseCase struct {
	delivery_address domain.RepositoryDeliveryAddress
	order            domain.RepositoryOrder
	user             domain.RepositoryUser
}

func NewDeliveryAddressUseCase(delivery_address domain.RepositoryDeliveryAddress,
	order domain.RepositoryOrder,
	user domain.RepositoryUser,
) *DeliveryAddressUseCase {
	return &DeliveryAddressUseCase{
		delivery_address: delivery_address,
		order:            order,
		user:             user,
	}
}

func (u *DeliveryAddressUseCase) AddDeliveryAddress(ctx context.Context, req *entities.DeliveryAddress) errors.Error {
	err := u.delivery_address.Create(ctx, &domain.DeliveryAddress{
		ID:             utils.GenerateUniqueKey(),
		OrderID:        req.OrderID,
		Email:          req.Email,
		UserName:       req.UserName,
		PhoneNumber:    req.PhoneNumber,
		Province:       req.Province,
		District:       req.District,
		Commune:        req.Commune,
		Detailed:       req.Detailed,
		DefaultAddress: 0,
		NickName:       req.NickName,
	})
	if err != nil {
		return errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	err = u.order.UpdateStatusOrder(ctx, req.OrderID, enums.AWAITING_CONFIRMATION)
	if err != nil {
		return errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	return nil
}

func (u *DeliveryAddressUseCase) AddDeliveryAddressUpdateProfile(ctx context.Context, req *entities.DeliveryAddressUpdateProFile) errors.Error {
	user, err := u.user.GetProFile(ctx, req.UserName)
	if err != nil {
		return errors.ErrSystem
	}
	err = u.delivery_address.Create(ctx, &domain.DeliveryAddress{
		ID:             utils.GenerateUniqueKey(),
		OrderID:        0,
		Email:          user.Email,
		UserName:       req.UserName,
		PhoneNumber:    req.PhoneNumber,
		Province:       req.Province,
		District:       req.District,
		Commune:        req.Commune,
		Detailed:       req.Commune,
		Otp:            0,
		DefaultAddress: 0,
		NickName:       req.NickName,
	})
	if err != nil {
		return errors.ErrSystem
	}
	return nil
}

func (u *DeliveryAddressUseCase) GetAddressByUserName(ctx context.Context, username string) (*domain.DeliveryAddress, error) {
	info, err := u.delivery_address.GetAddressByUserName(ctx, username)
	if err != nil {
		return nil, errors.ErrSystem
	}
	return info, nil
}

func (u *DeliveryAddressUseCase) GetListAddressByUserName(ctx context.Context, user_name string) ([]*domain.DeliveryAddress, errors.Error) {
	listAddress, err := u.delivery_address.GetListAddressByUserName(ctx, user_name)
	if err != nil {
		return nil, errors.ErrSystem
	}
	return listAddress, nil
}

func (u *DeliveryAddressUseCase) UpdateStatusAddressById(ctx context.Context, id string, name string) errors.Error {
	numberId, _ := strconv.ParseInt(id, 10, 64)
	err := u.delivery_address.UpdateStatusAddressById(ctx, numberId, name)
	if err != nil {
		return errors.ErrSystem
	}
	return nil
}

func (u *DeliveryAddressUseCase) DeleteAddressById(ctx context.Context, id string) errors.Error {
	numberId, _ := strconv.ParseInt(id, 10, 64)
	err := u.delivery_address.DeleteAddressById(ctx, numberId)
	if err != nil {
		return errors.ErrSystem
	}
	return nil
}
