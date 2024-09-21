package entities

import "mime/multipart"

type User struct {
	Username    string                `form:"username"`
	Password    string                `form:"password"`
	Email       string                `form:"email"`
	FullName    string                `form:"full_name"`
	Address     string                `form:"address"`
	PhoneNumber string                `form:"phone_number"`
	File        *multipart.FileHeader `form:"file"`
}

type LoginRequest struct {
	Username string `form:"username"`
	Password string `form:"password"`
}
type LoginResp struct {
	UserName  string `json:"user_name"`
	Role      int    `json:"role"`
	Id        int64  `json:"id"`
	AddressId int64  `json:"address_id"`
}
type UserRespGetList struct {
	ID          int64  `json:"id"`
	Username    string `json:"username"`
	Email       string `json:"email"`
	FullName    string `json:"full_name"`
	Address     string `json:"address"`
	PhoneNumber string `json:"phone_number"`
	Avatar      string `json:"avatar"`
	Role        int    `json:"role"`
}

type UserProFile struct {
	ID            int64  `json:"id"`
	Username      string `json:"username"`
	Password      string `json:"password"`
	Email         string `json:"email"`
	FullName      string `json:"full_name"`
	Address       string `json:"address"`
	PhoneNumber   string `json:"phone_number"`
	Avatar        string `json:"avatar"`
	Role          int    `json:"role"`
	LoyaltyPoints int    `json:"loyalty_points"`
}
