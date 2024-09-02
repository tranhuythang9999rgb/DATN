package controllers

import (
	"net/http"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllerOrder struct {
	order *usecase.UseCaseOrder
	*baseController
}

func NewControllerControllerOrder(order *usecase.UseCaseOrder, base *baseController) *ControllerOrder {
	return &ControllerOrder{
		order:          order,
		baseController: base,
	}
}

func (u *ControllerOrder) CreateOrder(ctx *gin.Context) {
	var req entities.Order
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := u.order.CreateOrder(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}

func (u *ControllerOrder) GetOrderById(ctx *gin.Context) {
	id := ctx.Query("id")
	resp, err := u.order.GetOrderById(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}

func (u *ControllerOrder) UpdateStatusOrder(ctx *gin.Context) {
	orderId := ctx.Query("order_id")
	status := ctx.Query("status")
	err := u.order.UpdateStatusOrder(ctx, orderId, status)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}
