package controllers

import (
	"net/http"
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
	err := u.order.UpdateOrderForSend(ctx, id)
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

func (u *ControllerOrder) CreateOrderItem(ctx *gin.Context) {
	var req []*entities.OrderItemReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.order.CreateOrderInCart(ctx, req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
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
	dayOne := ctx.Query("dayOne")
	resp, err := u.order.GetListOrderBuyOneDay(ctx, dayOne)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
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
