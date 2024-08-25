package routers

import (
	"net/http"
	"shoe_shop_server/api/controllers"
	"shoe_shop_server/core/configs"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
)

type ApiRouter struct {
	Engine *gin.Engine
}

func NewApiRouter(
	cf *configs.Configs,
	user *controllers.ControllersUser,
	addresPublic *controllers.ControllerAddress,
	book *controllers.ControllersUploadBooks,
	file_lc *controllers.ControllerFileLc,
	typeBook *controllers.ControllersTypeBook,
	publicer *controllers.ControllersPublisher,
	authorBook *controllers.ControllersAuthorBook,

) *ApiRouter {
	engine := gin.New()
	gin.DisableConsoleColor()

	engine.Use(gin.Logger())
	engine.Use(cors.AllowAll())
	engine.Use(gin.Recovery())

	r := engine.RouterGroup.Group("/manager")
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})
	r.POST("/upload", controllers.UploadImage)

	r.StaticFS("/shader/thao", http.Dir("shader"))
	//user
	userGroup := r.Group("/user")
	{
		userGroup.POST("/register", user.AddUser)
		userGroup.POST("/login", user.Login)
	}
	bookGroup := r.Group("/book")
	{
		bookGroup.POST("/upload", book.AddBook)
		bookGroup.GET("/list", book.ListBooks)
		bookGroup.PATCH("delete", book.DeleteBookById)
		bookGroup.GET("/id", book.GetBookById)
		bookGroup.PUT("/update", book.UpdateBookById)
		bookGroup.GET("/sell/well", book.GetListBookSellWell)
	}
	fileGroup := r.Group("/file")
	{
		fileGroup.GET("/list", file_lc.GetListFileById)
		fileGroup.POST("/upload", file_lc.UpSertFileDescriptByAnyId)
		fileGroup.DELETE("/delete", file_lc.DeleteFileById)
	}
	typeBookGroup := r.Group("/type_book")
	{
		typeBookGroup.POST("/add", typeBook.AddTypeBook)
		typeBookGroup.GET("/list", typeBook.GetListTypeBook)
	}
	authorBookGroup := r.Group("/author_book")
	{
		authorBookGroup.POST("/add", authorBook.AddAuthorBook)
		authorBookGroup.GET("/list", authorBook.GetAllAuthorBook)
	}
	publisherGroup := r.Group("/publisher")
	{
		publisherGroup.POST("/add", publicer.AddPublisher)
		publisherGroup.GET("/list", publicer.ListPublisher)
	}
	// address public
	r.GET("/public/customer/cities", addresPublic.GetAllCity)
	r.GET("/public/customer/districts", addresPublic.GetAllDistrictsByCityName)
	r.GET("/public/customer/communes", addresPublic.GetAllCommunesByDistrictName)
	return &ApiRouter{
		Engine: engine,
	}
}
