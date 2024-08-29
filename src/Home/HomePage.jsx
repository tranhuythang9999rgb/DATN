import React, { useState, useEffect } from 'react';
import './home_index.css';
import { FcHome } from 'react-icons/fc';
import { Avatar, Button, Card, Col, Image, Input, Modal, Row, Tooltip, Typography } from 'antd';
import Login from '../common/Login';
import { CiLogin, CiSearch } from 'react-icons/ci';
import { GiArmoredBoomerang } from 'react-icons/gi';
import BookWellSell from './BookWellSell';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Cookies from 'js-cookie';  // Import js-cookie
import axios from 'axios';
import { MdSell } from 'react-icons/md';
import { FaRegHeart, FaHeart } from 'react-icons/fa';  // Import FaHeart for the filled heart icon
import { IoCartOutline } from 'react-icons/io5';
import DetailBuy from './DetailBuy';
const { Meta } = Card;
const { Title } = Typography;

function HomePage() {
    const [username, setUsername] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isNextBuy, setIsNextBuy] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);  // Add state to manage selected book ID

    useEffect(() => {
        // Check for the username in local storage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLoginClick = () => {
        setIsModalVisible(true);
    };

    const handleLogoutClick = () => {
        // Clear the username from local storage
        localStorage.removeItem('username');
        setUsername(null);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };
    //
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
    const handleBuyNow = (bookId) => {
        setSelectedBookId(bookId);
        setIsNextBuy(true);
    };

    if (isNextBuy) {
        return <DetailBuy book_id={selectedBookId} />;
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
                        <li><FcHome />Trang chủ</li>
                        <li>Tin sách</li>
                        <li>Thư viện sách</li>
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
                                <Button onClick={handleLogoutClick}>Đăng xuất</Button>
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
                                    >
                                        <Login />
                                    </Modal>
                                </>
                            )}
                        </li>
                        <li>
                            <Tooltip title="Giỏ hàng">
                                <AiOutlineShoppingCart style={{ fontSize: '20px' }} />
                            </Tooltip>
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
                <div className='layout-footer-nhaf-xuatban'>
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


                <div className='layout-footer-lien-he'>
                    <h3>Liên hệ</h3>
                    {/* Contact information or other footer content */}
                    <p>Email: thaonguyen@gmail.com</p>
                    <p>Phone: +123 456 789</p>
                    {/* Add more contact details as needed */}
                </div>
            </div>

        </div>
    );
}

export default HomePage;
