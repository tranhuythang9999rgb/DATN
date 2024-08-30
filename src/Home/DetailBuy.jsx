import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Image, Row, Typography, Rate, Button, Input, Tooltip, Modal, Carousel } from 'antd';
import { FaUser, FaBookOpen, FaCalendarAlt, FaBarcode, FaLanguage, FaFileAlt, FaRulerCombined, FaWeightHanging, FaDollarSign, FaPercent, FaBoxes, FaStickyNote, FaStar, FaShoppingCart } from 'react-icons/fa';
import './home_index.css';
import { CgAdd } from 'react-icons/cg';
import { FcHome } from 'react-icons/fc';
import { GiArmoredBoomerang } from 'react-icons/gi';
import { CiLogin, CiSearch } from 'react-icons/ci';
import Login from '../common/Login';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BiMinusCircle } from 'react-icons/bi';
import { FaCartShopping } from 'react-icons/fa6';

const { Title, Text, Paragraph } = Typography;

const DetailBuy = ({ book_id }) => {

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState(0);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/manager/book/detail/page?id=${book_id}`);
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

        fetchBookDetails();
    }, [book_id]);
    const [username, setUsername] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);


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
    const onChange = (currentSlide) => {
        console.log('Current slide:', currentSlide);
    };
    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!book) return <div>Không có thông tin sách.</div>;

    const DetailItem = ({ icon, label, value }) => (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            {React.cloneElement(icon, { style: { color: '#8B4513', marginRight: '10px' } })}
            <Text strong style={{ marginRight: '5px', color: '#4A4A4A' }}>{label}:</Text>
            <Text style={{ color: '#6B6B6B' }}>{value}</Text>
        </div>
    );

    const bookThemeStyles = {
        mainBackground: '#F5F5DC',
        cardBackground: '#FFFFFF',
        primaryColor: '#8B4513',
        secondaryColor: '#D2691E',
        textPrimary: '#4A4A4A',
        textSecondary: '#6B6B6B',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    };

    const recommendedBooks = [
        { id: 1, title: "The Great Adventure", author: "Jane Doe", rating: 4.5 },
        { id: 2, title: "Mystery of the Old Manor", author: "John Smith", rating: 4.2 },
        { id: 3, title: "Cooking with Love", author: "Maria Garcia", rating: 4.8 },
        { id: 4, title: "Mystery of the Old Manor", author: "John Smith", rating: 4.2 },
        { id: 5, title: "Cooking with Love", author: "Maria Garcia", rating: 4.8 },
        { id: 6, title: "Cooking with Love", author: "Maria Garcia", rating: 4.8 },
        { id: 7, title: "Mystery of the Old Manor", author: "John Smith", rating: 4.2 },
        { id: 8, title: "Cooking with Love", author: "Maria Garcia", rating: 4.8 },
    ];

    const increment = () => {
        setItems(prevItems => prevItems + 1);
    };

    const decrement = () => {
        setItems(prevItems => Math.max(0, prevItems - 1)); // Đảm bảo items không giảm xuống dưới 0
    };

    const RecommendedBook = ({ title, author, rating }) => (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Image
                src={`http://placehold.it/50x75`}
                alt={title}
                style={{ width: 50, marginRight: 10, borderRadius: '4px' }}
            />
            <div>
                <Text strong>{title}</Text>
                <br />
                <Text type="secondary">{author}</Text>
                <br />
                <Rate disabled defaultValue={rating} style={{ fontSize: '12px' }} />
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: bookThemeStyles.mainBackground, padding: '20px', borderRadius: bookThemeStyles.borderRadius }}>
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
            <Row style={{ display: 'flex', marginTop: '100px' }} gutter={[16, 16]}>
                <Col span={8}>

                    <Carousel afterChange={onChange} style={{ marginBottom: '20px' }}>
                        {book.files && book.files.map((item, index) => (
                            <div key={index}>
                                <Image
                                    src={item}
                                    alt={`Book Image ${index}`}
                                    style={{ width: '100%', borderRadius: bookThemeStyles.borderRadius }}
                                />
                            </div>
                        ))}
                    </Carousel>

                    <Row style={{ display: 'flex', marginTop: '50px' }}>
                        <Col span={24}>
                            <Paragraph>
                                <Card
                                    style={{
                                        backgroundColor: bookThemeStyles.cardBackground,
                                        borderRadius: bookThemeStyles.borderRadius,
                                        boxShadow: bookThemeStyles.boxShadow,
                                        height: '500px'
                                    }}
                                >
                                    <Title level={3} style={{ color: bookThemeStyles.primaryColor, display: 'flex', justifyContent: 'start' }}>Thông tin chi tiết sản phẩm</Title>
                                    <DetailItem icon={<FaUser />} label="Tác giả" value={book.author_name} />
                                    <DetailItem icon={<FaBookOpen />} label="Nhà xuất bản" value={book.publisher} />
                                    <DetailItem icon={<FaCalendarAlt />} label="Ngày xuất bản" value={book.published_date} />
                                    <DetailItem icon={<FaBarcode />} label="ISBN" value={book.isbn} />
                                    <DetailItem icon={<FaLanguage />} label="Ngôn ngữ" value={book.language} />
                                    <DetailItem icon={<FaFileAlt />} label="Số trang" value={book.page_count} />
                                    <DetailItem icon={<FaRulerCombined />} label="Kích thước" value={book.dimensions} />
                                    <DetailItem icon={<FaWeightHanging />} label="Trọng lượng" value={book.weight} />
                                    <DetailItem icon={<FaDollarSign />} label="Giá" value={book.price} />
                                    <DetailItem icon={<FaPercent />} label="Giá giảm" value={book.discount_price} />
                                    <DetailItem icon={<FaBoxes />} label="Số lượng" value={book.stock} />
                                </Card>
                            </Paragraph>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: '550px' }}>
                        <Col span={24}>
                            <Card style={{ backgroundColor: bookThemeStyles.cardBackground, borderRadius: bookThemeStyles.borderRadius, textAlign: 'center' }}>
                                <Text strong>Additional Information 22</Text>
                                <Paragraph>
                                    Here you can add some extra details, a brief summary, or any other content you want to display below the image.
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>

                </Col>

                <Col className='details-book' style={{ display: 'flex', marginTop: '40px' }} span={10}>
                    <Card
                        style={{
                            backgroundColor: bookThemeStyles.cardBackground,
                            borderRadius: bookThemeStyles.borderRadius,
                            boxShadow: bookThemeStyles.boxShadow,
                            padding: '16px',
                            width: '750px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'start', fontSize: '30px', fontWeight: 'bold', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', marginTop: '-25px' }}>{book.title}</div>
                            <div style={{ display: 'flex', marginLeft: '400px' }}>
                                <Rate disabled defaultValue={5} />
                            </div>
                        </div>

                        <div>
                            <Row>
                                <div style={{ fontSize: '30px' }}>{book.price}<span style={{ fontSize: '10px' }}>VND</span></div>
                            </Row>
                            <Row style={{
                                border: '1px solid',
                                width: '120px',
                                borderRadius: '10px'
                            }}>
                                <CgAdd
                                    onClick={increment}
                                    style={{ opacity: 0.7, cursor: 'pointer', fontSize: '30px' }} // Làm mờ icon và thêm con trỏ chuột khi hover
                                />
                                <div style={{ paddingLeft: '20px', paddingRight: '10px' }}>
                                    {items}
                                </div>
                                <BiMinusCircle
                                    onClick={decrement}
                                    style={{ opacity: 0.7, cursor: 'pointer', fontSize: '30px',marginLeft:'10px' }} // Làm mờ icon và thêm con trỏ chuột khi hover
                                />

                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Button style={{ marginLeft: '200px', height: '40px', width: '80px' }}>Mua</Button>
                                </Col>
                                <Col span={12}>
                                    <FaCartShopping style={{ marginLeft: '200px', height: '40px', width: '80px' }} />
                                </Col>
                            </Row>
                            <Row>
                                <p style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 3, // Số dòng tối đa bạn muốn hiển thị
                                    lineHeight: '1.5em', // Chiều cao dòng
                                    maxHeight: '4.5em', // Giới hạn chiều cao dựa trên số dòng
                                }}>
                                    {book.description}
                                </p>

                            </Row>

                        </div>
                    </Card>
                </Col>

                <Col span={6}>
                    <Card title="Sách đề xuất" style={{ borderRadius: bookThemeStyles.borderRadius, backgroundColor: 'white', height: 'auto' }}>
                        {recommendedBooks.map(book => (
                            <RecommendedBook key={book.id} title={book.title} author={book.author} rating={book.rating} />
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>

    );
};

export default DetailBuy;
