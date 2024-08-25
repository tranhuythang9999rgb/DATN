package controllers

import (
	"net/http"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllersAuthorBook struct {
	auBook *usecase.AuthorBookCaseUse
	*baseController
}

func NewControllersAuthorBook(
	auBook *usecase.AuthorBookCaseUse,
	baseController *baseController,
) *ControllersAuthorBook {
	return &ControllersAuthorBook{
		auBook:         auBook,
		baseController: baseController,
	}
}
func (u *ControllersAuthorBook) AddAuthorBook(ctx *gin.Context) {
	var req entities.Author
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.auBook.AddAuthorBook(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}
func (u *ControllersAuthorBook) GetAllAuthorBook(ctx *gin.Context) {
	resp, err := u.auBook.GetListAuThorBook(ctx)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}
