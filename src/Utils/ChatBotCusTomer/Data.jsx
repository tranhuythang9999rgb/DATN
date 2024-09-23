const data = {
    categories: {
        book_search: [
            {
                question: "Tôi muốn tìm sách của [tên tác giả]. Bạn có cuốn nào không?",
                field: "author"
            },
            {
                question: "Bạn có thể giới thiệu sách thuộc thể loại [tên thể loại] không?",
                field: "genre"
            },
            {
                question: "Sách nào đang bán chạy nhất hiện nay?",
                field: "bestseller"
            },
            {
                question: "Có sách nào giảm giá không?",
                field: "discount"
            }
        ],
        product_info: [
            {
                question: "Cuốn sách [tên sách] còn hàng không?",
                field: "availability"
            },
            {
                question: "Giá của cuốn [tên sách] là bao nhiêu?",
                field: "price"
            },
            {
                question: "Sách [tên sách] có bản e-book không?",
                field: "ebook"
            },
            {
                question: "Tác giả của cuốn [tên sách] là ai?",
                field: "author"
            }
        ],
        order_status: [
            {
                question: "Tôi đã đặt hàng, làm sao để kiểm tra trạng thái đơn hàng của tôi?",
                field: "order_status"
            },
            {
                question: "Bao lâu nữa thì tôi sẽ nhận được sách?",
                field: "delivery_time"
            },
            {
                question: "Làm sao để hủy đơn hàng?",
                field: "cancel_order"
            }
        ],
        order_support: [
            {
                question: "Làm sao để thêm sách vào giỏ hàng?",
                field: "add_to_cart"
            },
            {
                question: "Cách thanh toán trên website như thế nào?",
                field: "payment_method"
            },
            {
                question: "Bạn có hỗ trợ thanh toán qua VNPay/MoMo không?",
                field: "payment_support"
            }
        ],
        account_management: [
            {
                question: "Làm sao để đăng ký tài khoản?",
                field: "register_account"
            },
            {
                question: "Làm sao để xem lịch sử mua hàng của tôi?",
                field: "order_history"
            },
            {
                question: "Làm sao để đổi mật khẩu?",
                field: "change_password"
            }
        ],
        promotions: [
            {
                question: "Có chương trình khuyến mãi nào đang diễn ra không?",
                field: "current_promotions"
            },
            {
                question: "Tôi có thể sử dụng mã giảm giá như thế nào?",
                field: "discount_code"
            }
        ],
        book_recommendation: [
            {
                question: "Bạn có thể gợi ý sách cho người yêu thích thể loại [tên thể loại] không?",
                field: "genre_recommendation"
            },
            {
                question: "Mình muốn tìm sách phù hợp với trẻ em, bạn có gợi ý gì không?",
                field: "children_books"
            }
        ],
        store_info: [
            {
                question: "Giờ làm việc của cửa hàng là khi nào?",
                field: "working_hours"
            },
            {
                question: "Cửa hàng có ship sách toàn quốc không?",
                field: "shipping"
            }
        ]
    }
};

export default data;
