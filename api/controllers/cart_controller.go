package controllers

import (
	"net/http"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllerCart struct {
	cart *usecase.CartUseCase
	*baseController
}

func NewControllerCart(cart *usecase.CartUseCase, base *baseController) *ControllerCart {
	return &ControllerCart{
		cart:           cart,
		baseController: base,
	}
}

func (u *ControllerCart) AddCart(ctx *gin.Context) {
	var req entities.Cart
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.cart.AddCart(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerCart) GetListCartByUserId(ctx *gin.Context) {
	name := ctx.Query("name")
	resp, err := u.cart.ListCartByUser(ctx, name)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}

func (u *ControllerCart) DeleteCart(ctx *gin.Context) {
	id := ctx.Query("id")
	err := u.cart.DeleteCart(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerCart) UpdateQuantityCartById(ctx *gin.Context) {
	cartId := ctx.Query("cart_id")
	sl := ctx.Query("sl")
	err := u.cart.UpdateQuantityCartById(ctx, cartId, sl)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}
