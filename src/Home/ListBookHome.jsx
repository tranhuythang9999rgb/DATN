import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Card, Typography, message, Image, Button } from 'antd';
import './index.css';
import { MdAddShoppingCart } from 'react-icons/md';
import Cookies from 'js-cookie';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import DetailBuy from './DetailBuy';

const { Meta } = Card;

function ListBookHome({ nameTypeBook }) {
    const [books, setBooks] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedBooks, setLikedBooks] = useState({});
    const [selectedBookId, setSelectedBookId] = useState(null);  // Add state to manage selected book ID
    const [isNextBuy, setIsNextBuy] = useState(false);


    // Function to fetch books data
    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://127.0.0.1:8080/manager/book/list/type_book?name=${encodeURIComponent(nameTypeBook)}`);
            if (response.data.code === 0) {
                // Access book_detail_list from response
                setBooks(response.data.body.book_detail_list || []); // Ensure it's an array
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

    // Load liked books from cookies
    const loadLikedBooks = () => {
        const liked = Cookies.get('likedBooks');
        if (liked) {
            setLikedBooks(JSON.parse(liked));
        }
    };

    // Toggle like status for a book
    const toggleLike = (bookId) => {
        setLikedBooks((prevLikedBooks) => {
            const updatedLikedBooks = {
                ...prevLikedBooks,
                [bookId]: !prevLikedBooks[bookId],
            };
            // Save updated liked books to cookies
            Cookies.set('likedBooks', JSON.stringify(updatedLikedBooks), { expires: 7 });
            return updatedLikedBooks;
        });
    };

    const handleBuyNow = (bookId) => {
        setSelectedBookId(bookId);
        setIsNextBuy(true);
    };

    // Fetch books and load liked books when the component mounts or nameTypeBook changes
    useEffect(() => {
        fetchBooks();
        loadLikedBooks();
    }, [nameTypeBook]);

    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }

    if (loading) {
        return <Spin tip="Loading books..." />;
    }

    if (error) {
        return <Typography.Text type="danger">{error}</Typography.Text>;
    }

    if (books.length === 0) {
        const timeoutId = setTimeout(() => {
            window.location.reload();
        }, 2000); // 5000 milliseconds = 5 seconds

        return <div>
            <Typography.Text>Chưa có sách nào.</Typography.Text>;
        </div>
    }
    if (isNextBuy) {
        return <DetailBuy book_id={selectedBookId} />;
    }
    return (
        <div className='box'>
            {books.map((item) => (
                <div className='done' key={item.book.id} style={{ marginLeft: '10px', marginRight: '10px' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button
                                type="text"
                                icon={likedBooks[item.book.id] ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
                                onClick={() => toggleLike(item.book.id)}
                            />
                        </div>
                        <Card
                            hoverable
                            style={{
                                width: 250,
                                height: 300,
                                overflow: 'hidden',
                            }}
                            cover={
                                <Image
                                    alt={item.book.title}
                                    src={item.files[0] || 'http://placehold.it/300x400'}
                                    style={{
                                        marginTop: '-39px',
                                        height: 300,
                                        marginLeft: '-30px'
                                    }}
                                />
                            }
                        >
                            <Meta />
                        </Card>
                    </div>
                    <div style={{ paddingTop: '12px', marginTop: '295px', background: 'white', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ paddingLeft: '10px' }}>
                                {truncateText(item.book.title, 20)} {/* Adjust the maxLength as needed */}
                            </div>
                            <div>
                                {item.book.price} VND
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5px' }}>
                            <Button onClick={() => handleBuyNow(item.book.id)} style={{ background: 'red', color: 'white', fontSize: '17px' }}>
                                Mua ngay
                            </Button>
                            <MdAddShoppingCart style={{ fontSize: '25px', color: 'orange' }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListBookHome;
