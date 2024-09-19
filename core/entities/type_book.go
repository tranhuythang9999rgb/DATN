package entities

type TypeBooks struct {
	Name string `form:"name"` // Tên của thể loại
}
type TypeBooksUpdate struct {
	ID   int64  `form:"id"`   // Mã định danh duy nhất cho thể loại
	Name string `form:"name"` // Tên của thể loại
}
