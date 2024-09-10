package repository

import (
	"context"
	"shoe_shop_server/common/enums"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionDeliveryAddress struct {
	db *gorm.DB
}

func NewCollectionDeliveryAddress(db *adapter.PostGresql) domain.RepositoryDeliveryAddress {
	return &CollectionDeliveryAddress{
		db: db.CreateCollection(),
	}
}

// Create implements domain.RepositoryDeliveryAddress.
func (c *CollectionDeliveryAddress) Create(ctx context.Context, req *domain.DeliveryAddress) error {
	result := c.db.Create(&req)
	return result.Error
}

// UpdateEmailAndOtp implements domain.RepositoryDeliveryAddress.
func (c *CollectionDeliveryAddress) UpdateEmailAndOtp(ctx context.Context, req *domain.DeliveryAddress) error {
	result := c.db.Where("email = ? otp = ? ", req.Email, req.Otp).UpdateColumns(&req)
	return result.Error
}

func (c *CollectionDeliveryAddress) GetAddressByUserName(ctx context.Context, username string) (*domain.DeliveryAddress, error) {
	var address *domain.DeliveryAddress
	result := c.db.Where("user_name = ? and default_address = ?", username, enums.ADDRESS_STATUS_DEFAULT).First(&address)
	if result.Error == gorm.ErrRecordNotFound {
		return nil, nil
	}
	return address, result.Error
}

func (c *CollectionDeliveryAddress) GetListAddressByUserName(ctx context.Context, username string) ([]*domain.DeliveryAddress, error) {
	var address []*domain.DeliveryAddress
	result := c.db.Where("user_name = ?", username).Find(&address)
	return address, result.Error
}
func (c *CollectionDeliveryAddress) UpdateStatusAddressById(ctx context.Context, id int64, userName string) error {
	// Transaction để đảm bảo tính toàn vẹn của dữ liệu
	tx := c.db.Begin()

	if tx.Error != nil {
		return tx.Error
	}

	// Cập nhật địa chỉ cụ thể thành địa chỉ mặc định
	if err := tx.Model(&domain.DeliveryAddress{}).
		Where("id = ? AND user_name = ?", id, userName).
		Update("default_address", enums.ADDRESS_STATUS_DEFAULT).
		Error; err != nil {
		tx.Rollback()
		return err
	}

	// Đặt tất cả các địa chỉ khác thành địa chỉ không mặc định
	if err := tx.Model(&domain.DeliveryAddress{}).
		Where("user_name = ? AND id != ?", userName, id).
		Update("default_address", 0).
		Error; err != nil {
		tx.Rollback()
		return err
	}

	// Commit transaction nếu không có lỗi
	return tx.Commit().Error
}

func (c *CollectionDeliveryAddress) DeleteAddressById(ctx context.Context, id int64) error {
	result := c.db.Model(&domain.DeliveryAddress{}).Where("id  = ? ", id).Delete(&domain.DeliveryAddress{})
	return result.Error
}
