import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Image, Row, Tooltip, Typography } from 'antd';
import axios from 'axios';
import { MdSell } from 'react-icons/md';
import { FaRegHeart, FaHeart } from 'react-icons/fa';  // Import FaHeart for the filled heart icon
import Cookies from 'js-cookie';  // Import js-cookie

const { Meta } = Card;
const { Title } = Typography;

const BookWellSell = ({ title, onEventClick }) => {
    const [books, setBooks] = useState([]);
    const [likedBooks, setLikedBooks] = useState({});  // State to store liked status for each book

    useEffect(() => {
        // Fetch data from API
        axios.get('http://localhost:8080/manager/book/sell/well')
            .then(response => {
                if (response.data && response.data.body && response.data.body.books) {
                    setBooks(response.data.body.books);
                    loadLikedBooks();
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Load liked books from cookies
    const loadLikedBooks = () => {
        const liked = Cookies.get('likedBooks');
        if (liked) {
            setLikedBooks(JSON.parse(liked));
        }
    };

    // Save liked books to cookies
    const saveLikedBooks = (liked) => {
        Cookies.set('likedBooks', JSON.stringify(liked), { expires: 365 });  // Cookie expires in 365 days
    };

    const toggleLike = (bookId) => {
        const updatedLikedBooks = {
            ...likedBooks,
            [bookId]: !likedBooks[bookId]
        };
        setLikedBooks(updatedLikedBooks);
        saveLikedBooks(updatedLikedBooks);
    };
    const handleClickBuy = (bookId) => {
        if (onEventClick) onEventClick();
        localStorage.setItem('book_id', bookId);
    };
    return (
        <div style={{ padding: '20px', marginTop: '320px' }}>
            <Title level={2}>{title}<MdSell /></Title>
            <Row gutter={16} justify="space-between">
                {books.map(book => (
                    <Col span={4} key={book.id} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card
                            cover={
                                <div style={{ position: 'relative' }}>
                                    <div
                                        className='icon-trai-tim'
                                        onClick={() => toggleLike(book.id)}  // Toggle like status on click
                                        style={{
                                            zIndex: 1000,
                                            position: 'absolute',
                                            top: '3px',
                                            right: '35px',
                                            fontSize: '25px',
                                            color: likedBooks[book.id] ? 'red' : 'pink',  // Change color if liked
                                            cursor: 'pointer',
                                            borderRadius: '90%',
                                        }}
                                    >
                                        {likedBooks[book.id] ? <FaHeart /> : <FaRegHeart />}
                                    </div>
                                    <Image
                                        alt={book.title}
                                        src={book.file_desc_first || 'http://placehold.it/300x400'}
                                        style={{
                                            height: '200px',
                                            objectFit: 'cover',
                                            width: '220px',
                                            display: 'flex',
                                            marginLeft: '10px'
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
                            <Meta title={book.title} />
                            <div style={{ marginTop: '10px' }}>
                                <p><strong>Giá:</strong> {book.price} VND</p>
                            </div>
                            <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                <Button
                                    style={{ background: 'red', color: 'white', fontSize: '17px' }}
                                    onClick={() => handleClickBuy(book.id)} // Pass book.id to handleClickBuy
                                >
                                    Mua ngay
                                </Button>
                            </span>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default BookWellSell;
