package controllers

import (
	"fmt"
	"net/http"
	errors "shoe_shop_server/common/error"
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
	file, err := ctx.FormFile("file")

	var req entities.Author
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err != nil && err != http.ErrMissingFile && err != http.ErrNotMultipart {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Không thể tải ảnh lên.",
		})
		return
	}
	req.File = file
	err = u.auBook.AddAuthorBook(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, errors.NewCustomHttpError(500, 2, fmt.Sprintf("%s", err)))
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

func (u *ControllersAuthorBook) DeleteAuthorBookById(ctx *gin.Context) {
	id := ctx.Query("id")
	err := u.auBook.DeleteAuthorBookById(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllersAuthorBook) GetAuthorBookByUserName(ctx *gin.Context) {
	name := ctx.Query("name")
	author, err := u.auBook.GetAuthorBook(ctx, name)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, author)
}

func (u *ControllersAuthorBook) UpdateAuthorBookById(ctx *gin.Context) {

	file, err := ctx.FormFile("file")

	var req entities.AuthorUpdate
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err != nil && err != http.ErrMissingFile && err != http.ErrNotMultipart {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Không thể tải ảnh lên.",
		})
		return
	}
	req.File = file
	err = u.auBook.UpdateAuthorBookById(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, errors.NewCustomHttpError(500, 2, fmt.Sprintf("%s", err)))
		return
	}
	u.baseController.Success(ctx, nil)
}
