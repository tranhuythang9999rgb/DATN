package entities

type Cart struct {
	UserName string `form:"user_name"`
	BookID   int64  `form:"book_id"`
	Quantity int    `form:"quantity"`
}

type ListCart struct {
	Carts []*CartResp `json:"carts"`
	Count int         `json:"count"`
}
type CartResp struct {
	CartId      int64   `json:"cart_id"`
	BookId      int64   `json:"book_id"`
	BookName    string  `json:"book_name"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
	TotalAmount float64 `json:"total_amount"`
	Url         string  `json:"url"`
}
