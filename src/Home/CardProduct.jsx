import { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { Badge, Button, Col, Form, Image, Row, Space } from "antd";
import styles from './card_product.module.css'; // Import CSS module
//dung slide late , sell mua tu card
function CardProduct({ onEventClick, bookId, title, author_name, publisher, price, discount_price, file_desc_first, typeBook }) {
    const [likedBooks, setLikedBooks] = useState({});
    const imageDefault = 'http://placehold.it/300x400';

    const discountedPrice = price - (price * discount_price / 100);

    useEffect(() => {
        const favoriteBooks = JSON.parse(localStorage.getItem('list_book_favorite')) || [];
        setLikedBooks({
            [bookId]: favoriteBooks.includes(bookId)
        });
    }, [bookId]);

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
                    let favoriteBooks = JSON.parse(localStorage.getItem('list_book_favorite')) || [];

                    if (!favoriteBooks.includes(bookId)) {
                        favoriteBooks.push(bookId);
                    } else {
                        favoriteBooks = favoriteBooks.filter(id => id !== bookId);
                    }

                    localStorage.setItem('list_book_favorite', JSON.stringify(favoriteBooks));
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        } else {
            console.log("User not logged in");
        }
    };

    const unToggleLike = (bookId) => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const userId = userData?.id;

        if (userId) {
            fetch(`http://127.0.0.1:8080/manager/favorite/delete?id=${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 0) {
                        let favoriteBooks = JSON.parse(localStorage.getItem('list_book_favorite')) || [];
                        favoriteBooks = favoriteBooks.filter(id => id !== bookId);
                        localStorage.setItem('list_book_favorite', JSON.stringify(favoriteBooks));
                        setLikedBooks(prevState => ({
                            ...prevState,
                            [bookId]: false
                        }));
                    } else {
                        console.error("Failed to remove book from favorites:", data.message);
                    }
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
        localStorage.setItem('typebook',typeBook)
    };

    return (
        <div className={styles.cartProductContain}>
            <Form>
                <Form.Item>
                    <Row className={styles.cartProductLikeV1}>
                        <Col>
                        </Col>
                        <Col>
                            {likedBooks[bookId] ? (
                                <FaHeart onClick={() => unToggleLike(bookId)} style={{ cursor: 'pointer', color: 'red' }} />
                            ) : (
                                <FaRegHeart onClick={() => toggleLike(bookId)} style={{ cursor: 'pointer' }} />
                            )}
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item className={styles.cartProductImageV1}>
                    <Space>
                        <Badge.Ribbon color="red" text={`Giảm giá: ${discount_price}%`}>
                            <Image width={250} height={170} src={file_desc_first || imageDefault} />
                        </Badge.Ribbon>
                    </Space>
                </Form.Item>

                <Form.Item className={styles.cartProductNameBookPrice}>
                    <Row className={styles.cartProductBookTitle}>
                        {title}
                    </Row>

                    <Row style={{ display: 'block'}}>
                        <div className={discount_price > 0 ? styles.cartProductPriceStrikethrough : styles.cartProductPrice}>
                            {formatPrice(price)}₫
                        </div>
                        <div className={styles.cartProductDiscountedPrice}>
                            {formatPrice(discountedPrice)}₫
                        </div>
                    </Row>

                </Form.Item>

                <Form.Item className={styles.cartProductSubmit}>
                    <Button onClick={() => handleClickBuy(bookId)} type="primary">
                        Mua Ngay
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default CardProduct;
