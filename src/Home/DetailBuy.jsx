import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Col, Drawer, Dropdown, Image, Input, Menu, message, Modal, Row, Space, Spin, Tooltip, Typography } from 'antd';
import './home_index.module.css';
import { MinusOutlined, PlusOutlined, QuestionOutlined } from '@ant-design/icons';

import SubmitBuyBook from './SubmitBuyBook';
import { addToCart } from '../user/Carts';
import styles from './index_header.module.css';
import { CiLogin, CiSearch } from 'react-icons/ci';
import { GiArmoredBoomerang } from 'react-icons/gi';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import ListCart from '../user/ListCart';
import { FcHome } from 'react-icons/fc';
import { CgProfile } from 'react-icons/cg';
import Login from '../common/Login';
import Footer from '../Utils/Footer';
import Slider from "react-slick";
import styleDetail from './detail_buy.module.css';
import ButtonGroup from 'antd/es/button/button-group';
import { BsFileMinus } from 'react-icons/bs';
const { Title, Text, Paragraph } = Typography;

const DetailBuy = ({ book_id }) => {

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState(1);
    const [isBuy, setIsBuy] = useState(false);
    const [username, setUsername] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDrawerVisibleCart, setIsDrawerVisibleCart] = useState(false);
    const [isNextProFile, setIsNextProFile] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [isNext, setIsNext] = useState(false);
    const [count, setCount] = useState(1);

    const cartRef = useRef(null);

    const openDrawerCart = () => {
        setIsDrawerVisibleCart(true);
        // Optional: Reload the cart data when the drawer opens
        if (cartRef.current) {
            cartRef.current.reloadCart();
        }
    };

    const closeDrawerCart = () => {
        setIsDrawerVisibleCart(false);
    };
    useEffect(() => {
        // Check for the username in local storage
        const storedUsername = localStorage.getItem('userData');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLoginClick = () => {
        setIsModalVisible(true);
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('userData');
        setUsername(null);
    };
    const handleNextProFile = () => {
        setIsNextProFile(true);
    };
    const handleModalClose = () => {
        setIsModalVisible(false);
    };


    const fetchBookDetails = async () => {
        try {
            // Add a 2-second delay before loading book_id
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const bookId = localStorage.getItem("book_id");
            if (!bookId) {
                setError('Không tìm thấy mã sách');
                return;
            }

            const response = await axios.get(`http://localhost:8080/manager/book/detail/page?id=${bookId}`);
            if (response.data && response.data.body) {
                setBook(response.data.body);
            } else {
                setError('Không tìm thấy dữ liệu');
            }
        } catch (error) {
            setError('Lỗi khi lấy dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookDetails();
    }, [book_id]); // Ensure the book_id is properly defined

    useEffect(() => {
        fetchBookDetails();
    }, [book_id]);

    useEffect(() => {
        // Check for the username in local storage
        const storedUsername = JSON.parse(localStorage.getItem('userData'));

        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);


    const onChange = (currentSlide) => {
        console.log('Current slide:', currentSlide);
    };


    if (loading) return (
        <div className="loading-container">
            <Spin size="large" tip="Đang tải..." />
        </div>
    );

    if (error) return <div>{error}</div>;
    if (!book) return <div>Không có thông tin sách.</div>;

    const increment = () => {
        setItems(prevItems => prevItems + 1);
    };

    const decrement = () => {
        setItems(prevItems => Math.max(0, prevItems - 1)); // Đảm bảo items không giảm xuống dưới 0
    };
    const handleAddToCart = async () => {
        if (!username) {
            message.error('Bạn cần đăng nhập để thêm vào giỏ hàng');
            return;
        }
        const bookId = localStorage.getItem('book_id')
        const result = await addToCart(bookId, items);

        if (result.success) {
            message.success('Sách đã được thêm vào giỏ hàng');
        } else {
            message.error(result.message || 'Có lỗi xảy ra khi thêm sách vào giỏ hàng');
        }
    };

    const handleNextSubmitBuy = () => {
        setIsBuy(true);
        initOrder();
    }

    const handleMenuClick = (e) => {
        const selectedAuthor = authors.find(author => author.id === parseInt(e.key, 10));
        if (selectedAuthor) {
            setSelectedAuthor(selectedAuthor);
            setIsNext(true);
        }
    };


    const menu = (
        <Menu onClick={handleMenuClick}>
            {authors.map(author => (
                <Menu.Item key={author.id}>
                    {author.name}
                </Menu.Item>
            ))}
        </Menu>
    );

    const initOrder = async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const customerName = userData ? userData.user_name : '';
        const orderId = localStorage.getItem('order_id') || 0;
        const bookId = localStorage.getItem("book_id");
        const formData = new FormData();
        formData.append('customer_name', customerName);
        formData.append('book_id', bookId); // Ensure book_id is a string
        formData.append('quantity', items.toString()); // Ensure quantity is a string
        formData.append('order_id', orderId);

        try {
            const response = await axios.post('http://127.0.0.1:8080/manager/order/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.code === 0) {
                localStorage.setItem('order_id', response.data.body);
            }
        } catch (error) {
            message.error('error server');
        }
    }


    if (isBuy) {
        return (
            <SubmitBuyBook />
        )
    }
    const handlerGoBack = () => {
        window.location.reload()
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div>
            <Row>
                <Col xs={6} sm={6} md={6} lg={6} xl={6} className={styleDetail['col-container']}>
                    {/* Viền */}
                    coll
                </Col>

                <Col style={{ background: 'white' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div style={{ display: 'flex' }}>

                        <div style={{
                            width: '400px',
                            height: '500px',
                            border: '2px gray solid',
                            paddingLeft: '20px',
                            paddingTop: '40px',
                            paddingRight: '20px'
                        }} className="slider-container">
                            <Slider {...settings}>
                                {book.files.map((item, index) => (
                                    <div>
                                        <Image key={index} src={item} width={400} />
                                    </div>
                                ))}

                            </Slider>
                        </div>

                        <div>
                            <div
                                style={{ color: 'black', font: 'bold 30px Arial', paddingTop: '70px', paddingLeft: '40px' }}
                            >
                                {book.title}đ
                            </div>
                            <div
                                style={{ color: 'gray', fontSize: '19px', font: 'bold 22px Arial', paddingTop: '20px', paddingLeft: '40px' }}
                            >
                                Tác giả :<span style={{ color: 'black', fontSize: '17px', fontWeight: 'bold' }}>
                                    {book.author_name}
                                </span>
                            </div>

                            <div className={styleDetail.priceContainer}>
                                <span className={styleDetail.currentPrice}>{book.price}đ</span>
                                <span className={styleDetail.originalPrice}>{book.price - book.price * (book.dimensions / 100)}đ</span>
                                {book.discount_price && (
                                    <span style={{ marginLeft: '40px', font: 'bold 30px Arial', color: 'red' }} className={book.price - book.price * (book.dimensions / 100)}>-{book.discount_price}%</span>
                                )}
                            </div>

                            <Space>
                                <div style={{ marginLeft: '38px', marginTop: '20px' }}>
                                    <button
                                        style={{ background: 'white' }}
                                        onClick={() => setCount(count - 1)}
                                        disabled={count === 1}
                                    >
                                        <MinusOutlined />
                                    </button>
                                    <button style={{ backgroundColor: 'white', color: 'black' }}>
                                        {count}
                                    </button>
                                    <button
                                        style={{ background: 'white', marginRight: '20px' }}
                                        onClick={() => setCount(count + 1)}
                                        disabled={count === book.quantity}
                                    >
                                        <PlusOutlined />
                                    </button>
                                    còn lại trong kho :{book.quantity}
                                </div>

                            </Space>

                            <div style={{ marginTop: '50px', marginLeft: '40px' }}>
                                <Space>
                                    <Button>
                                        Mua ngay
                                    </Button>
                                    <Button>
                                        thêm vào giỏ hàng
                                    </Button>
                                </Space>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs={6} sm={6} md={6} lg={6} xl={6} className={styleDetail['col-container']}>
                    {/* Viền */}
                    coll
                </Col>
            </Row>
        </div>


    );
};

export default DetailBuy;
