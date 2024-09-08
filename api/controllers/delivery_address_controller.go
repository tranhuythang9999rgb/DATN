package controllers

import (
	"fmt"
	"net/http"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllerDeliveryAddress struct {
	deliveryAddress *usecase.DeliveryAddressUseCase
	*baseController
}

func NewControllerControllerDeliveryAddress(deliveryAddress *usecase.DeliveryAddressUseCase,
	base *baseController) *ControllerDeliveryAddress {
	return &ControllerDeliveryAddress{
		deliveryAddress: deliveryAddress,
		baseController:  base,
	}
}

func (u *ControllerDeliveryAddress) AddDeliveryAddress(ctx *gin.Context) {
	var req entities.DeliveryAddress
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.deliveryAddress.AddDeliveryAddress(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerDeliveryAddress) AddDeliveryAddressUpdateProfile(ctx *gin.Context) {
	var req entities.DeliveryAddressUpdateProFile
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.deliveryAddress.AddDeliveryAddressUpdateProfile(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerDeliveryAddress) GetAddressByUserName(ctx *gin.Context) {
	name := ctx.Query("name")
	resp, err := u.deliveryAddress.GetAddressByUserName(ctx, name)
	if err != nil {
		u.baseController.ErrorData(ctx, errors.NewCustomHttpError(200, 0, fmt.Sprintln(err.Error())))
		return
	}
	u.baseController.Success(ctx, resp)
}

func (u *ControllerDeliveryAddress) GetListAddressByUserName(ctx *gin.Context) {
	name := ctx.Query("name")
	resp, err := u.deliveryAddress.GetListAddressByUserName(ctx, name)
	if err != nil {
		u.baseController.ErrorData(ctx, errors.NewCustomHttpError(200, 0, fmt.Sprintln(err.Error())))
		return
	}
	u.baseController.Success(ctx, resp)
}

func (u *ControllerDeliveryAddress) UpdateStatusAddressById(ctx *gin.Context) {
	name := ctx.Query("name")
	id := ctx.Query("id")
	err := u.deliveryAddress.UpdateStatusAddressById(ctx, id, name)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerDeliveryAddress) DeleteAddressById(ctx *gin.Context) {
	id := ctx.Query("id")
	err := u.deliveryAddress.DeleteAddressById(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}
