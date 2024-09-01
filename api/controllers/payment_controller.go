package controllers

import (
	"fmt"
	"net/http"
	"os"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllersPayment struct {
	pay *usecase.UseCasePayment
	*baseController
}

func NewControllersPayment(
	pay *usecase.UseCasePayment,
	baseController *baseController,
) *ControllersPayment {
	return &ControllersPayment{
		pay:            pay,
		baseController: baseController,
	}
}

func (u *ControllersPayment) CreatePayment(ctx *gin.Context) {
	var req entities.CheckoutRequestType
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, err)
		return
	}
	ctx.SetCookie("order_id", fmt.Sprint(req.OrderCode), 3600, "/", "localhost", false, true)
	req.ExpiredAt = utils.GenerateTimestampExpiredAt(15)
	resp, err := u.pay.CreatePayment(ctx, req)
	if err != nil {
		log.Error(err, "error server")
		u.baseController.ErrorData(ctx, errors.ErrSystem)
		return
	}
	u.baseController.Success(ctx, resp)
}
func (c *ControllersPayment) ReturnUrlAfterPayment(ctx *gin.Context) {
	path := "api/public/webhooks/create_payment.html"
	htmlBytes, err := os.ReadFile(path)
	if err != nil {
		// Xử lý lỗi nếu có
		ctx.String(http.StatusInternalServerError, "Lỗi khi đọc tệp HTML")
		return
	}

	// Trả về trang HTML
	ctx.Data(http.StatusOK, "text/html; charset=utf-8", htmlBytes)

}
func (c *ControllersPayment) ReturnUrlAftercanCelPayment(ctx *gin.Context) {
	path := "api/public/webhooks/cancel_payment.html"
	htmlBytes, err := os.ReadFile(path)
	if err != nil {
		// Xử lý lỗi nếu có
		ctx.String(http.StatusInternalServerError, "Lỗi khi đọc tệp HTML")
		return
	}

	// Trả về trang HTML
	ctx.Data(http.StatusOK, "text/html; charset=utf-8", htmlBytes)
}
