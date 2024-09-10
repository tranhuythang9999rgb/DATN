package domain

import "context"

// Publisher đại diện cho một nhà xuất bản trong hệ thống
type Publisher struct {
	ID            int64  `json:"id"`             // Mã định danh duy nhất cho nhà xuất bản
	Name          string `json:"name"`           // Tên của nhà xuất bản
	Address       string `json:"address"`        // Địa chỉ của nhà xuất bản
	ContactNumber string `json:"contact_number"` // Số điện thoại liên hệ
	Website       string `json:"website"`        // Trang web của nhà xuất bản
	IsActive      bool   `json:"is_active"`
	Avatar        string `json:"avatar"`
}

// RepositoryPublisher định nghĩa các phương thức cho các thao tác trên bảng publishers
type RepositoryPublisher interface {
	// Create thêm một nhà xuất bản mới vào cơ sở dữ liệu
	Create(ctx context.Context, publisher *Publisher) error

	// Delete thay đổi trạng thái is_active của nhà xuất bản thành false
	Delete(ctx context.Context, id int64) error

	// GetByID lấy thông tin một nhà xuất bản dựa trên ID và trạng thái is_active = true
	GetByID(ctx context.Context, id int64) (*Publisher, error)

	// List lấy danh sách các nhà xuất bản với trạng thái is_active = true, có thể phân trang
	List(ctx context.Context) ([]*Publisher, error)

	// Update cập nhật thông tin của một nhà xuất bản
	Update(ctx context.Context, publisher *Publisher) error
	//
	GetName(ctx context.Context, name string) (*Publisher, error)
}
