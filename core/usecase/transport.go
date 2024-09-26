package usecase

import (
	"context"
	"fmt"
	"math"
	"regexp"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"
	"shoe_shop_server/core/domain"
	"shoe_shop_server/core/entities"
	"strings"

	"github.com/gosimple/unidecode"
)

type TransPortUserCase struct {
	book domain.RepositoryBook
}

func NewTransPortUserCase(book domain.RepositoryBook) *TransPortUserCase {
	return &TransPortUserCase{
		book: book,
	}
}

func (u *TransPortUserCase) GetInforMationForChatBot(ctx context.Context, text *entities.DataContent) (string, errors.Error) {
	// h := "Giá của cuốn [tên sách] là bao nhiêu?"
	// định dạng input
	// Lấy danh sách sách
	// Lấy danh sách sách
	log.Info(text.Content)
	listBook, err := u.book.List(ctx, &domain.BookReqForm{}, math.MaxInt, 0)
	if err != nil {
		log.Error(err, "error")
		return "", errors.ErrSystem
	}

	// Sử dụng regex để tìm tên sách trong văn bản
	// Điều chỉnh regex để chấp nhận truy vấn "cuốn sách [tên sách] giá"
	re := regexp.MustCompile(`cuốn\s+sách\s+(.+?)\s+giá`)
	matches := re.FindStringSubmatch(text.Content)

	if len(matches) > 1 {
		// Trích xuất tên sách từ văn bản và loại bỏ dấu
		bookName := strings.TrimSpace(matches[1])
		normalizedBookName := unidecode.Unidecode(bookName) // Chuyển đổi tên sách thành không có dấu

		for _, book := range listBook {
			// Loại bỏ dấu từ tiêu đề sách trong danh sách
			normalizedTitle := unidecode.Unidecode(book.Title) // Chuyển đổi tiêu đề thành không có dấu

			// So sánh tên sách đã loại bỏ dấu
			if strings.EqualFold(normalizedTitle, normalizedBookName) {
				// Nếu tìm thấy, có thể trả về thông tin cần thiết
				response := fmt.Sprintf("Giá của cuốn sách '%s' là %f.", book.Title, book.Price) // Giả sử bạn có thuộc tính Price
				return response, nil                                                             // Hoặc trả về thông tin khác liên quan
			}
		}
	}

	// Nếu không tìm thấy tên sách trong văn bản
	return "Không tìm thấy thông tin về sách nào.", nil
}
