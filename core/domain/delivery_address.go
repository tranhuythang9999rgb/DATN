package domain

import "context"

type DeliveryAddress struct {
	ID          int64  `json:"id"`
	OrderID     int64  `json:"order_id"`
	Email       string `json:"email"`
	UserName    string `json:"user_name"`
	PhoneNumber string `json:"phone_number"`
	Province    string `json:"province"`
	District    string `json:"district"`
	Commune     string `json:"commune"`
	Detailed    string `json:"detailed"`
	Otp         int64  `json:"otp"`
}

type RepositoryDeliveryAddress interface {
	Create(ctx context.Context, req *DeliveryAddress) error
	UpdateEmailAndOtp(ctx context.Context, req *DeliveryAddress) error
	GetAddressByUserName(ctx context.Context, username string) (*DeliveryAddress, error)
}
