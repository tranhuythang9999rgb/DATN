package controllers

import (
	"net/http"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"

	"github.com/gin-gonic/gin"
)

type ControllerLoyPoint struct {
	loy *usecase.Loyalty_points_usecase
	*baseController
}

func NewControllerLoyPoint(
	loy *usecase.Loyalty_points_usecase,
	baseController *baseController,
) *ControllerLoyPoint {
	return &ControllerLoyPoint{
		loy:            loy,
		baseController: baseController,
	}
}

func (u *ControllerLoyPoint) AddLoyPoint(ctx *gin.Context) {
	var req entities.LoyaltyPoints
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.loy.AddLoyaltyPointsUsecase(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerLoyPoint) GetLoyaltyPointsByUserid(ctx *gin.Context) {
	userId := ctx.Query("user_id")
	resp, err := u.loy.GetLoyaltyPointsByUserid(ctx, userId)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}

func (u *ControllerLoyPoint) GetListPoint(ctx *gin.Context) {
	resp, err := u.loy.GetListPoint(ctx)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}
