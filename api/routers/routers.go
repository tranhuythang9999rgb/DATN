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
	order *controllers.ControllerOrder,
	deliveryAddress *controllers.ControllerDeliveryAddress,
	payment *controllers.ControllersPayment,
	cart *controllers.ControllerCart,
	favorite *controllers.ControllerFavorites,
	loypoint *controllers.ControllerLoyPoint,
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
		userGroup.GET("/profile", user.GetProFile)
		userGroup.POST("/admin", user.AddUserAdmin)
		userGroup.GET("/register/admin", user.RegisterAdmin)
		userGroup.GET("/list/use/admin", user.GetListAccount)
	}
	bookGroup := r.Group("/book")
	{
		bookGroup.POST("/upload", book.AddBook)
		bookGroup.GET("/list", book.ListBooks)
		bookGroup.PATCH("delete", book.DeleteBookById)
		bookGroup.GET("/id", book.GetBookById)
		bookGroup.PUT("/update", book.UpdateBookById)
		bookGroup.GET("/sell/well", book.GetListBookSellWell)
		bookGroup.GET("/detail/page", book.GetdetailBookByid)
		bookGroup.GET("/list/type_book", book.GetListBookByTypeBook) // can su ly
		bookGroup.PATCH("/update/order/cancel", book.UpdateQuantityBookByOrderId)
		bookGroup.GET("/list/filter", book.GetBooksByName)
		bookGroup.GET("/sell/late", book.GetListFiveLatestBooks)
		bookGroup.GET("/list/by/author", book.GetListBookByAuthorName)
		bookGroup.GET("/list/by/publicsher", book.GetListBookByPublicSherName)
		bookGroup.GET("/list/use/bot", book.GetListBookUseBot)
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
		typeBookGroup.DELETE("/delete", typeBook.DeleteTypeBookById)
		typeBookGroup.PATCH("/update", typeBook.UpdateTypeBookById)
	}
	authorBookGroup := r.Group("/author_book")
	{
		authorBookGroup.POST("/add", authorBook.AddAuthorBook)
		authorBookGroup.GET("/list", authorBook.GetAllAuthorBook)
		authorBookGroup.DELETE("/delete", authorBook.DeleteAuthorBookById)
		authorBookGroup.GET("/details", authorBook.GetAuthorBookByUserName)
		authorBookGroup.PATCH("/update", authorBook.UpdateAuthorBookById)
	}
	publisherGroup := r.Group("/publisher")
	{
		publisherGroup.POST("/add", publicer.AddPublisher)
		publisherGroup.GET("/list", publicer.ListPublisher)
		publisherGroup.DELETE("/delete", publicer.DeletePublisher)
		publisherGroup.GET("/user_name", publicer.GetPublisherByUserName)
		publisherGroup.PATCH("/update", publicer.UpdatePublisher)
	}
	orderGroup := r.Group("/order")
	{
		orderGroup.GET("/infor", order.GetOrderById)
		orderGroup.PATCH("/update/success", order.UpdateStatusOrder) // sucess online
		orderGroup.GET("/list/admin", order.GetListOrder)
		orderGroup.PATCH("/update/admin/submit", order.UpdateOrderForSend)
		orderGroup.GET("/list/order/admin", order.ListOrdersUseTk)
		orderGroup.PATCH("/api/order/offiline", order.UpdateOrderOffline)
		orderGroup.GET("/api/admin/day", order.GetOrderBuyOneDay)
		orderGroup.POST("/api/pend/offline", order.CreateOrderWhenBuyOffLine)
		orderGroup.GET("/api/getlist/user", order.GetListOrderForuser)
		orderGroup.PATCH("/api/update/calcel", order.UpdateOrderWhenCanCel)
		orderGroup.GET("/api/listorder/admin", order.GetListOrderForAdmin)
	}
	deliveryAddressGroup := r.Group("/delivery_address")
	{
		deliveryAddressGroup.POST("/add", deliveryAddress.AddDeliveryAddress)
		deliveryAddressGroup.POST("/add/profile", deliveryAddress.AddDeliveryAddressUpdateProfile)
		deliveryAddressGroup.GET("/infor/profile", deliveryAddress.GetAddressByUserName)
		deliveryAddressGroup.GET("/list", deliveryAddress.GetListAddressByUserName)
		deliveryAddressGroup.PATCH("/update", deliveryAddress.UpdateStatusAddressById)
		deliveryAddressGroup.DELETE("/delete", deliveryAddress.DeleteAddressById)
	}
	paymentGroup := r.Group("/payment")
	{
		paymentGroup.PATCH("/add", payment.CreatePayment)
		paymentGroup.GET("/return/create/payment", payment.ReturnUrlAfterPayment)
		paymentGroup.GET("/return/calcel/payment/", payment.ReturnUrlAftercanCelPayment)
		paymentGroup.POST("/create/payment", payment.CreatePaymentWhenCart)
	}
	// address public
	r.GET("/public/customer/cities", addresPublic.GetAllCity)
	r.GET("/public/customer/districts", addresPublic.GetAllDistrictsByCityName)
	r.GET("/public/customer/communes", addresPublic.GetAllCommunesByDistrictName)
	//cart
	cartGroup := r.Group("/cart")
	{
		cartGroup.POST("/add", cart.AddCart)
		cartGroup.DELETE("/delete", cart.DeleteCart)
		cartGroup.GET("/list", cart.GetListCartByUserId)
		cartGroup.PATCH("/update", cart.UpdateQuantityCartById)
	}
	//favorite
	favoriteGroup := r.Group("/favorite")
	{
		favoriteGroup.POST("/add", favorite.AddFavorites)
		favoriteGroup.DELETE("/delete", favorite.RemoveFavorites)
		favoriteGroup.GET("/list", favorite.GetFavorites)
	}
	//loypoint
	loypointGroup := r.Group("/loypoint")
	{
		loypointGroup.POST("/add", loypoint.AddLoyPoint)
		loypointGroup.GET("/list", loypoint.GetLoyaltyPointsByUserid)
		loypointGroup.GET("/list/loys", loypoint.GetListPoint)
	}
	return &ApiRouter{
		Engine: engine,
	}
}
