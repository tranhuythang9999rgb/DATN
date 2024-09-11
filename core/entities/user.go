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
	UserName string `json:"user_name"`
	Role     int    `json:"role"`
	Id       int64  `json:"id"`
}
