package controllers

import (
	"net/http"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/core/domain"
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
	err := u.order.UpdateStatusOrder(ctx, orderId)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerOrder) GetListOrder(ctx *gin.Context) {
	var req domain.OrderForm
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := u.order.ListOrder(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}

func (u *ControllerOrder) UpdateOrderForSend(ctx *gin.Context) {
	id := ctx.Query("id")
	status := ctx.Query("status")
	err := u.order.UpdateOrderForSend(ctx, id, status)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerOrder) ListOrdersUseTk(ctx *gin.Context) {

	start := ctx.Query("start")
	end := ctx.Query("end")
	resp, err := u.order.ListOrdersUseTk(ctx, start, end)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}

func (u *ControllerOrder) UpdateOrderOffline(ctx *gin.Context) {
	id := ctx.Query("id")
	err := u.order.UpdateOrderOffline(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerOrder) GetOrderBuyOneDay(ctx *gin.Context) {
	resp, err := u.order.GetListOrderByThongkeHeader(ctx)
	if err != nil {
		u.baseController.ErrorData(ctx, errors.ErrBadRequest)
		return
	}
	u.baseController.Success(ctx, resp)
}

func (u *ControllerOrder) CreateOrderWhenBuyOffLine(ctx *gin.Context) {
	var req entities.OrderRequestSubmitBuyFromCart
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.order.CreateOrderWhenBuyOffLine(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerOrder) GetListOrderForuser(ctx *gin.Context) {
	name := ctx.Query("name")
	listOrder, err := u.order.GetListOrderByUserProFile(ctx, name)
	if err != nil {
		u.baseController.ErrorData(ctx, errors.ErrConflict)
		return
	}
	u.baseController.Success(ctx, listOrder)
}

func (u *ControllerOrder) UpdateOrderWhenCanCel(ctx *gin.Context) {
	id := ctx.Query("id")
	err := u.order.UpdateOrderCanCel(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerOrder) GetListOrderForAdmin(ctx *gin.Context) {
	listOrder, err := u.order.GetListOrderAdmin(ctx)
	if err != nil {
		u.baseController.ErrorData(ctx, errors.ErrConflict)
		return
	}
	u.baseController.Success(ctx, listOrder)
}
