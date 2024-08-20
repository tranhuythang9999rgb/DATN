package controllers

import (
	"net/http"
	"shoe_shop_server/common/log"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllersUploadBooks struct {
	books *usecase.UploadBookUseCase
	*baseController
}

func NewControllersUploadBooks(
	books *usecase.UploadBookUseCase,
	baseController *baseController,
) *ControllersUploadBooks {
	return &ControllersUploadBooks{
		books:          books,
		baseController: baseController,
	}
}

func (u *ControllersUploadBooks) AddBook(ctx *gin.Context) {

	var req entities.Book

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, err)
		return
	}
	files, err := u.baseController.GetUploadedFiles(ctx)
	if err != nil {
		log.Error(err, "error")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.File = files
	if err := u.books.AddBook(ctx, &req); err != nil {
		log.Error(err, "error")
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllersUploadBooks) ListBooks(ctx *gin.Context) {

	var req entities.BookReqForm

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, err)
		return
	}
	resp, err := u.books.GetListBook(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)

}
func (u *ControllersUploadBooks) DeleteBookById(ctx *gin.Context) {
	id := ctx.Query("id")
	err := u.books.DeleteBookById(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}
