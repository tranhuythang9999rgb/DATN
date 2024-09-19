package entities

import "mime/multipart"

type Publisher struct {
	Name          string                `form:"name"`           // Tên của nhà xuất bản
	Address       string                `form:"address"`        // Địa chỉ của nhà xuất bản
	ContactNumber string                `form:"contact_number"` // Số điện thoại liên hệ
	Website       string                `form:"website"`        // Trang web của nhà xuất bản
	File          *multipart.FileHeader `form:"file"`
}

type PublisherReqUpdate struct {
	ID            int64                 `form:"id"`             // Mã định danh duy nhất cho nhà xuất bản
	Name          string                `form:"name"`           // Tên của nhà xuất bản
	Address       string                `form:"address"`        // Địa chỉ của nhà xuất bản
	ContactNumber string                `form:"contact_number"` // Số điện thoại liên hệ
	Website       string                `form:"website"`        // Trang web của nhà xuất bản
	File          *multipart.FileHeader `form:"file"`
}
