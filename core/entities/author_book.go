package entities

import "mime/multipart"

type Author struct {
	Name        string                `form:"name"`        // Tên của tác giả
	Biography   string                `form:"biography"`   // Tiểu sử ngắn của tác giả
	BirthDate   string                `form:"birth_date"`  // Ngày sinh của tác giả
	Nationality string                `form:"nationality"` // Quốc tịch của tác giả
	File        *multipart.FileHeader `form:"file"`
}
