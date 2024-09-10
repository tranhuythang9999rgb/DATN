package entities

type DeliveryAddress struct {
	OrderID     int64  `form:"order_id"`
	Email       string `form:"email"`
	UserName    string `form:"user_name"`
	PhoneNumber string `form:"phone_number"`
	Province    string `form:"province"`
	District    string `form:"district"`
	Commune     string `form:"commune"`
	Detailed    string `form:"detailed"`
	NickName    string `form:"nick_name"`
}

type DeliveryAddressUpdateProFile struct {
	UserName    string `form:"user_name"`
	PhoneNumber string `form:"phone_number"`
	Province    string `form:"province"`
	District    string `form:"district"`
	Commune     string `form:"commune"`
	Detailed    string `form:"detailed"`
	NickName    string `form:"nick_name"`
}
