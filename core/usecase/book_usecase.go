package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"shoe_shop_server/common/enums"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"
	"shoe_shop_server/common/utils"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
	"sort"
	"strconv"
)

type UploadBookUseCase struct {
	fie_lc domain.RepositoryFileStorages
	books  domain.RepositoryBook
	trans  domain.RepositoryTransaction
	order  domain.RepositoryOrder
}

func NewUploadBookUseCase(
	fie_lc domain.RepositoryFileStorages,
	books domain.RepositoryBook,
	trans domain.RepositoryTransaction,
	order domain.RepositoryOrder,

) *UploadBookUseCase {
	return &UploadBookUseCase{
		fie_lc: fie_lc,
		books:  books,
		trans:  trans,
		order:  order,
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
		Quantity:       req.Quantity,
		Notes:          req.Notes,
		IsActive:       true,
		OpeningStatus:  req.OpeningStatus,
		QuantityOrigin: req.Quantity,
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
		Quantity:      req.Quantity,
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
func (u *UploadBookUseCase) GetListBookSellWell(ctx context.Context) (*entities.BookSellWells, errors.Error) {

	var booksResp = make([]*entities.BookRespSellWell, 0)
	books, err := u.books.GetListBookSellWell(ctx)
	if err != nil {
		return nil, errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	for _, v := range books {
		var fileURL string
		listFile, _ := u.fie_lc.GetListFileById(ctx, v.ID)

		if listFile != nil && len(listFile) > 0 {
			// Nếu listFile có giá trị và không rỗng, gán URL của file đầu tiên
			fileURL = listFile[0].URL
		} else {
			// Nếu listFile là nil hoặc rỗng, gán URL là chuỗi rỗng
			fileURL = ""
		}
		if v.IsActive {
			booksResp = append(booksResp, &entities.BookRespSellWell{
				ID:            v.ID,
				Title:         v.Title,
				AuthorName:    v.AuthorName,
				Publisher:     v.Publisher,
				PublishedDate: v.PublishedDate,
				ISBN:          v.ISBN,
				Genre:         v.Genre,
				Description:   v.Description,
				Language:      v.Language,
				PageCount:     v.PageCount,
				Dimensions:    v.Dimensions,
				Weight:        v.Weight,
				Price:         v.Price,
				DiscountPrice: v.DiscountPrice,
				Quantity:      v.Quantity,
				Notes:         v.Notes,
				IsActive:      v.IsActive,
				OpeningStatus: v.OpeningStatus,
				FileDescFirst: fileURL,
			})
		}

	}
	return &entities.BookSellWells{
		Books: booksResp,
	}, nil
}

func (u *UploadBookUseCase) GetdetailBookByid(ctx context.Context, id string) (*entities.BookRespDetail, errors.Error) {
	id_number, _ := strconv.ParseInt(id, 10, 64)
	var listUrl = make([]string, 0)
	book, err := u.books.GetBookById(ctx, id_number)
	if err != nil {
		return nil, errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	listImage, err := u.fie_lc.GetListFileById(ctx, book.ID)
	if err != nil {
		return nil, errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	for _, v := range listImage {
		var jsonData map[string]interface{}
		if err := json.Unmarshal([]byte(v.URL), &jsonData); err == nil {
			if url, ok := jsonData["t"].(string); ok {
				// Assuming 'e' is the length of the URL in characters
				if e, ok := jsonData["lk"].([]interface{}); ok && len(e) > 0 {
					if lenUrl, ok := e[0].(map[string]interface{})["e"].(float64); ok {
						// Ensure URL length matches
						if len(url) == int(lenUrl) {
							listUrl = append(listUrl, url)
						}
					}
				}
			}
		} else {
			// Fallback to raw URL if not valid JSON
			listUrl = append(listUrl, v.URL)
		}
	}

	return &entities.BookRespDetail{
		ID:            id_number,
		Title:         book.Title,
		AuthorName:    book.AuthorName,
		Publisher:     book.Publisher,
		PublishedDate: book.PublishedDate,
		ISBN:          book.ISBN,
		Genre:         book.Genre,
		Description:   book.Description,
		Language:      book.Language,
		PageCount:     book.PageCount,
		Dimensions:    book.Dimensions,
		Weight:        book.Weight,
		Price:         book.Price,
		DiscountPrice: book.DiscountPrice,
		Quantity:      book.Quantity,
		Notes:         book.Notes,
		IsActive:      book.IsActive,
		OpeningStatus: book.OpeningStatus,
		Files:         listUrl,
	}, nil
}

func (u *UploadBookUseCase) GetListBookByTypeBook(ctx context.Context, typeBook, desc, asc, startPrice, EndPrice string) (*entities.BookRespDetailList, errors.Error) {
	var bookDetails []*entities.BookDetailList

	startPriceNum, _ := strconv.ParseFloat(startPrice, 64)
	endPrice, _ := strconv.ParseFloat(EndPrice, 64)
	// Lấy danh sách sách theo loại sách
	respListBook, err := u.books.GetListBookByTypeBook(ctx, typeBook, startPriceNum, endPrice)
	if err != nil {
		return nil, errors.NewSystemError("system error occurred while fetching books")
	}

	// Duyệt qua từng cuốn sách
	for _, book := range respListBook {
		// Luôn khởi tạo `listFileResp` là một mảng rỗng
		listFileResp := []string{}

		// Lấy danh sách file theo ID sách
		listFile, _ := u.fie_lc.GetListFileById(ctx, book.ID)
		for _, file := range listFile {
			listFileResp = append(listFileResp, file.URL)
		}

		// Tạo đối tượng BookRespDetail và thêm vào danh sách kết quả
		bookDetails = append(bookDetails, &entities.BookDetailList{
			Book: &domain.Book{
				ID:            book.ID,
				Title:         book.Title,
				AuthorName:    book.AuthorName,
				Publisher:     book.Publisher,
				PublishedDate: book.PublishedDate,
				ISBN:          book.ISBN,
				Genre:         book.Genre,
				Description:   book.Description,
				Language:      book.Language,
				PageCount:     book.PageCount,
				Dimensions:    book.Dimensions,
				Weight:        book.Weight,
				Price:         book.Price,
				DiscountPrice: book.DiscountPrice,
				Quantity:      book.Quantity,
				Notes:         book.Notes,
				IsActive:      true,
				OpeningStatus: book.OpeningStatus,
			},
			Files: listFileResp, // `Files` sẽ là một mảng rỗng nếu không có file nào
		})
	}
	switch {
	case desc != "" && asc == "":
		// Sort by price in descending order
		sort.Slice(bookDetails, func(i, j int) bool {
			return bookDetails[i].Book.Price > bookDetails[j].Book.Price
		})
	case asc != "" && desc == "":
		// Sort by price in ascending order
		sort.Slice(bookDetails, func(i, j int) bool {
			return bookDetails[i].Book.Price < bookDetails[j].Book.Price
		})
	}

	return &entities.BookRespDetailList{
		BookDetailList: bookDetails,
		Count:          len(bookDetails),
	}, nil
}
func (u *UploadBookUseCase) UpdateQuantityBookByOrderId(ctx context.Context, orderId string) errors.Error {

	orderIdNumber, _ := strconv.ParseInt(orderId, 10, 64)
	tx, _ := u.trans.BeginTransaction(ctx)

	orderInfor, err := u.order.GetOrderByID(ctx, orderIdNumber)
	if err != nil {
		tx.Rollback()
		return errors.NewSystemError(fmt.Sprintf("error system %v", err))
	}
	bookInfor, err := u.books.GetBookById(ctx, orderInfor.BookID)
	if err != nil {
		tx.Rollback()
		return errors.NewSystemError(fmt.Sprintf("error system %v", err))
	}
	err = u.books.UpdateQuantity(ctx, orderIdNumber, bookInfor.Quantity+orderInfor.Quantity)
	if err != nil {
		tx.Rollback()
		return errors.NewSystemError(fmt.Sprintf("error system %v", err))
	}

	tx.Commit()
	return nil
}

func (u *UploadBookUseCase) GetBooksByName(ctx context.Context, nameBook string) ([]*domain.Book, errors.Error) {
	books, err := u.books.GetBookByName(ctx, nameBook)
	if err != nil {
		log.Error(err, "error")
		return nil, errors.ErrSystem
	}
	return books, nil
}

func (u *UploadBookUseCase) GetListBookLasterNew(ctx context.Context) (*entities.BookSellWells, errors.Error) {

	var booksResp = make([]*entities.BookRespSellWell, 0)
	books, err := u.books.GetListFiveLatestBooks(ctx)
	if err != nil {
		return nil, errors.NewCustomHttpErrorWithCode(enums.DB_ERR_CODE, enums.DB_ERR_MESS, "500")
	}
	for _, v := range books {
		var fileURL string
		listFile, _ := u.fie_lc.GetListFileById(ctx, v.ID)

		if listFile != nil && len(listFile) > 0 {
			// Nếu listFile có giá trị và không rỗng, gán URL của file đầu tiên
			fileURL = listFile[0].URL
		} else {
			// Nếu listFile là nil hoặc rỗng, gán URL là chuỗi rỗng
			fileURL = ""
		}
		if v.IsActive {
			booksResp = append(booksResp, &entities.BookRespSellWell{
				ID:            v.ID,
				Title:         v.Title,
				AuthorName:    v.AuthorName,
				Publisher:     v.Publisher,
				PublishedDate: v.PublishedDate,
				ISBN:          v.ISBN,
				Genre:         v.Genre,
				Description:   v.Description,
				Language:      v.Language,
				PageCount:     v.PageCount,
				Dimensions:    v.Dimensions,
				Weight:        v.Weight,
				Price:         v.Price,
				DiscountPrice: v.DiscountPrice,
				Quantity:      v.Quantity,
				Notes:         v.Notes,
				IsActive:      v.IsActive,
				OpeningStatus: v.OpeningStatus,
				FileDescFirst: fileURL,
			})
		}

	}
	return &entities.BookSellWells{
		Books: booksResp,
	}, nil
}
