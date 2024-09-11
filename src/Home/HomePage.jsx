import React, { useState, useEffect, useRef } from 'react';
import './home_index.module.css';
import { FcHome } from 'react-icons/fc';
import { Button, Card, Col, Drawer, Dropdown, Image, Input, Menu, message, Modal, Row, Spin, Tooltip, Typography } from 'antd';
import Login from '../common/Login';
import { CiLogin, CiSearch } from 'react-icons/ci';
import { GiArmoredBoomerang } from 'react-icons/gi';
import BookWellSell from './BookWellSell';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Cookies from 'js-cookie';  // Import js-cookie
import axios from 'axios';
import { MdSell } from 'react-icons/md';
import { FaRegHeart, FaHeart } from 'react-icons/fa';  // Import FaHeart for the filled heart icon
import DetailBuy from './DetailBuy';
import ListBookHome from './ListBookHome';
import ProFile from '../user/Profile';
import ListCart from '../user/ListCart';
import { CgProfile } from 'react-icons/cg';
import Link from 'antd/es/typography/Link';
import './index.module.css';
import ChatBot from '../ChatBot/ChatBot';
import ListPublicSher from './ListPublicSher';
import AuthorBook from './AuthorBook';
import SliderCard from '../Test/Pages2';
const { Meta } = Card;
const { Title, Text } = Typography;

function HomePage() {
    const [username, setUsername] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isNextBuy, setIsNextBuy] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);  // Add state to manage selected book ID
    const [authors, setAuthors] = useState([]);
    const [isNext, setIsNext] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isNextProFile, setIsNextProFile] = useState(false);
    const [books, setBooks] = useState([]);
    const [likedBooks, setLikedBooks] = useState({});  // State to store liked status for each book
    const [isDrawerVisibleCart, setIsDrawerVisibleCart] = useState(false);
    const [isNextBuyWell, setIsNextBuyWell] = useState(false);
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
    //


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
    const handleBuyNow = (bookId) => {
        setSelectedBookId(bookId);
        setIsNextBuy(true);
        localStorage.setItem("book_id", bookId);
    };
    // Function to fetch the list of authors
    const fetchAuthors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/type_book/list');
            console.log('Response data:', response.data); // Debugging
            if (response.data.code === 0) {
                setAuthors(response.data.body);
            } else {
                message.error('Failed to fetch authors');
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
            message.error('Error fetching authors');
        } finally {
            setLoading(false);
        }
    };


    // Fetch authors when the component mounts
    useEffect(() => {
        fetchAuthors();
    }, []);

    // Create Menu items for Dropdown with custom styles

    useEffect(() => {
        fetchAuthors();
    }, []);

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

    if (isNext && selectedAuthor) {
        return <ListBookHome nameTypeBook={selectedAuthor.name} />;
    }


    if (isNextBuy) {
        return <DetailBuy book_id={selectedBookId} />;
    }

    if (isNextProFile) {
        return <ProFile />
    }

    if(isNextBuyWell) {
        return <DetailBuy book_id={selectedBookId}/>
    }
    //
    return (
        <div className='layout-home'>
            <div className='layout-header'>
                <div className='layout-header-start'>
                    <div className='icon-container'>
                        <GiArmoredBoomerang className='icon' />
                        <span className='text'>TS Shop</span>
                    </div>
                </div>
                <div className='layout-header-center'>
                    <ul>
                        <li onClick={() => window.location.reload()}><FcHome />Trang chủ</li>
                        <li>Tin sách</li>
                        <li>
                            {loading ? (
                                <Spin tip="Loading authors..." />
                            ) : (
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <Button style={{ border: 'none', marginTop: '-10px' }}>
                                        Thư viện sách
                                    </Button>
                                </Dropdown>
                            )}
                        </li>
                        <li>Tác giả</li>
                        <li>Cuộc thi</li>
                        <li>Thông tin cửa hàng</li>
                        <li className='search-container'>
                            <Input placeholder='Tìm kiếm ...' />
                            <Button><CiSearch /></Button>
                        </li>
                        <li className='user-actions'>
                            {username ? (
                                <>
                                    <Button onClick={handleLogoutClick}>Đăng xuất</Button>
                                    <Button onClick={handleNextProFile}><CgProfile /></Button>
                                </>
                            ) : (
                                <>
                                    <Tooltip title="Đăng nhập">
                                        <CiLogin style={{ fontSize: '20px', cursor: 'pointer' }} onClick={handleLoginClick} />
                                    </Tooltip>
                                    <Modal
                                        title="Đăng nhập"
                                        visible={isModalVisible}
                                        onCancel={handleModalClose}
                                        footer={null}
                                        width={350}
                                    >
                                        <Login />
                                    </Modal>
                                </>
                            )}
                        </li>
                        <li>
                            {username && (
                                <Tooltip title="Giỏ hàng">
                                    <AiOutlineShoppingCart className='cart-icon' onClick={openDrawerCart} />
                                    <Drawer
                                        title="Giỏ hàng của bạn"
                                        placement="right"
                                        onClose={closeDrawerCart}
                                        visible={isDrawerVisibleCart}
                                        width={800}
                                    >
                                        <ListCart ref={cartRef} />
                                    </Drawer>
                                </Tooltip>
                            )}
                        </li>
                    </ul>
                </div>
            </div>

            <div className='layout-content'>

                <div className='layout-content-image'>
                    <Image width='30%' src='https://th.bing.com/th/id/OIG2.gBo1U.SuIE.iiAHhpJnI?w=1024&h=1024&rs=1&pid=ImgDetMain' />
                </div>
            </div>

            <span>
                <ChatBot />
            </span>

            <div className="layout-footer">

                <div className='layout-footer-tac-gia'>
                    <span style={{display:'flex',marginLeft:'10px'}}>
                    <h1>Tác giả</h1>
                    </span>
                <AuthorBook/>
                </div>

                <div className='layout-footer-list-bool-well-sell'>
                    <div style={{ padding: '20px' }}>
                        <Title level={2}>Top Sản phẩm bán chạy <MdSell /></Title>
                      <SliderCard/>

                    </div>
                </div>
                <div className='layout-footer-list-bool-well-sell'>
                    {/* <BookWellSell title={'Sắp xuất bản'} onEventClick={() => setIsNextBuyWell(true)}/> */}
                    <Title level={2}>Sách sắp xuất bản</Title>
                    <SliderCard/>
                </div>

                <div className='layout-footer-nhaf-xuatban'>
                    <h3>Nhà xuất bản</h3>
                        <ListPublicSher/>
                </div>

                <span>

                    <div className='footer-home-page'>
                        <Row justify="space-evenly" align="middle">
                            <Col span={4} className='footer-col-home-page'>
                                <Title level={4}>Thông tin</Title>
                                <ul>
                                    <li><Link href="/about" target="_blank">Giới thiệu</Link></li>
                                    <li><Link href="/contact" target="_blank">Liên hệ</Link></li>
                                    <li><Link href="/faq" target="_blank">Câu hỏi thường gặp</Link></li>
                                    <li><Link href="/returns" target="_blank">Chính sách đổi trả</Link></li>
                                </ul>
                            </Col>
                            <Col span={4} className='footer-col-home-page'>
                                <Title level={4}>Dịch vụ khách hàng</Title>
                                <ul>
                                    <li><Link href="/support" target="_blank">Hỗ trợ khách hàng</Link></li>
                                    <li><Link href="/shipping" target="_blank">Giao hàng</Link></li>
                                    <li><Link href="/payment" target="_blank">Phương thức thanh toán</Link></li>
                                </ul>
                            </Col>
                            <Col span={4} className='footer-col-home-page'>
                                <Title level={4}>Kết nối với chúng tôi</Title>
                                <ul>
                                    <li><Link href="https://facebook.com" target="_blank">Facebook</Link></li>
                                    <li><Link href="https://twitter.com" target="_blank">Twitter</Link></li>
                                    <li><Link href="https://instagram.com" target="_blank">Instagram</Link></li>
                                </ul>
                            </Col>
                            <Col span={4} className='footer-col-home-page'>
                                <Title level={4}>Thông tin liên hệ</Title>
                                <Text>Hưng Hà Thái Bình, Việt Nam</Text><br />
                                <Text>Email: contact@bookstore.vn</Text><br />
                                <Text>Điện thoại: +84 123 456 789</Text>
                            </Col>
                        </Row>
                        <div className='footer-bottom-home-page'>
                            <Text>© 2024 Sách Việt Nam. Bảo lưu mọi quyền.</Text>
                        </div>
                    </div>

                </span>


            </div>

        </div>
    );
}

export default HomePage;
