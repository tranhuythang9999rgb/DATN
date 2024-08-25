package controllers

import (
	"net/http"
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
	var req entities.Publisher
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.publisher.AddPublisher(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
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
