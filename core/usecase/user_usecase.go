package usecase

import (
	"context"
	"shoe_shop_server/common/enums"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
)

type UserCaseUse struct {
	user    domain.RepositoryUser
	loy     domain.RepositoryLoyaltyPoints
	address domain.RepositoryDeliveryAddress
}

func NewUseCaseUse(user domain.RepositoryUser, loy domain.RepositoryLoyaltyPoints, address domain.RepositoryDeliveryAddress) *UserCaseUse {
	return &UserCaseUse{
		user:    user,
		loy:     loy,
		address: address,
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
		CreateTime:  int(utils.GenerateTimestamp()),
	}
	err = u.user.AddAcount(ctx, user)
	if err != nil {
		return errors.ErrSystem
	}
	return nil
}

func (u *UserCaseUse) Login(ctx context.Context, user_name, password string) (*entities.LoginResp, errors.Error) {
	idAddress := 0
	isCheck, userId, role, err := u.user.FindUserByUseName(ctx, user_name)
	if err != nil {
		return nil, errors.ErrSystem
	}
	if !isCheck {
		return nil, errors.NewCustomHttpError(200, enums.USER_NOT_EXIST_CODE, enums.USER_EXITS_CODE_MESS)
	}
	inforAddrsss, err := u.address.GetAddressByUserName(ctx, user_name)
	if err != nil {
		return nil, errors.ErrSystem
	}
	if inforAddrsss == nil {
		idAddress = 0
	} else {
		idAddress = int(inforAddrsss.ID)
	}
	return &entities.LoginResp{
		UserName:  user_name,
		Role:      role,
		Id:        userId,
		AddressId: int64(idAddress),
	}, nil
}

func (u *UserCaseUse) GetProFile(ctx context.Context, name string) (*entities.UserProFile, errors.Error) {
	user, err := u.user.GetProFile(ctx, name)
	if err != nil {
		return nil, errors.ErrSystem
	}
	point, _ := u.loy.GetLoyaltyPointsByUserid(ctx, user.ID)

	return &entities.UserProFile{
		ID:            user.ID,
		Username:      name,
		Email:         user.Email,
		FullName:      user.FullName,
		Address:       user.Address,
		PhoneNumber:   user.PhoneNumber,
		Avatar:        user.Avatar,
		Role:          user.Role,
		LoyaltyPoints: point.Points,
	}, nil
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
		CreateTime:  int(utils.GenerateTimestamp()),
	}
	err = u.user.AddAcount(ctx, user)
	if err != nil {
		return errors.ErrSystem
	}
	return nil
}

func (u *UserCaseUse) GetListAccount(ctx context.Context) ([]*entities.UserRespGetList, errors.Error) {
	var listUser = make([]*entities.UserRespGetList, 0)
	users, err := u.user.FindAccount(ctx, &domain.UserReqByForm{})
	if err != nil {
		log.Error(err, "error server")
		return nil, errors.ErrSystem
	}
	for _, v := range users {
		listUser = append(listUser, &entities.UserRespGetList{
			ID:          v.ID,
			Username:    v.Username,
			Email:       v.Email,
			FullName:    v.FullName,
			Address:     v.Address,
			PhoneNumber: v.PhoneNumber,
			Avatar:      v.Avatar,
			Role:        v.Role,
		})
	}
	return listUser, nil
}
