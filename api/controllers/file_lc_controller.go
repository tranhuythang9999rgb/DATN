package controllers

import (
	"net/http"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllerFileLc struct {
	file *usecase.FileStoragesUseCase
	*baseController
}

func NewControllerFileLc(
	file *usecase.FileStoragesUseCase,
	baseController *baseController,
) *ControllerFileLc {
	return &ControllerFileLc{
		file:           file,
		baseController: baseController,
	}
}
func (u *ControllerFileLc) GetListFileById(ctx *gin.Context) {

	id := ctx.Query("id")

	resp, err := u.file.GetListFileById(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)

}

func (u *ControllerFileLc) UpSertFileDescriptByAnyId(ctx *gin.Context) {

	var req entities.UpSertFileDescriptReq

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, err)
		return
	}
	files, err := u.baseController.GetUploadedFiles(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.File = files
	if err := u.file.UpSertFileDescript(ctx, &req); err != nil {
		u.baseController.ErrorData(ctx, err)

	}
	u.baseController.Success(ctx, nil)
}
func (u *ControllerFileLc) DeleteFileById(ctx *gin.Context) {
	id := ctx.Query("id")
	err := u.file.DeleteFileById(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}
