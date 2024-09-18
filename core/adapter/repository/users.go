package repository

import (
	"context"
	"errors"
	"shoe_shop_server/common/enums"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/configs"
	"shoe_shop_server/core/domain"
	"time"

	"gorm.io/gorm"
)

type CollectionUser struct {
	us *gorm.DB
}

func NewConllectionUser(cf *configs.Configs, user *adapter.PostGresql) domain.RepositoryUser {
	return &CollectionUser{
		us: user.CreateCollection(),
	}
}

// AddAcount implements domain.RepositoryUser.
func (c *CollectionUser) AddAcount(ctx context.Context, req *domain.User) error {
	result := c.us.Create(&req)
	return result.Error
}

// FindAccount implements domain.RepositoryUser.
func (c *CollectionUser) FindAccount(ctx context.Context, req *domain.UserReqByForm) ([]*domain.User, error) {
	listuser := make([]*domain.User, 0)
	result := c.us.Where(&domain.User{
		ID:          req.ID,
		Username:    req.Username,
		Password:    req.Password,
		Email:       req.Email,
		FullName:    req.FullName,
		Address:     req.Address,
		PhoneNumber: req.PhoneNumber,
		Avatar:      req.Avatar,
		Role:        enums.ROLE_CUSTOMER,
	}).Find(&listuser)
	return listuser, result.Error
}

// UpdateAccountById implements domain.RepositoryUser.
func (c *CollectionUser) UpdateAccountById(ctx context.Context, req *domain.User) error {
	result := c.us.Where("id  = ?", req.ID).Updates(&req)
	return result.Error
}

func (c *CollectionUser) FindUserByUseName(ctx context.Context, name string) (bool, int64, int, error) {
	var isCheck bool

	var user domain.User

	err := c.us.Where("username = ?", name).First(&user).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			isCheck = false
		} else {
			return false, 0, 0, err
		}
	} else {
		isCheck = true
	}

	return isCheck, user.ID, user.Role, nil
}
func (c *CollectionUser) FindUserByEmail(ctx context.Context, email string) (bool, int, error) {
	var isCheck bool

	var user domain.User

	err := c.us.Where("email = ?", email).First(&user).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			isCheck = false
		} else {
			return false, 0, err
		}
	} else {
		isCheck = true
	}

	return isCheck, user.Role, nil
}
func (c *CollectionUser) GetProFile(ctx context.Context, name string) (*domain.User, error) {
	var user *domain.User
	result := c.us.Where("username = ?", name).First(&user)
	return user, result.Error
}

func (u *CollectionUser) GetNewUsersInMonth() ([]*domain.User, error) {
	timeNow := time.Now()

	startOfMonth := time.Date(timeNow.Year(), timeNow.Month(), 1, 0, 0, 0, 0, time.UTC)
	endOfMonth := startOfMonth.AddDate(0, 1, 0).Add(-time.Nanosecond)

	var listUser []*domain.User

	result := u.us.Where("create_time BETWEEN ? AND ?", startOfMonth.Unix(), endOfMonth.Unix()).Find(&listUser)

	if result.Error != nil {
		return nil, result.Error
	}

	return listUser, nil
}
