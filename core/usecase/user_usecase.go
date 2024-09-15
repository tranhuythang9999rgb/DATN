package usecase

import (
	"context"
	"shoe_shop_server/common/enums"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
)

type UserCaseUse struct {
	user domain.RepositoryUser
}

func NewUseCaseUse(user domain.RepositoryUser) *UserCaseUse {
	return &UserCaseUse{
		user: user,
	}
}
func (u *UserCaseUse) AddAcount(ctx context.Context, req *entities.User) errors.Error {
	isCheck, _, _, err := u.user.FindUserByUseName(ctx, req.Username)
	if err != nil {
		return errors.ErrSystem
	}
	if isCheck {
		return errors.ErrConflict
	}
	isCheckEmail, _, err := u.user.FindUserByEmail(ctx, req.Email)
	if err != nil {
		return errors.ErrSystem
	}
	if isCheckEmail {
		return errors.ErrConflict
	}
	respFile, err := utils.SetByCurlImage(ctx, req.File)
	if respFile.Result.Code != 0 || err != nil {
		return errors.ErrSystem
	}
	user := &domain.User{
		ID:          utils.GenerateUniqueKey(),
		Username:    req.Username,
		Password:    req.Password,
		Email:       req.Email,
		FullName:    req.FullName,
		Address:     req.Address,
		PhoneNumber: req.PhoneNumber,
		Avatar:      respFile.URL,
		Role:        enums.ROLE_CUSTOMER,
	}
	err = u.user.AddAcount(ctx, user)
	if err != nil {
		return errors.ErrSystem
	}
	return nil
}

func (u *UserCaseUse) Login(ctx context.Context, user_name, password string) (*entities.LoginResp, errors.Error) {

	isCheck, userId, role, err := u.user.FindUserByUseName(ctx, user_name)
	if err != nil {
		return nil, errors.ErrSystem
	}
	if !isCheck {
		return nil, errors.NewCustomHttpError(200, enums.USER_NOT_EXIST_CODE, enums.USER_EXITS_CODE_MESS)
	}
	return &entities.LoginResp{
		UserName: user_name,
		Role:     role,
		Id:       userId,
	}, nil
}

func (u *UserCaseUse) GetProFile(ctx context.Context, name string) (*domain.User, errors.Error) {
	user, err := u.user.GetProFile(ctx, name)
	if err != nil {
		return nil, errors.ErrSystem
	}
	return user, nil
}

func (u *UserCaseUse) AddAcountAdmin(ctx context.Context, req *entities.User) errors.Error {
	isCheck, _, _, err := u.user.FindUserByUseName(ctx, req.Username)
	if err != nil {
		return errors.ErrSystem
	}
	if isCheck {
		return errors.ErrConflict
	}
	isCheckEmail, _, err := u.user.FindUserByEmail(ctx, req.Email)
	if err != nil {
		return errors.ErrSystem
	}
	if isCheckEmail {
		return errors.ErrConflict
	}
	respFile, err := utils.SetByCurlImage(ctx, req.File)
	if respFile.Result.Code != 0 || err != nil {
		return errors.ErrSystem
	}
	user := &domain.User{
		ID:          utils.GenerateUniqueKey(),
		Username:    req.Username,
		Password:    req.Password,
		Email:       req.Email,
		FullName:    req.FullName,
		Address:     req.Address,
		PhoneNumber: req.PhoneNumber,
		Avatar:      respFile.URL,
		Role:        enums.ROLE_ADMIN,
	}
	err = u.user.AddAcount(ctx, user)
	if err != nil {
		return errors.ErrSystem
	}
	return nil
}
