import { useState } from "react";
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import './card_product.css';  // Assuming your styles are correct in this file
import { Badge, Button, Col, Form, Image, Row, Space } from "antd";

function CardProduct({ onEventClick }) {
    const [likedBooks, setLikedBooks] = useState({});  // State to store liked status for each book
    const imageDefault = 'http://placehold.it/300x400';

    // Sample book data
    const book = {
        id: 8113677,
        title: "Sách hay 999",
        author_name: "Tác giả Nam Cao",
        publisher: "Nam Cao",
        price: 328000,
        discount_price: 15,  // Discount percentage
        file_desc_first: "http://localhost:8080/manager/shader/thao/4626872.png"
    };

    const discountedPrice = book.price - (book.price * book.discount_price / 100);

    const toggleLike = (bookId) => {
        setLikedBooks(prevState => ({
            ...prevState,
            [bookId]: !prevState[bookId]
        }));

        const userData = JSON.parse(localStorage.getItem('userData'));
        const userId = userData?.id;

        if (userId) {
            fetch('http://127.0.0.1:8080/manager/favorite/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    book_id: bookId,
                })
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('list_book_favorite',[''])
                    console.log("Response:", data);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        } else {
            console.log("User not logged in");
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const handleClickBuy = (bookId) => {
        if (onEventClick) onEventClick();
        localStorage.setItem('book_id', bookId);
    };

    return (
        <div>
            <Form className="cart-product-contain">
                <Form.Item>
                    <Row className="cart-product-like-v1">
                        <Col>
                            {book.author_name}
                        </Col>
                        <Col>
                            {likedBooks[book.id] ? (
                                <FaHeart onClick={() => toggleLike(book.id)} style={{ cursor: 'pointer', color: 'red' }} />
                            ) : (
                                <FaRegHeart onClick={() => toggleLike(book.id)} style={{ cursor: 'pointer' }} />
                            )}
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item className="cart-product-image-v1">
                    <Space>
                        <Badge.Ribbon color="red" text={`Giảm giá: ${book.discount_price}%`}>
                            <Image width={270} src={book.file_desc_first || imageDefault} />
                        </Badge.Ribbon>
                    </Space>
                </Form.Item>
                <Form.Item className="cart-product-name-book-price">
                    <Row style={{
                        display: 'flex',
                        justifyContent: 'center',
                        fontSize: '20px',
                        textTransform: "uppercase",
                    }} className="cart-product-book-titile">
                        {book.title}
                    </Row>

                    <Row
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingLeft: '5px',
                            paddingRight: '5px'
                        }}
                    >
                        <div
                            style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                fontFamily: 'Arial, sans-serif',
                                margin: '0 10px'
                            }}
                        >
                            {formatPrice(book.price)}₫
                        </div>
                        <div
                            style={{
                                fontSize: '24px',   
                                fontWeight: 'bold', 
                                fontFamily: 'Arial, sans-serif',
                                margin: '0 10px',
                                color: 'red'
                            }}
                        >
                            {formatPrice(discountedPrice)}₫
                        </div>
                    </Row>
                </Form.Item>
                <Form.Item className="cart-product-submit">
                    <Button onClick={() => handleClickBuy(book.id)} type="primary">
                        Mua Ngay
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default CardProduct;
