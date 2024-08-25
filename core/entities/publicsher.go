package entities

type Publisher struct {
	Name          string `form:"name"`           // Tên của nhà xuất bản
	Address       string `form:"address"`        // Địa chỉ của nhà xuất bản
	ContactNumber string `form:"contact_number"` // Số điện thoại liên hệ
	Website       string `form:"website"`        // Trang web của nhà xuất bản
}
