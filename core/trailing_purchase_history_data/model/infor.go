package model

type Book struct {
	ID       int
	Title    string
	Price    float64
	Quantity int
}

type Customer struct {
	ID     int
	Name   string
	Orders []Book
}
books := []Book{
    {ID: 1, Title: "Sách A", Price: 10.99, Quantity: 5},
    {ID: 2, Title: "Sách B", Price: 15.49, Quantity: 3},
    {ID: 3, Title: "Sách C", Price: 8.75, Quantity: 7},
    {ID: 4, Title: "Sách D", Price: 12.99, Quantity: 4},
}

customers := []Customer{
    {ID: 1, Name: "Khách hàng A", Orders: []Book{books[0], books[1], books[2]}},
    {ID: 2, Name: "Khách hàng B", Orders: []Book{books[1], books[3]}},
    {ID: 3, Name: "Khách hàng C", Orders: []Book{books[0], books[2], books[3]}},
    {ID: 4, Name: "Khách hàng D", Orders: []Book{books[0], books[1]}},
}