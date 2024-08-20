package controllers

import (
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

// func (lc *ControllerFileLc) UpSertFileDescriptByTicketId(ctx *gin.Context) {

// 	var req entities.UpSertFileDescriptReq

// 	if err := ctx.ShouldBind(&req); err != nil {
// 		ctx.JSON(http.StatusBadRequest, err)
// 		return
// 	}
// 	files, err := lc.baseController.GetUploadedFiles(ctx)
// 	if err != nil {
// 		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	req.File = files
// 	resp, err := lc.file.UploadFileByTicketId(ctx, &req)
// 	lc.baseController.Response(ctx, resp, err)
// }
// func (lc *ControllerFileLc) DeleteFileById(ctx *gin.Context) {
// 	id := ctx.Param("id")
// 	resp, err := lc.file.DeleteFileById(ctx, id)
// 	lc.baseController.Response(ctx, resp, err)
// }
