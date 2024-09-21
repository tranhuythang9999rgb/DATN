import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Col, Drawer, Dropdown, Image, Input, Menu, message, Modal, Rate, Row, Space, Spin, Tooltip, Typography } from 'antd';
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
import BookWellSell from './BookWellSell';
import { TiArrowBackOutline } from 'react-icons/ti';
import HomePage from './HomePage';
const { Title, Text, Paragraph } = Typography;
//màn đì têu book

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
    const [backGohomePage, setBackGohomePage] = useState(false);

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
        initOrder();//
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
        try {
            // Fetch existing books from local storage
            const existingBooksJSON = localStorage.getItem('listbook');
            let existingBooks = existingBooksJSON ? JSON.parse(existingBooksJSON) : [];
    
            // Update the quantity of the current book
            book.quantity = count;
    
            // Check if the book already exists in the list
            const bookIndex = existingBooks.findIndex(b => b.id === book.id);
    
            if (bookIndex > -1) {
                // If book exists, update it
                existingBooks[bookIndex] = book;
            } else {
                // If book does not exist, add it
                existingBooks.push(book);
            }
    
            // Save the updated list back to local storage
            localStorage.setItem('listbook', JSON.stringify(existingBooks));
        } catch (error) {
            console.error('Error updating book list in local storage:', error);
        }
    };
    

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };



    if (isBuy) {
        return (
            <SubmitBuyBook />
        )
    }
   
    if(backGohomePage){
        return (
            <HomePage/>
        )
    }

    return (


        <div className={styleDetail.body}>
            <Row>
                <Col xs={6} sm={6} md={6} lg={6} xl={6} className={styleDetail['col-container']}>
                    {/* Viền */}
                    <div>
                    <TiArrowBackOutline onClick={()=>setBackGohomePage(true)} style={{fontSize:'30px'}} />
                    </div>
                </Col>

                <Col style={{ background: 'white' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div style={{ display: 'flex', padding: '20px' }}>

                        <div style={{
                            width: '400px',
                            height: '400px',
                            border: '2px solid gray',
                            borderRadius: '15px', // Rounded corners
                            padding: '20px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden', // Prevent overflow for rounded corners
                        }} className="slider-container">
                            <Slider {...settings}>
                                {book.files.map((item, index) => (
                                    <div key={index}>
                                        <Image src={item} width={400} style={{ borderRadius: '10px' }} /> {/* Rounded image */}
                                    </div>
                                ))}
                            </Slider>
                        </div>

                        <div style={{ paddingLeft: '40px', flex: 1 }}>

                            <Space>
                                <div style={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: '30px',
                                    paddingTop: '40px'
                                }}>
                                    {book.title}
                                </div>
                                <div style={{marginTop:'40px',marginLeft:'50px'}}>
                                    <Rate count={5}/>
                                </div>
                            </Space>

                            <div style={{
                                color: 'gray',
                                fontSize: '19px',
                                paddingTop: '20px'
                            }}>
                                Tác giả:
                                <span style={{
                                    color: 'black',
                                    fontSize: '17px',
                                    fontWeight: 'bold',
                                    paddingLeft: '10px'
                                }}>
                                    {book.author_name}
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '20px',
                                fontSize: '20px'
                            }}>
                                <span style={{
                                    color: 'red',
                                    fontWeight: 'bold',
                                    fontSize: '30px'
                                }}>
                                    {book.price}đ
                                </span>
                                <span style={{
                                    textDecoration: 'line-through',
                                    color: 'gray',
                                    marginLeft: '20px',
                                    fontSize: '22px'
                                }}>
                                    {book.price - book.price * (book.dimensions / 100)}đ
                                </span>
                                {book.discount_price && (
                                    <span style={{
                                        marginLeft: '40px',
                                        fontWeight: 'bold',
                                        fontSize: '25px',
                                        color: 'red'
                                    }}>
                                        -{book.discount_price}%
                                    </span>
                                )}
                            </div>

                            <div style={{
                                marginTop: '20px',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid lightgray', // Border around the quantity selector
                                borderRadius: '10px', // Rounded corners for the quantity selector
                                padding: '10px',
                            }}>
                                <Space>
                                    <button
                                        style={{
                                            background: 'white',
                                            border: '1px solid gray',
                                            padding: '5px 10px',
                                            borderRadius: '5px' // Button rounded corners 
                                        }}
                                        onClick={() => setCount(count - 1)}
                                        disabled={count === 1}
                                    >
                                        <MinusOutlined />
                                    </button>
                                    <button style={{
                                        backgroundColor: 'white',
                                        border: 'none',
                                        fontWeight: 'bold'
                                    }}>
                                        {count}
                                    </button>
                                    <button
                                        style={{
                                            background: 'white',
                                            border: '1px solid gray',
                                            padding: '5px 10px',
                                            borderRadius: '5px' // Button rounded corners
                                        }}
                                        onClick={() => setCount(count + 1)}
                                        disabled={count === book.quantity}
                                    >
                                        <PlusOutlined />
                                    </button>
                                </Space>
                                <span style={{ marginLeft: '20px' }}>
                                    Còn lại trong kho: {book.quantity}
                                </span>
                            </div>

                            <div style={{ marginTop: '50px' }}>
                                <Space>
                                    <Button
                                        onClick={handleNextSubmitBuy}
                                        type="primary"
                                        style={{
                                            padding: '10px 20px',
                                            fontSize: '16px',
                                            borderRadius: '10px',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                            backgroundColor: 'white', // Background color for "Mua ngay"
                                            color: 'green', // Text color for "Mua ngay"
                                            border: 'none', // Remove border for primary button
                                            width: '200px', // Increase width to be twice as wide
                                            height: '50px',
                                            border: '1px solid green',
                                            fontWeight: 'bold'

                                        }}
                                    >
                                        Mua ngay
                                    </Button>
                                    <Button
                                        onClick={handleAddToCart}
                                        type="default"
                                        style={{
                                            padding: '10px 20px',
                                            fontSize: '16px',
                                            borderRadius: '10px',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                            color: 'white', // Text color for "Thêm vào giỏ hàng"
                                            border: '2px solid #007BFF', // Border color for "Thêm vào giỏ hàng"
                                            backgroundColor: 'green', // Background color for "Thêm vào giỏ hàng"
                                            width: '200px', // Increase width to be twice as wide
                                            height: '50px',
                                            fontWeight: 'bold'

                                        }}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                </Space>

                            </div>
                        </div>
                    </div>

                    <div>
                        <div style={{
                            marginLeft: '20px',
                            marginTop: '10px',
                            color: '#28a745', // Green color
                            fontFamily: 'Arial, sans-serif', // Font family for cleaner appearance
                            fontWeight: 'bold', // Bold for emphasis
                            fontSize: '24px', // Increase font size for better visibility
                            letterSpacing: '1px', // Adds spacing between letters for a modern look
                        }}>
                            Giới thiệu sách
                        </div>

                        <Space>

                            <div
                                style={{
                                    marginTop: '60px',
                                    padding: '15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9f9f9',
                                    fontSize: '16px',
                                    lineHeight: '1.6',
                                    color: '#333',
                                    maxWidth: '800px',
                                    wordWrap: 'break-word', // Đảm bảo văn bản không bị cắt
                                }}
                            >
                                {book.description}
                            </div>
                            <div style={{ display: 'block', marginLeft: '20px' }}>

                                <div style={{ marginTop: '10px', fontFamily: 'Arial, sans-serif' }}>
                                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2D6A4F', marginBottom: '20px', textAlign: 'center' }}>
                                        Thông tin chi tiết
                                    </h2>
                                    <div style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '17px' }}>
                                            <tbody>
                                                {[
                                                    { label: "Tác giả", value: book.author_name },
                                                    { label: "Nhà xuất bản", value: book.publisher },
                                                    { label: "Kích thước", value: book.dimensions },
                                                    { label: "Số trang", value: book.page_count },
                                                    { label: "Ngày phát hành", value: book.published_date }
                                                ].map((item, index) => (
                                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#F8F8F8' : '#FFFFFF' }}>
                                                        <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#333', borderBottom: '1px solid #E0E0E0' }}>
                                                            {item.label}
                                                        </td>
                                                        <td style={{ padding: '12px 15px', color: '#555', borderBottom: '1px solid #E0E0E0' }}>
                                                            {item.value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>



                            </div>
                        </Space>

                    </div>

                    <div>
                        <div
                            style={{
                                marginLeft: '20px',
                                marginTop: '0px',
                                color: '#28a745', // Green color
                                fontFamily: 'Arial, sans-serif', // Font family for cleaner appearance
                                fontWeight: 'bold', // Bold for emphasis
                                fontSize: '24px', // Increase font size for better visibility
                                letterSpacing: '1px', // Adds spacing between letters for a modern look
                            }}
                        >
                            Có thể bạn cũng thích
                        </div>
                        <div>

                        </div>
                    </div>
                </Col>

                <Col xs={6} sm={6} md={6} lg={6} xl={6} className={styleDetail['col-container']}>
                    {/* Viền */}
                </Col>
            </Row>
        </div>


    );
};

export default DetailBuy;
