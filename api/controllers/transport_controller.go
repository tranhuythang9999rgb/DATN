package controllers

import (
	"net/http"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllerTransport struct {
	transport *usecase.TransPortUserCase
	*baseController
}

func NewControllerTransport(transport *usecase.TransPortUserCase, base *baseController) *ControllerTransport {
	return &ControllerTransport{
		transport:      transport,
		baseController: base,
	}
}

func (u *ControllerTransport) ExportData(ctx *gin.Context) {
	var req entities.DataContent
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := u.transport.GetInforMationForChatBot(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}
