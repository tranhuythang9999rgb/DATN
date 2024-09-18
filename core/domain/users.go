package domain

import "context"

type User struct {
	ID          int64  `json:"id"`
	Username    string `json:"username"`
	Password    string `json:"password"`
	Email       string `json:"email"`
	FullName    string `json:"full_name"`
	Address     string `json:"address"`
	PhoneNumber string `json:"phone_number"`
	Avatar      string `json:"avatar"`
	Role        int    `json:"role"`
	CreateTime  int    `json:"create_time"`
}

type UserReqByForm struct {
	ID          int64  `form:"id"`
	Username    string `form:"username"`
	Password    string `form:"password"`
	Email       string `form:"email"`
	FullName    string `form:"full_name"`
	Address     string `form:"address"`
	PhoneNumber string `form:"phone_number"`
	Avatar      string `form:"avatar"`
}

type RepositoryUser interface {
	AddAcount(ctx context.Context, req *User) error
	UpdateAccountById(ctx context.Context, req *User) error
	FindAccount(ctx context.Context, req *UserReqByForm) ([]*User, error)
	FindUserByUseName(ctx context.Context, name string) (bool, int64, int, error)
	FindUserByEmail(ctx context.Context, email string) (bool, int, error)
	GetProFile(ctx context.Context, name string) (*User, error)
	GetNewUsersInMonth() ([]*User, error)
}
