package usecase

import (
	"context"
	"math"
	"shoe_shop_server/common/enums"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
	"strconv"
)

type UploadBookUseCase struct {
	fie_lc domain.RepositoryFileStorages
	books  domain.RepositoryBook
	trans  domain.RepositoryTransaction
}

func NewUploadBookUseCase(
	fie_lc domain.RepositoryFileStorages,
	books domain.RepositoryBook,
	trans domain.RepositoryTransaction,

) *UploadBookUseCase {
	return &UploadBookUseCase{
		fie_lc: fie_lc,
		books:  books,
		trans:  trans,
	}
}
func (u *UploadBookUseCase) AddBook(ctx context.Context, req *entities.Book) errors.Error {
	tx, _ := u.trans.BeginTransaction(ctx)
	book_id := utils.GenerateUniqueKey()
	listFile, _ := utils.SetListFile(ctx, req.File)
	bookModel := domain.Book{
		ID:            book_id,
		Title:         req.Title,
		AuthorName:    req.AuthorName,
		Publisher:     req.Publisher,
		PublishedDate: req.PublishedDate,
		ISBN:          req.ISBN,
		Genre:         req.Genre,
		Description:   req.Description,
		Language:      req.Language,
		PageCount:     req.PageCount,
		Dimensions:    req.Dimensions,
		Weight:        req.Weight,
		Price:         req.Price,
		DiscountPrice: req.DiscountPrice,
		// PurchasePrice: req.PurchasePrice,
		Stock:         req.Stock,
		Notes:         req.Notes,
		IsActive:      true,
		OpeningStatus: req.OpeningStatus,
	}
	err := u.books.Create(ctx, tx, &bookModel)
	if err != nil {
		return errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	for _, v := range listFile {
		u.fie_lc.AddInformationFileStorages(ctx, tx, &domain.FileStorages{
			ID:        utils.GenerateUniqueKey(),
			AnyId:     book_id,
			URL:       v.URL,
			CreatedAt: 0,
		})
	}

	tx.Commit()
	return nil
}

func (u *UploadBookUseCase) GetListBook(ctx context.Context, req *entities.BookReqForm) ([]*domain.Book, errors.Error) {

	limit := 0
	offset := 0
	if req.Limit == 0 || req.Offset == 0 {
		limit = math.MaxInt64
		offset = 0
	}

	listBooks, err := u.books.List(ctx, &domain.BookReqForm{
		ID:            req.ID,
		Title:         req.Title,
		AuthorName:    req.AuthorName,
		Publisher:     req.Publisher,
		PublishedDate: req.PublishedDate,
		ISBN:          req.Genre,
		Genre:         req.Genre,
		Description:   req.Description,
		Language:      req.Language,
		PageCount:     req.PageCount,
		Dimensions:    req.Dimensions,
		Weight:        req.Weight,
		Price:         req.Price,
		DiscountPrice: req.DiscountPrice,
		PurchasePrice: req.PurchasePrice,
		Notes:         req.Notes,
		IsActive:      true,
		OpeningStatus: req.OpeningStatus,
	}, limit, offset)
	if err != nil {
		return nil, errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	return listBooks, nil
}

func (u *UploadBookUseCase) DeleteBookById(ctx context.Context, id string) errors.Error {
	idNumber, _ := strconv.ParseInt(id, 10, 64)
	err := u.books.Delete(ctx, idNumber)
	if err != nil {
		return errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	return nil
}

func (u *UploadBookUseCase) GetBookById(ctx context.Context, id string) (*domain.Book, errors.Error) {
	idNumber, _ := strconv.ParseInt(id, 10, 64)
	book, err := u.books.GetBookById(ctx, idNumber)
	if err != nil {
		return nil, errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	return book, nil
}

func (u *UploadBookUseCase) UpdateBookById(ctx context.Context, req *entities.BookReqUpdate) errors.Error {
	err := u.books.Update(ctx, &domain.Book{
		ID:            req.ID,
		Title:         req.Title,
		AuthorName:    req.AuthorName,
		Publisher:     req.Publisher,
		PublishedDate: req.PublishedDate,
		ISBN:          req.ISBN,
		Genre:         req.Genre,
		Description:   req.Description,
		Language:      req.Language,
		PageCount:     req.PageCount,
		Dimensions:    req.Dimensions,
		Weight:        req.Weight,
		Price:         req.Price,
		DiscountPrice: req.DiscountPrice,
		// PurchasePrice: req.PurchasePrice,
		Stock:         req.Stock,
		Notes:         req.Notes,
		IsActive:      true,
		OpeningStatus: req.OpeningStatus,
	})
	log.Infof("req : ", req)
	if err != nil {
		return errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	return nil
}
