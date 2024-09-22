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

func (u *ControllersUploadBooks) GetBookById(ctx *gin.Context) {
	id := ctx.Query("id")
	book, err := u.books.GetBookById(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, book)
}

func (u *ControllersUploadBooks) UpdateBookById(ctx *gin.Context) {
	var req entities.BookReqUpdate

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, err)
		return
	}
	err := u.books.UpdateBookById(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}
func (u *ControllersUploadBooks) GetListBookSellWell(ctx *gin.Context) {
	books, err := u.books.GetListBookSellWell(ctx)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, books)
}
func (u *ControllersUploadBooks) GetdetailBookByid(ctx *gin.Context) {
	id := ctx.Query("id")
	book, err := u.books.GetdetailBookByid(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, book)
}

func (u *ControllersUploadBooks) GetListBookByTypeBook(ctx *gin.Context) {

	name := ctx.Query("name")
	books, err := u.books.GetListBookByTypeBook(ctx, name)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, books)
}

func (u *ControllersUploadBooks) UpdateQuantityBookByOrderId(ctx *gin.Context) {
	orderId := ctx.Query("id")
	err := u.books.UpdateQuantityBookByOrderId(ctx, orderId)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllersUploadBooks) GetBooksByName(ctx *gin.Context) {
	name := ctx.Query("name")
	books, err := u.books.GetBooksByName(ctx, name)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, books)
}

func (u *ControllersUploadBooks) GetListFiveLatestBooks(ctx *gin.Context) {
	books, err := u.books.GetListBookLasterNew(ctx)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, books)
}

func (u *ControllersUploadBooks) GetListBookByAuthorName(ctx *gin.Context) {
	name := ctx.Query("name")
	books, err := u.books.GetListBookByAuthor(ctx, name)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, books)
}

func (u *ControllersUploadBooks) GetListBookByPublicSherName(ctx *gin.Context) {
	name := ctx.Query("name")
	books, err := u.books.GetListBookByPublicSher(ctx, name)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, books)
}

func (u *ControllersUploadBooks) GetListBookUseBot(ctx *gin.Context) {
	name := ctx.Query("name")
	books, err := u.books.GetListBookUseBot(ctx, name)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, books)
}
