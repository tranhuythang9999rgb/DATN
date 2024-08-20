package controllers

import (
	"fmt"
	"mime/multipart"
	"net/http"
	errors "shoe_shop_server/common/error"
	"shoe_shop_server/common/log"

	"github.com/gin-gonic/gin"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type baseController struct {
	validate *validator.Validate
}

func NewBaseController(
	validate *validator.Validate,
) *baseController {
	return &baseController{
		validate: validate,
	}
}

func (b *baseController) validateRequest(request interface{}) error {
	err := b.validate.Struct(request)
	if err != nil {
		for _, errValidate := range err.(validator.ValidationErrors) {
			log.Debugf("query invalid, err:[%s]", errValidate)
		}
		return err
	}
	return nil
}

func (b *baseController) GenRequestId() string {
	return uuid.New().String()
}

func (b *baseController) Success(c *gin.Context, data interface{}) {
	response := NewResponseResource(errors.Success, "success", data)
	c.JSON(http.StatusOK, response)
}

func (b *baseController) ErrorData(c *gin.Context, err errors.Error) {
	httpCode := err.GetHttpCode()
	response := NewResponseErr(err)
	c.JSON(httpCode, response)
}

func (b *baseController) BadRequest(c *gin.Context, message string) {
	b.ErrorData(c, errors.NewCustomHttpError(http.StatusBadRequest, errors.BadRequest, message))
}

func (b *baseController) DefaultBadRequest(c *gin.Context) {
	b.ErrorData(c, errors.ErrBadRequest)
}

func (b *baseController) SuccessConfig(c *gin.Context, code int, data interface{}) {
	response := NewResponseResource(errors.Success, "success", data)
	c.JSON(code, response)
}
func (b *baseController) Response(ctx *gin.Context, resp interface{}, err error) {
	if err != nil {
		ctx.JSON(505, err)
		return
	}
	ctx.JSON(200, resp)
}
func (b *baseController) GetUploadedFiles(c *gin.Context) ([]*multipart.FileHeader, error) {
	form, err := c.MultipartForm()
	if err != nil {
		return nil, err
	}

	files, ok := form.File["file"]
	if !ok || len(files) == 0 {
		return nil, nil
	}

	var uploadedFiles []*multipart.FileHeader
	for _, file := range files {
		if file.Size == 0 {
			return nil, fmt.Errorf("Uploaded file is empty")
		}
		uploadedFiles = append(uploadedFiles, file)
	}

	return uploadedFiles, nil
}
