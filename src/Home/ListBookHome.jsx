import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Card, Typography, message, Row, Col, Button, Image, Carousel } from 'antd';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const { Meta } = Card;

function ListBookHome({ nameTypeBook }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedBooks, setLikedBooks] = useState({});

    // Function to fetch books data
    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://127.0.0.1:8080/manager/book/list/type_book?name=${encodeURIComponent(nameTypeBook)}`);
            if (response.data.code === 0) {
                setBooks(response.data.body);
            } else {
                message.error('Failed to fetch books');
            }
        } catch (err) {
            setError('Error fetching books');
            message.error('Error fetching books');
        } finally {
            setLoading(false);
        }
    };

    // Toggle like status for a book
    const toggleLike = (bookId) => {
        setLikedBooks((prevLikedBooks) => ({
            ...prevLikedBooks,
            [bookId]: !prevLikedBooks[bookId],
        }));
    };

    // Handle "Buy Now" action
    const handleBuyNow = (bookId) => {
        // Implement buy now functionality here
        message.success(`Book with ID ${bookId} purchased!`);
    };

    // Fetch books when the component mounts or nameTypeBook changes
    useEffect(() => {
        fetchBooks();
    }, [nameTypeBook]);

    if (loading) {
        return <Spin tip="Loading books..." />;
    }

    if (error) {
        return <Typography.Text type="danger">{error}</Typography.Text>;
    }

    return (
        <Row gutter={16} justify="space-between">
            {books.map((book) => (
                <Col span={4} key={book.book.id} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Card
                        cover={
                            <div style={{ position: 'relative' }}>
                                <div
                                    className='icon-trai-tim'
                                    onClick={() => toggleLike(book.book.id)}  // Toggle like status on click
                                    style={{
                                        position: 'absolute',
                                        top: '3px',
                                        right: '35px',
                                        fontSize: '25px',
                                        color: likedBooks[book.book.id] ? 'red' : 'pink',  // Change color if liked
                                        cursor: 'pointer',
                                        borderRadius: '90%',
                                    }}
                                >
                                    {likedBooks[book.book.id] ? <FaHeart /> : <FaRegHeart />}
                                </div>
                                
                                <Image
                                    alt={book.book.title}
                                    src={book.files[0] || 'http://placehold.it/300x400'}
                                    style={{
                                        height: '200px',
                                        objectFit: 'cover',
                                        width: '220px',
                                        display: 'flex',
                                        margin: '0 auto',
                                    }}
                                />

                            </div>
                        }
                        style={{
                            width: '300px',
                            height: '380px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Meta title={book.book.title} />
                        <div style={{ marginTop: '10px' }}>
                            <p><strong>Giá:</strong> {book.book.price} VND</p>
                        </div>
                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                            <Button onClick={() => handleBuyNow(book.book.id)} style={{ background: 'red', color: 'white', fontSize: '17px' }}>
                                Mua ngay
                            </Button>
                        </span>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}

export default ListBookHome;
