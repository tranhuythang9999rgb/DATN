package controllers

import (
	"net/http"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllersUser struct {
	user *usecase.UserCaseUse
	*baseController
}

func NewControllersUser(
	user *usecase.UserCaseUse,
	baseController *baseController,
) *ControllersUser {
	return &ControllersUser{
		user:           user,
		baseController: baseController,
	}
}
func (u *ControllersUser) AddUser(ctx *gin.Context) {
	file, err := ctx.FormFile("file")

	var req entities.User
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

	if err := u.user.AddAcount(ctx, &req); err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}

	u.baseController.Success(ctx, nil)
}

func (u *ControllersUser) Login(ctx *gin.Context) {
	var req entities.LoginRequest
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := u.user.Login(ctx, req.Username, req.Password)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}
