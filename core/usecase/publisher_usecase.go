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
	respFile, err := utils.SetByCurlImage(ctx, req.File)
	if respFile.Result.Code != 0 || err != nil {
		return errors.ErrSystem
	}
	err = u.pbs.Create(ctx, &domain.Publisher{
		ID:            utils.GenerateUniqueKey(),
		Name:          req.Name,
		Address:       req.Address,
		ContactNumber: req.ContactNumber,
		Website:       req.Website,
		Avatar:        respFile.URL,
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

func (u *PublisherUseCase) DeletePublisherById(ctx context.Context, id string) errors.Error {
	numberId, _ := strconv.ParseInt(id, 10, 64)
	err := u.pbs.Delete(ctx, numberId)
	if err != nil {
		return errors.NewSystemError("error system")
	}
	return nil
}

func (u *PublisherUseCase) GetPubSherByUserName(ctx context.Context, userName string) (*domain.Publisher, errors.Error) {
	publ, err := u.pbs.GetName(ctx, userName)
	if err != nil {
		return nil, errors.NewSystemError("error system")
	}
	return publ, nil
}

func (u *PublisherUseCase) UpdatePublicSherById(ctx context.Context, req *entities.PublisherReqUpdate) errors.Error {

	err := u.pbs.Update(ctx, &domain.Publisher{
		ID:            req.ID,
		Name:          req.Name,
		Address:       req.Address,
		ContactNumber: req.ContactNumber,
		Website:       req.Website,
		IsActive:      true,
	})
	if err != nil {
		log.Error(err, "error")
		return errors.NewSystemError("error system")
	}
	return nil
}
