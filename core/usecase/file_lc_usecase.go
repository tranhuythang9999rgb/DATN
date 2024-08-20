package usecase

import (
	"context"
	"shoe_shop_server/common/enums"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/core/domain"
	"strconv"
)

type FileStoragesUseCase struct {
	file_lc domain.RepositoryFileStorages
}

func NewFileStoragesUseCase(file_lc domain.RepositoryFileStorages) *FileStoragesUseCase {
	return &FileStoragesUseCase{
		file_lc: file_lc,
	}
}
func (u *FileStoragesUseCase) GetListFileById(ctx context.Context, id string) ([]*domain.FileStorages, errors.Error) {
	idNumber, _ := strconv.ParseInt(id, 10, 64)
	files, err := u.file_lc.GetListFileById(ctx, idNumber)
	if err != nil {
		return nil, errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	return files, nil
}
