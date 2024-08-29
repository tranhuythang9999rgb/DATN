import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Image, Row, Typography, Rate, Button, Input, Tooltip, Modal } from 'antd';
import { FaUser, FaBookOpen, FaCalendarAlt, FaBarcode, FaLanguage, FaFileAlt, FaRulerCombined, FaWeightHanging, FaDollarSign, FaPercent, FaBoxes, FaStickyNote, FaStar, FaShoppingCart } from 'react-icons/fa';
import './home_index.css';
import { CgAdd } from 'react-icons/cg';
import { FcHome } from 'react-icons/fc';
import { GiArmoredBoomerang } from 'react-icons/gi';
import { CiLogin, CiSearch } from 'react-icons/ci';
import Login from '../common/Login';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const { Title, Text, Paragraph } = Typography;

const DetailBuy = ({ book_id }) => {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Image
                        src={book.files && book.files[0]}
                        alt={book.title}
                        style={{ width: '100%', borderRadius: bookThemeStyles.borderRadius }}
                    />

                    <Row style={{ display:'flex',marginTop: '300px' }}>
                        <Col span={24}>
                            <Paragraph>
                                <Card
                                    style={{
                                        backgroundColor: bookThemeStyles.cardBackground,
                                        borderRadius: bookThemeStyles.borderRadius,
                                        boxShadow: bookThemeStyles.boxShadow
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
                                    <DetailItem icon={<FaBoxes />} label="Tồn kho" value={book.stock} />
                                    <DetailItem icon={<FaStickyNote />} label="Ghi chú" value={book.notes} />
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

                <Col span={10}>
                    <Card
                        style={{
                            backgroundColor: bookThemeStyles.cardBackground,
                            borderRadius: bookThemeStyles.borderRadius,
                            boxShadow: bookThemeStyles.boxShadow,
                            padding: '16px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'start', fontSize: '30px', fontWeight: 'bold', marginBottom: '16px' }}>
                            <div>{book.title}</div>
                            <div style={{ display: 'flex', marginLeft: '400px' }}>
                                <Rate disabled defaultValue={5} />
                            </div>
                        </div>
                        <span style={{ display: 'flex', justifyContent: 'start', fontSize: '25px' }}>
                            <span>
                                <div>{book.price}<span style={{ fontSize: '10px' }}>VND</span></div>
                                <div>
                                    <CgAdd />
                                </div>
                                <div>
                                    <Button>Mua</Button>
                                </div>
                            </span>
                        </span>
                    </Card>
                </Col>

                <Col span={6}>
                    <Card title="Sách đề xuất" style={{ borderRadius: bookThemeStyles.borderRadius }}>
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
