import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Spin, Card, Typography, message, Image, Button, Modal, Dropdown, Menu, Input, Tooltip, Row, Drawer, Space, Col } from 'antd';
import './index.module.css';
import Cookies from 'js-cookie';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import DetailBuy from './DetailBuy';
import Login from '../common/Login';
import { GiArmoredBoomerang } from 'react-icons/gi';
import { FcHome } from 'react-icons/fc';
import { CiLogin, CiSearch } from 'react-icons/ci';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import './home_index.module.css';
import ListCart from '../user/ListCart';
import { PiSortAscendingFill } from 'react-icons/pi';
import CountryFilter from '../common/CountryFilter';
import Link from 'antd/es/typography/Link';
import styles from './index_header.module.css';
import { CgProfile } from 'react-icons/cg';
import FooterHeader from '../Utils/FooterHeader';

const { Title, Text } = Typography;

const { Meta } = Card;

function ListBookHome({ nameTypeBook }) {
    const [books, setBooks] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedBooks, setLikedBooks] = useState({});
    const [selectedBookId, setSelectedBookId] = useState(null);  // Add state to manage selected book ID
    const [isNextBuy, setIsNextBuy] = useState(false);
    const [authors, setAuthors] = useState([]);
    const [isNext, setIsNext] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [username, setUsername] = useState(null);
    const [orderDesc, setOrderDesc] = useState('');
    const [orderAsc, setOrderAsc] = useState('');
    const [selectedSort, setSelectedSort] = useState(null); // Save the selected sort option
    const [isDrawerVisibleCart, setIsDrawerVisibleCart] = useState(false);
    const [isNextProFile, setIsNextProFile] = useState(false);

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
    const handleCountryFilterChange = (selectedCountries) => {
        // Update your book list based on the selected countries
        // This might involve calling your API with the new filter
        console.log('Selected countries:', selectedCountries);
    };
    // Function to fetch books data
    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Construct query params based on the active sort order
            const params = new URLSearchParams();
            params.append('name', nameTypeBook);
            if (orderDesc) {
                params.append('desc', orderDesc);
            }
            if (orderAsc) {
                params.append('asc', orderAsc);
            }

            const response = await axios.get(`http://127.0.0.1:8080/manager/book/list/type_book?${params.toString()}`);
            if (response.data.code === 0) {
                setBooks(response.data.body.book_detail_list || []);
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

    useEffect(() => {
        // Check for the username in local storage
        const storedUsername = localStorage.getItem('userData');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    // Load liked books from cookies
    const loadLikedBooks = () => {
        const liked = Cookies.get('likedBooks');
        if (liked) {
            setLikedBooks(JSON.parse(liked));
        }
    };
    const handleLogoutClick = () => {
        // Clear the username from local storage
        localStorage.removeItem('username');
        setUsername(null);
    };
    const handleModalClose = () => {
        setIsModalVisible(false);
    };
    const handleNextProFile = () => {
        setIsNextProFile(true);
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
    const handleLoginClick = () => {
        setIsModalVisible(true);
    };
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

    const handleOrderDesc = () => {
        setOrderDesc('1');
        setOrderAsc('');
        fetchBooks();
        setSelectedSort('1')

    }
    const handleOrderAsc = () => {
        setOrderAsc('2');
        setOrderDesc('');
        fetchBooks();
        setSelectedSort('2')
    }

    if (loading) {
        return <Spin tip="Loading books..." />;
    }

    if (error) {
        return <Typography.Text type="danger">{error}</Typography.Text>;
    }


    if (isNext && selectedAuthor) {
        return <ListBookHome nameTypeBook={selectedAuthor.name} />;
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            {authors.map(author => (
                <Menu.Item key={author.id}>
                    {author.name}
                </Menu.Item>
            ))}
        </Menu>
    );
    if (books.length === 0) {

        return <div>
            <Typography.Text>Chưa có sách nào.</Typography.Text>;
        </div>
    }
    if (isNextBuy) {
        return <DetailBuy book_id={selectedBookId} />;
    }
    return (
        <div>

            <div className={styles.layoutHeader}>
                <div className={styles.layoutHeaderStart}>
                    <div className={styles.iconContainer}>
                        <GiArmoredBoomerang className={styles.icon} />
                        <span className={styles.text}>TS Shop</span>
                    </div>
                </div>
                <div className={styles.layoutHeaderCenter}>
                    <ul>
                        <li onClick={() => window.location.reload()}>
                            <FcHome />Trang chủ
                        </li>
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
                        <li className={styles.searchContainer}>
                            <Input
                                placeholder='Tìm kiếm ...'
                                className={styles.searchInput}
                            />
                            <Button className={styles.searchButton}>
                                <CiSearch className="icon" />
                            </Button>
                        </li>
                        <li className={styles.userActions}>
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
                                    <AiOutlineShoppingCart className={styles.cartIcon} onClick={openDrawerCart} />
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

            <div className='order-monoi'>
                <Space style={{ background: '#F5F5F5', padding: '20px', width: '700px', justifyContent: 'end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: '300', color: '#333' }}>
                        <PiSortAscendingFill style={{ fontSize: '20px', marginRight: '8px', color: '#1890ff' }} />
                        Sắp xếp theo
                    </div>
                    <Button

                        type={selectedSort === '1' ? 'primary' : 'default'}
                        onClick={handleOrderDesc}
                        style={{ marginLeft: '10px', fontSize: '16px', fontWeight: '500' }}
                    >
                        Giá thấp đến cao
                    </Button>
                    <Button
                        type={selectedSort === '2' ? 'primary' : 'default'}
                        onClick={handleOrderAsc}
                        style={{ marginLeft: '10px', fontSize: '16px', fontWeight: '500' }}
                    >
                        Giá cao đến thấp
                    </Button>
                    //nhap gia tu bao nhiue den bao nhieu
                </Space>
            </div>

            <Row>
                <Col span={6} pull={18}>
                    <div className='list-check-box'>
                        <h1 style={{ color: 'green', width: '200px' }}>Quốc gia</h1>
                        <CountryFilter onFilterChange={handleCountryFilterChange} />
                    </div>
                </Col>
                <Col style={{ marginLeft: '50px' }} span={18} push={6}>
                    <div className='box'>

                        {books.map((item) => (
                            <div className='done' key={item.book.id} style={{ marginLeft: '30px', marginRight: '10px' }}>
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
                                    <div style={{ justifyContent: 'space-between' }}>
                                        <div style={{ paddingLeft: '10px' }}>
                                            {truncateText(item.book.title, 20)}
                                        </div>
                                        <div style={{ paddingLeft: '10px' }}>
                                            {item.book.price} VND
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5px' }}>
                                        <Button onClick={() => handleBuyNow(item.book.id)} style={{ background: 'red', color: 'white', fontSize: '17px' }}>
                                            Mua ngay
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>

          <FooterHeader/>
        </div>

    );
}

export default ListBookHome;
