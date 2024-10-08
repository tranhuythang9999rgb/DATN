package enums

const (
	SUCCESS_CODE   = 0
	SUCCESS_MESS   = "Success"
	LOGIN_ERR_CODE = 2
	LOGIN_ERR_MESS = "Login failed"

	DB_ERR_CODE = 4
	DB_ERR_MESS = "Database error"

	ADMIN_NOT_EXIST_CODE = 6
	ADMIN_NOT_EXIST_MESS = "ACCOUNT admin not exist"

	ERROR_CONVERT_JSON_CODE = 8
	ERROR_CONVERT_JSON_MESS = "error convert string to json"

	ERROR_LOAD_CONFIG_CODE = 10
	ERROR_LOAD_CONFIG_MESS = "error load coonfig"

	INVALID_REQUEST_CODE = 12
	INVALID_REQUEST_MESS = "invalid request"

	CONVERT_TO_NUMBER_CODE = 14
	CONVERT_TO_NUMBER_MESS = "error convert string to number"

	TRANSACTION_INVALID_CODE = 16
	TRANSACTION_INVALID_MESS = "invalid transaction"

	AES_ENCRYPT_AES_CODE = 18
	AES_ENCRYPT_AES_MESS = "AES encryption error"

	HASH_PASSWORD_ERR_CODE = 20
	HASH_PASSWORD_ERR_MESS = "password error"

	USER_EXITS_CODE      = 22
	USER_EXITS_CODE_MESS = "ACCOUNT  exist"

	USER_NOT_EXIST_CODE = 24
	USER_NOT_EXIST_MESS = "ACCOUNT user not exist"

	CREATE_TOKEN      = 26
	CREATE_TOKEN_MESS = "create token error"

	UPLOAD_FILE_ERR_CODE = 28
	UPLOAD_FILE_ERR_MESS = "upload file error"

	CONVERT_STRING_TO_ARRAY_CODE = 30
	CONVERT_STRING_TO_ARRAY_MESS = "convert string string to array error"

	SEND_EMAIL_ERR_CODE = 32
	SEND_EMAIL_ERR_MESS = "error send email"

	TICKETS_REGISTERED_ERR_CODE = 34
	TICKETS_REGISTERED_ERR_MESS = "error tickets regisedred"

	AES_DECRYPT_AES_CODE = 18
	AES_DECRYPT_AES_MESS = "error QRcode is invalid"
)
const (
	ROLE_ADMIN     = 1
	ROLE_STAFF     = 3
	ACCOUNT_ACTIVE = 5
	ORDER_INIT     = 7
	ORDER_SUCESS   = 9
	ORDER_CANCEL   = 11
	ROLE_CUSTOMER  = 13

	TYPE_PAYMENT_ONLINE = 25

	TYPE_PAYMENT_OFFLINE = 27

	ADDRESS_STATUS_DEFAULT = 29

	ORDER_STATUS_SUBMIT_SEND = 31

	ORDER_STATUS_SUCESS = 35
)

const (
	AWAITING_CONFIRMATION   = 11 // Đang chờ xác nhận
	AWAITING_ONLINE_PAYMENT = 13 // Đang chờ thanh toán online
	ONLINE_PAYMENT_RECEIVED = 15 // Đã nhận thanh toán online
	PREPARING_ORDER         = 17 // Đang chuẩn bị đơn hàng
	IN_TRANSIT              = 19 // Đang vận chuyển
	OUT_FOR_DELIVERY        = 21 // Đang giao hàng
	DELIVERED               = 23 //  Đơn hàng đã giao và hoàn tất
	CANCELLED               = 25 // Đơn hàng đã hủy
)

const (
	NoSignatureErrorMessage         = "No signature."
	NoDataErrorMessage              = "No data."
	InvalidSignatureErrorMessage    = "Invalid signature."
	DataNotIntegrityErrorMessage    = "The data is unreliable because the signature of the response does not match the signature of the data."
	WebhookURLInvalidErrorMessage   = "Webhook URL invalid."
	UnauthorizedErrorMessage        = "Unauthorized."
	InternalServerErrorErrorMessage = "Internal Server Error."
	InvalidParameterErrorMessage    = "Invalid Parameter."
	OrderCodeOuOfRange              = "orderCode is out of range."
)

const (
	InternalServerErrorErrorCode = "20"
	UnauthorizedErrorCode        = "401"
	InvalidParameterErrorCode    = "21"
	NoSignatureErrorCode         = "22"
	NoDataErrorCode              = "23"
	InvalidSignatureErrorCode    = "24"
	DataNotIntegrityErrorCode    = "25"
	WebhookURLInvalidErrorCode   = "26"
)
const (
	ClientIDPayOs    = "c84c857d-160c-456a-91f2-384526d7a360"
	ApiKeyPayOs      = "f74461b1-d7d3-4fca-b918-fcb39524ce8c"
	ChecksumKeyPayOs = "a861fb19b44c840efe2632b492140200e6a2e496640e1312fb5b63d5bf54a47c"
)
const (
	ERROR_REQ_CODE = 4
	ERROR_REQ_MESS = "file empty"
)
