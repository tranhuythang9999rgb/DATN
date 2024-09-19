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
	order *usecase.UseCaseOrder
}

func NewControllersPayment(
	pay *usecase.UseCasePayment,
	baseController *baseController,
	order *usecase.UseCaseOrder,
) *ControllersPayment {
	return &ControllersPayment{
		pay:            pay,
		baseController: baseController,
		order:          order,
	}
}

func (u *ControllersPayment) CreatePayment(ctx *gin.Context) {

	orderId := ctx.Query("id")
	order, _ := u.order.GetOrderById(ctx, orderId)

	description := "Xin Cam on"
	cancelUrl := "http://localhost:8080/manager/payment/return/calcel/payment"
	returnUrl := "http://127.0.0.1:8080/manager/payment/return/create/payment"

	ctx.SetCookie("order_id", orderId, 3600, "/", "127.0.0.1", false, true)
	resp, err := u.pay.CreatePayment(ctx, entities.CheckoutRequestType{
		OrderCode:   order.ID,
		Amount:      order.TotalAmount,
		Description: description,
		CancelUrl:   cancelUrl,
		ReturnUrl:   returnUrl,
		ExpiredAt:   utils.GenerateTimestampExpiredAt(15), //Thời gian tồn tại của QR code
		OrderId:     order.ID,
	})
	if err != nil {
		log.Error(err, "error server")
		u.baseController.ErrorData(ctx, errors.ErrSystem)
		return
	}
	u.baseController.Success(ctx, resp)
}

func (c *ControllersPayment) ReturnUrlAfterPayment(ctx *gin.Context) {
	path := "api/public/webhooks/success_payment.html"
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
	orderId := ctx.Query("order_id")
	log.Info(orderId)
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

//api/public/chotFree Website Template - Free-CSS.com/pride-and-prejudice/index.html

// {
//     "code": 0,
//     "message": "success",
//     "body": {
//         "bin": "970422",
//         "accountNumber": "VQRQ00031obce",
//         "accountName": "TRAN HUY THANG",
//         "amount": 12000,
//         "description": "Movie Ticket",
//         "orderCode": 1234567891,
//         "currency": "VND",
//         "paymentLinkId": "7f5674ff56264594bffd0cd076b43362",
//         "status": "PENDING",
//         "checkoutUrl": "https://pay.payos.vn/web/7f5674ff56264594bffd0cd076b43362",
//         "qrCode": "00020101021238570010A000000727012700069704220113VQRQ00031obce0208QRIBFTTA53037045405120005802VN62160812Movie Ticket63048FE8",
//         "resp_order": null
//     }
// }

func (u *ControllersPayment) CreatePaymentWhenCart(ctx *gin.Context) {

	var req entities.OrderRequestSubmitBuyFromCart

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, err)
		return
	}
	orderId, amount, _ := u.order.CreateOrderWhenBuyCart(ctx, &req)
	description := "Xin Cam on"
	cancelUrl := "http://localhost:8080/manager/payment/return/calcel/payment"
	returnUrl := "http://127.0.0.1:8080/manager/payment/return/create/payment"

	ctx.SetCookie("order_id", fmt.Sprint(orderId), 3600, "/", "127.0.0.1", false, true)
	resp, err := u.pay.CreatePayment(ctx, entities.CheckoutRequestType{
		OrderCode:   orderId,
		Amount:      amount,
		Description: description,
		CancelUrl:   cancelUrl,
		ReturnUrl:   returnUrl,
		ExpiredAt:   utils.GenerateTimestampExpiredAt(15), //Thời gian tồn tại của QR code
		OrderId:     orderId,
	})
	log.Infof("resp payment", resp)
	if err != nil {
		log.Error(err, "error server")
		u.baseController.ErrorData(ctx, errors.ErrSystem)
		return
	}
	u.baseController.Success(ctx, resp)
}
