package controllers

import (
	"fmt"
	"net/http"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllersPublisher struct {
	publisher *usecase.PublisherUseCase
	*baseController
}

func NewControllersPublisher(
	publisher *usecase.PublisherUseCase,
	baseController *baseController,
) *ControllersPublisher {
	return &ControllersPublisher{
		publisher:      publisher,
		baseController: baseController,
	}
}

func (u *ControllersPublisher) AddPublisher(ctx *gin.Context) {

	file, err := ctx.FormFile("file")

	var req entities.Publisher
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
	err = u.publisher.AddPublisher(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, errors.NewCustomHttpError(500, 10, fmt.Sprintf("%s", err)))
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllersPublisher) ListPublisher(ctx *gin.Context) {
	resp, err := u.publisher.ListPublisher(ctx)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}

func (u *ControllersPublisher) DeletePublisher(ctx *gin.Context) {

	id := ctx.Query("id")
	err := u.publisher.DeletePublisherById(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllersPublisher) GetPublisherByUserName(ctx *gin.Context) {

	name := ctx.Query("name")
	publishher, err := u.publisher.GetPubSherByUserName(ctx, name)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, publishher)
}

func (u *ControllersPublisher) UpdatePublisher(ctx *gin.Context) {

	file, err := ctx.FormFile("file")

	var req entities.PublisherReqUpdate
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
	err = u.publisher.UpdatePublicSherById(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, errors.NewCustomHttpError(500, 10, fmt.Sprintf("%s", err)))
		return
	}
	u.baseController.Success(ctx, nil)
}
