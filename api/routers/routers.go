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
		bookGroup.GET("/list/type_book", book.GetListBookByTypeBook)
		bookGroup.PATCH("/update/order/cancel", book.UpdateQuantityBookByOrderId)
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
	}
	authorBookGroup := r.Group("/author_book")
	{
		authorBookGroup.POST("/add", authorBook.AddAuthorBook)
		authorBookGroup.GET("/list", authorBook.GetAllAuthorBook)
		authorBookGroup.DELETE("/delete", authorBook.DeleteAuthorBookById)
	}
	publisherGroup := r.Group("/publisher")
	{
		publisherGroup.POST("/add", publicer.AddPublisher)
		publisherGroup.GET("/list", publicer.ListPublisher)
		publisherGroup.DELETE("/delete", publicer.DeletePublisher)
	}
	orderGroup := r.Group("/order")
	{
		orderGroup.POST("/add", order.CreateOrder)
		orderGroup.GET("/infor", order.GetOrderById)
		orderGroup.PATCH("/update/success", order.UpdateStatusOrder)
		orderGroup.GET("/list/admin", order.GetListOrder)
		orderGroup.PATCH("/update/admin/submit", order.UpdateOrderForSend)
		orderGroup.GET("/list/order/admin", order.ListOrdersUseTk)
		orderGroup.POST("/api/orders", order.CreateOrderItem)
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
	return &ApiRouter{
		Engine: engine,
	}
}
