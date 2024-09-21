package domain

import "context"

type DeliveryAddress struct {
	ID             int64  `json:"id"`
	OrderID        int64  `json:"order_idm,omitempty"`
	Email          string `json:"email"`
	UserName       string `json:"user_name"`
	PhoneNumber    string `json:"phone_number"`
	Province       string `json:"province"`
	District       string `json:"district"`
	Commune        string `json:"commune"`
	Detailed       string `json:"detailed"`
	Otp            int64  `json:"otp,omitempty"`
	DefaultAddress int    `json:"default_address,omitempty"`
	NickName       string `json:"nick_name"`
}

type RepositoryDeliveryAddress interface {
	Create(ctx context.Context, req *DeliveryAddress) error
	UpdateEmailAndOtp(ctx context.Context, req *DeliveryAddress) error
	GetAddressByUserName(ctx context.Context, username string) (*DeliveryAddress, error)
	GetListAddressByUserName(ctx context.Context, username string) ([]*DeliveryAddress, error)
	UpdateStatusAddressById(ctx context.Context, id int64, userName string) error
	DeleteAddressById(ctx context.Context, id int64) error
}
