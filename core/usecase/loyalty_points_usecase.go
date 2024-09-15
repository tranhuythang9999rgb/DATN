package usecase

import (
	"context"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
	"strconv"
)

type Loyalty_points_usecase struct {
	loy domain.RepositoryLoyaltyPoints
}

func NewLoyalty_points_usecase(file_lc domain.RepositoryLoyaltyPoints) *Loyalty_points_usecase {
	return &Loyalty_points_usecase{
		loy: file_lc,
	}
}

func (u *Loyalty_points_usecase) AddLoyaltyPointsUsecase(ctx context.Context, req *entities.LoyaltyPoints) errors.Error {
	err := u.loy.AddLoyaltyPoints(ctx, &domain.LoyaltyPoints{
		LoyaltyID:   utils.GenerateUniqueKey(),
		UserID:      req.UserID,
		Points:      req.Points,
		LastUpdated: utils.GenerateTimestamp(),
	})
	if err != nil {
		log.Error(err, "error")
		return errors.ErrSystem
	}
	return nil
}

func (u *Loyalty_points_usecase) GetLoyaltyPointsByUserid(ctx context.Context, userId string) (*domain.LoyaltyPoints, errors.Error) {
	log.Info(userId)
	userIdNumber, _ := strconv.ParseInt(userId, 10, 64)
	loy, err := u.loy.GetLoyaltyPointsByUserid(ctx, int64(userIdNumber))
	if err != nil {
		log.Error(err, "error")
		return nil, errors.ErrSystem
	}
	return loy, nil
}

func (u *Loyalty_points_usecase) GetListPoint(ctx context.Context) ([]*domain.LoyaltyPoints, errors.Error) {
	loys, err := u.loy.GetListPoint(ctx)
	if err != nil {
		log.Error(err, "error")
		return nil, errors.ErrSystem
	}
	return loys, nil
}
