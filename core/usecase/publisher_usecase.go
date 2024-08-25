package usecase

import (
	"context"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
)

type PublisherUseCase struct {
	pbs domain.RepositoryPublisher
}

func NewPublisherUseCase(pbs domain.RepositoryPublisher) *PublisherUseCase {
	return &PublisherUseCase{
		pbs: pbs,
	}
}

func (u *PublisherUseCase) AddPublisher(ctx context.Context, req *entities.Publisher) errors.Error {
	pb, err := u.pbs.GetName(ctx, req.Name)
	if err != nil {
		return errors.NewSystemError("error system")
	}
	if pb != nil {
		return errors.NewCustomHttpError(200, 2, "type name exists")
	}
	err = u.pbs.Create(ctx, &domain.Publisher{
		ID:            utils.GenerateUniqueKey(),
		Name:          req.Name,
		Address:       req.Address,
		ContactNumber: req.ContactNumber,
		Website:       req.Website,
		IsActive:      true,
	})
	if err != nil {
		return errors.NewSystemError("error system")
	}
	return nil
}

func (u *PublisherUseCase) ListPublisher(ctx context.Context) ([]*domain.Publisher, errors.Error) {
	listPb, err := u.pbs.List(ctx)
	if err != nil {
		return nil, errors.NewSystemError("error system")
	}
	return listPb, nil
}
