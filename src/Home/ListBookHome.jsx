import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Card, Typography, message, Row, Col, Image, Button, Space } from 'antd';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './index.css';
import { MdAddShoppingCart } from 'react-icons/md';
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
                // Access book_detail_list from response
                setBooks(response.data.body.book_detail_list);
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
        <div className='box'>
            {books.map((item, index) => (
                <div className='done' key={item.book.id} style={{ marginLeft: '10px', marginRight: '10px' }}>
                    <div>
                        <Card
                            hoverable
                            style={{
                                width: 250,
                                height: 300,
                                borderRadius: 10,
                                overflow: 'hidden',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            cover={
                                <Image
                                    alt={item.book.title}
                                    src={item.files[0] || 'http://placehold.it/300x400'}
                                    style={{
                                        marginTop: '-39px',
                                        height: 300,
                                        borderRadius: '10px 10px 0 0',
                                        marginLeft: '-30px'
                                    }}
                                />
                            }

                        >
                            <Meta />
                        </Card>      <Card
                            hoverable
                            style={{
                                width: 250,
                                height: 300,
                                borderRadius: 10,
                                overflow: 'hidden',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            cover={
                                <Image
                                    alt={item.book.title}
                                    src={item.files[0] || 'http://placehold.it/300x400'}
                                    style={{
                                        marginTop: '-39px',
                                        height: 300,
                                        borderRadius: '10px 10px 0 0',
                                        marginLeft: '-30px'
                                    }}
                                />
                            }

                        >
                            <Meta />
                        </Card>
                        
                    </div>
                    <div style={{ paddingTop: '10px',background:'red' ,marginTop:'300px'}}>hi hi</div>
                </div>
            ))}
        </div>
    );
}

export default ListBookHome;
