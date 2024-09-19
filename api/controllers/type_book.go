package controllers

import (
	"net/http"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllersTypeBook struct {
	typeBook *usecase.TypeBookUseCase
	*baseController
}

func NewControllersTypeBook(
	typeBook *usecase.TypeBookUseCase,
	baseController *baseController,
) *ControllersTypeBook {
	return &ControllersTypeBook{
		typeBook:       typeBook,
		baseController: baseController,
	}
}
func (u *ControllersTypeBook) AddTypeBook(ctx *gin.Context) {
	var req entities.TypeBooks
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.typeBook.AddTypeBook(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllersTypeBook) GetListTypeBook(ctx *gin.Context) {
	resp, err := u.typeBook.GetListTypeBook(ctx)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}

func (u *ControllersTypeBook) DeleteTypeBookById(ctx *gin.Context) {

	id := ctx.Query("id")

	err := u.typeBook.DeleteTypeBookById(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllersTypeBook) UpdateTypeBookById(ctx *gin.Context) {
	var req entities.TypeBooksUpdate
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.typeBook.UpdateTypeBookById(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}
