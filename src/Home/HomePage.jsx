import React, { useState, useEffect, useRef } from 'react';
import './home_index.css';
import { FcHome } from 'react-icons/fc';
import { Avatar, Button, Card, Col, Drawer, Dropdown, Image, Input, Menu, message, Modal, Row, Select, Space, Spin, Tooltip, Typography } from 'antd';
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
import './index.css';
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

    //
    return (
        <div className='layout-home'>
            <div className='layout-header'>
                <div className='layout-header-start'>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <GiArmoredBoomerang
                            style={{ display: 'flex', marginLeft: '10px', color: 'green', fontSize: '100px' }}
                        />
                        <span
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'orange',
                                fontWeight: 'bold',
                                fontSize: '18px',
                            }}
                        >
                            TS Shop
                        </span>
                    </div>
                </div>
                <div className='layout-header-center'>
                    <ul>
                        <li style={{ cursor: 'pointer' }} onClick={() => window.location.reload()}><FcHome />Trang chủ</li>
                        <li>Tin sách</li>
                        <li style={{ cursor: 'pointer', listStyle: 'none' }}>
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
                        <li>
                            <div style={{ display: 'flex' }}>
                                <Input placeholder='Tìm kiếm ...' style={{ height: '30px' }} />
                                <Button style={{ height: '30px' }}><CiSearch />
                                </Button>
                            </div>
                        </li>
                        <li>
                            {username ? (
                                <Space>
                                    <Button style={{ border: 'none', fontSize: '17px' }} onClick={handleLogoutClick}>Đăng xuất</Button>
                                    <Button style={{ border: 'none', fontSize: '17px' }} onClick={handleNextProFile}><CgProfile /> </Button>
                                </Space>
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
                            {/* Giỏ hàng */}
                            {username ? (
                                <Tooltip title="Giỏ hàng">
                                    <AiOutlineShoppingCart
                                        style={{ fontSize: '20px', cursor: 'pointer' }}
                                        onClick={openDrawerCart}
                                    />

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
                            ) : null}
                        </li>

                    </ul>
                </div>

                <div className='layout-header-end'></div>
            </div>
            <div className='layout-content'>

                <div className='layout-content-image'>
                    <Image width='40%' src='https://th.bing.com/th/id/OIG2.gBo1U.SuIE.iiAHhpJnI?w=1024&h=1024&rs=1&pid=ImgDetMain' />
                </div>
                <div>

                </div>
            </div>



            <div className="layout-footer">

                <div className='layout-footer-tac-gia'>
                    <h1>Tác giả</h1>
                    {/* List of new book authors */}
                    <ul style={{ display: 'flex' }}>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://ndu.khanhhoa.edu.vn/upload/104934/fck/files/download.png'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Nguyễn Du </div>
                            </div>

                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://baotangvanhoc.vn/wp-content/uploads/2021/12/Nha-van-Nam-Cao.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Nam Cao</div>
                            </div>
                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://www.nxbtre.com.vn/Images/Writer/nxbtre_thumb_30552016_085555.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Nguyễn Nhật Ánh</div>
                            </div>
                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://www.thivien.net/attachment/vnduJD_TYrIrUDl9fyOqRw.1503720312.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Xuân Diệu</div>
                            </div>
                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://imagev3.vietnamplus.vn/w1000/Uploaded/2024/hotnnz/2024_05_30/huy-can4-9561.jpg.webp'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Huy Cận </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className='layout-footer-list-bool-well-sell'>
                    <div style={{ padding: '20px' }}>
                        <Title level={2}>Top Sản phẩm bán chạy <MdSell /></Title>
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
                                        <Meta title={book.title} />
                                        <div style={{ marginTop: '10px' }}>
                                            <p><strong>Giá:</strong> {book.price} VND</p>
                                        </div>
                                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                            <Button onClick={() => handleBuyNow(book.id)} style={{ background: 'red', color: 'white', fontSize: '17px' }}>
                                                Mua ngay
                                            </Button>

                                        </span>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
                <div className='layout-footer-list-bool-well-sell'>
                    <BookWellSell title={'Sắp xuất bản'} />
                </div>
                <div style={{ marginTop: '370px' }} className='layout-footer-nhaf-xuatban'>
                    <h3>Nhà xuất bản</h3>
                    {/* List of publishers */}
                    <ul style={{ display: 'flex' }}>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://www.thivien.net/attachment/vnduJD_TYrIrUDl9fyOqRw.1503720312.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Kim Đồng</div>
                            </div>
                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://www.thivien.net/attachment/vnduJD_TYrIrUDl9fyOqRw.1503720312.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Xuân Diệu</div>
                            </div>
                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://www.thivien.net/attachment/vnduJD_TYrIrUDl9fyOqRw.1503720312.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Xuân Diệu</div>
                            </div>
                        </li>
                        {/* Add more publishers as needed */}
                    </ul>
                </div>

                <span>

                    <div className='footer-home-page'>
                        <Row justify="space-evenly" align="middle">
                            <Col span={4} className='footer-col-home-page'>
                                <Title style={{display:'flex' ,justifyContent:'center'}} level={4}>Thông tin</Title>
                                <ul>
                                    <li><Link href="/about" target="_blank">Giới thiệu</Link></li>
                                    <li><Link href="/contact" target="_blank">Liên hệ</Link></li>
                                    <li><Link href="/faq" target="_blank">Câu hỏi thường gặp</Link></li>
                                    <li><Link href="/returns" target="_blank">Chính sách đổi trả</Link></li>
                                </ul>
                            </Col>
                            <Col span={4} className='footer-col-home-page'>
                                <Title style={{display:'flex' ,justifyContent:'center'}} level={4}>Dịch vụ khách hàng</Title>
                                <ul>
                                    <li><Link href="/support" target="_blank">Hỗ trợ khách hàng</Link></li>
                                    <li><Link href="/shipping" target="_blank">Giao hàng</Link></li>
                                    <li><Link href="/payment" target="_blank">Phương thức thanh toán</Link></li>
                                </ul>
                            </Col>
                            <Col span={4} className='footer-col-home-page'>
                                <Title style={{display:'flex' ,justifyContent:'center'}} level={4}>Kết nối với chúng tôi</Title>
                                <ul>
                                    <li><Link href="https://facebook.com" target="_blank">Facebook</Link></li>
                                    <li><Link href="https://twitter.com" target="_blank">Twitter</Link></li>
                                    <li><Link href="https://instagram.com" target="_blank">Instagram</Link></li>
                                </ul>
                            </Col>
                            <Col span={4} className='footer-col-home-page'>
                                <Title style={{display:'flex' ,justifyContent:'center',marginTop:'-3px'}} level={4}>Thông tin liên hệ</Title>
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
