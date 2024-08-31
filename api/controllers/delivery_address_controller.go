package controllers

import (
	"net/http"
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
