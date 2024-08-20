package controllers

import (
	"net/http"
	"shoe_shop_server/api/request"
	"shoe_shop_server/common/enums"
	"shoe_shop_server/common/utils"

	"github.com/gin-gonic/gin"
)

func UploadImage(c *gin.Context) {

	file, err := c.FormFile("file")

	if err != nil {
		c.JSON(http.StatusOK, &request.InforFileResp{
			Result: request.Result{
				Code:    enums.ERROR_REQ_CODE,
				Message: enums.ERROR_REQ_MESS,
			},
		})
		return
	}

	resp, err := utils.SaveImage2(file)
	if err != nil {
		c.JSON(http.StatusOK, err)
		return
	}

	c.JSON(http.StatusOK, resp)
}
