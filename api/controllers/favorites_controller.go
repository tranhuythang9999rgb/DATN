package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"shoe_shop_server/core/entities"
	"shoe_shop_server/core/usecase"
)

type ControllerFavorites struct {
	favorites *usecase.FavoritesUseCase
	*baseController
}

func NewFavoritesController(
	favorites *usecase.FavoritesUseCase, base *baseController) *ControllerFavorites {
	return &ControllerFavorites{
		favorites:      favorites,
		baseController: base,
	}
}

func (u *ControllerFavorites) AddFavorites(ctx *gin.Context) {
	var req entities.Favorites
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := u.favorites.UpsertFavorites(ctx, &req)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerFavorites) RemoveFavorites(ctx *gin.Context) {
	id := ctx.Query("id")
	err := u.favorites.DeleteLikeByBookId(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, nil)
}

func (u *ControllerFavorites) GetFavorites(ctx *gin.Context) {
	id := ctx.Query("id")
	resp, err := u.favorites.FindFavoritesByUserId(ctx, id)
	if err != nil {
		u.baseController.ErrorData(ctx, err)
		return
	}
	u.baseController.Success(ctx, resp)
}
