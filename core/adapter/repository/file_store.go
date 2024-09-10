package repository

import (
	"context"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"gorm.io/gorm"
)

type CollectionFileStore struct {
	fs *gorm.DB
}

func NewConllectionFileStore(fileStore *adapter.PostGresql) domain.RepositoryFileStorages {
	return &CollectionFileStore{
		fs: fileStore.CreateCollection(),
	}
}

func (c *CollectionFileStore) AddInformationFileStorages(ctx context.Context, tx *gorm.DB, req *domain.FileStorages) error {
	result := tx.Create(&req)
	return result.Error
}
func (c *CollectionFileStore) DeleteFileById(ctx context.Context, tx *gorm.DB, id int64) error {
	result := tx.Where("id=?", id).Delete(&domain.FileStorages{}) //
	return result.Error
}
func (c *CollectionFileStore) GetListFileById(ctx context.Context, id int64) ([]*domain.FileStorages, error) {
	var files []*domain.FileStorages
	result := c.fs.Where("any_id = ?", id).Find(&files)
	return files, result.Error
}
func (c *CollectionFileStore) GetAll(ctx context.Context) ([]*domain.FileStorages, error) {
	var files []*domain.FileStorages
	result := c.fs.Find(&files)
	return files, result.Error
}
func (c *CollectionFileStore) DeleteFileByAnyIdObject(ctx context.Context, tx *gorm.DB, anyId int64) error {
	result := tx.Where("any_id = ?", anyId).Delete(&domain.FileStorages{}) //
	return result.Error
}

func (c *CollectionFileStore) AddListInformationFileStorages(ctx context.Context, tx *gorm.DB, req []*domain.FileStorages) error {
	result := tx.Create(req)
	return result.Error
}
func (c *CollectionFileStore) DeleteFileByIdNotTransaction(ctx context.Context, fileId int64) error {
	result := c.fs.Where("id = ?", fileId).Delete(&domain.FileStorages{}) //
	return result.Error
}

func (c *CollectionFileStore) GetFileByObjectId(ctx context.Context, objectId int64) (*domain.FileStorages, error) {
	var files *domain.FileStorages
	result := c.fs.Where("any_id = ? ", objectId).First(&files)
	if result.Error == gorm.ErrRecordNotFound {
		return nil, nil
	}
	return files, result.Error
}
