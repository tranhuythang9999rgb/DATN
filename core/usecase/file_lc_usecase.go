package usecase

import (
	"context"
	"shoe_shop_server/common/enums"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
	"strconv"
)

type FileStoragesUseCase struct {
	file_lc domain.RepositoryFileStorages
	trans   domain.RepositoryTransaction
}

func NewFileStoragesUseCase(file_lc domain.RepositoryFileStorages, trans domain.RepositoryTransaction) *FileStoragesUseCase {
	return &FileStoragesUseCase{
		file_lc: file_lc,
		trans:   trans,
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

func (u *FileStoragesUseCase) DeleteFileById(ctx context.Context, id string) errors.Error {
	idNumber, _ := strconv.ParseInt(id, 10, 64)
	err := u.file_lc.DeleteFileByIdNotTransaction(ctx, idNumber)
	if err != nil {
		return errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	return nil
}

func (u *FileStoragesUseCase) UpSertFileDescript(ctx context.Context, req *entities.UpSertFileDescriptReq) errors.Error {

	tx, _ := u.trans.BeginTransaction(ctx)

	listFile, _ := utils.SetListFile(ctx, req.File)

	if len(listFile) > 0 {

		for _, v := range listFile {
			u.file_lc.AddInformationFileStorages(ctx, tx, &domain.FileStorages{
				ID:        utils.GenerateUniqueKey(),
				AnyId:     req.AnyId,
				URL:       v.URL,
				CreatedAt: int(utils.GenerateTimestamp()),
			})
		}
	}

	tx.Commit()
	return nil
}
