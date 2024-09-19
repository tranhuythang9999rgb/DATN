package controllers

import (
	"net/http"
	"os"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Body    interface{} `json:"body"`
}

func NewResponseResource(code int, message string, body interface{}) *Response {
	return &Response{
		Code:    code,
		Message: message,
		Body:    body,
	}
}

func NewResponseErr(err errors.Error) *Response {
	return &Response{
		Code:    err.GetCode(),
		Message: err.GetMessage(),
		Body:    nil,
	}
}

func (c *ControllersUploadBooks) ReturnPageBlog(ctx *gin.Context) {
	orderId := ctx.Query("order_id")
	log.Info(orderId)
	path := "api/public/chotFree/pride-and-prejudice/index.html"
	htmlBytes, err := os.ReadFile(path)
	if err != nil {
		// Xử lý lỗi nếu có
		ctx.String(http.StatusInternalServerError, "Lỗi khi đọc tệp HTML")
		return
	}

	// Trả về trang HTML
	ctx.Data(http.StatusOK, "text/html; charset=utf-8", htmlBytes)
}
