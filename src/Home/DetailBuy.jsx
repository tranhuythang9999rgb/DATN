import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Image, Row, Typography, Button, Tooltip, Layout, Menu, Rate } from 'antd';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import { FaUser, FaBookOpen, FaCalendarAlt, FaBarcode, FaLanguage, FaFileAlt, FaRulerCombined, FaWeightHanging, FaDollarSign, FaPercent, FaBoxes, FaStickyNote, FaHome, FaShoppingCart } from 'react-icons/fa';
import { BiBookAlt } from 'react-icons/bi';
import './home_index.css';

const { Title, Text, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

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
    ];

    const reviews = [
        { id: 1, user: "Alice", rating: 5, comment: "Absolutely loved this book! Couldn't put it down." },
        { id: 2, user: "Bob", rating: 4, comment: "Great read, highly recommended for fans of the genre." },
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

    const Review = ({ user, rating, comment }) => (
        <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <Text strong style={{ marginRight: '10px' }}>{user}</Text>
                <Rate disabled defaultValue={rating} style={{ fontSize: '12px' }} />
            </div>
            <Paragraph>{comment}</Paragraph>
        </div>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: bookThemeStyles.primaryColor, padding: '0 50px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                    <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 'bold' }}>
                        Bookstore
                    </div>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} style={{ background: 'transparent' }}>
                        <Menu.Item key="1" icon={<FaHome />} onClick={() => { window.location.reload() }}>Trang chủ</Menu.Item>
                        <Menu.Item key="2" icon={<FaShoppingCart />}>Giỏ hàng</Menu.Item>
                    </Menu>
                </div>
            </Header>

            <Content style={{ padding: '0 50px', marginTop: '20px' }}>
                <div style={{ background: bookThemeStyles.mainBackground, padding: '24px', minHeight: 280 }}>
                    <div>
                        <Tooltip title="Quay lại">
                            <IoReturnUpBackOutline
                                onClick={() => { window.location.reload() }}
                                style={{ fontSize: '25px', cursor: 'pointer', color: bookThemeStyles.primaryColor }}
                            />
                        </Tooltip>
                    </div>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Card
                                style={{
                                    marginBottom: '20px',
                                    borderRadius: bookThemeStyles.borderRadius,
                                    boxShadow: bookThemeStyles.boxShadow,
                                    backgroundColor: bookThemeStyles.cardBackground
                                }}
                                bodyStyle={{ padding: '0' }}
                            >
                                <Image
                                    alt={book.title}
                                    src={book.files[0] || 'http://placehold.it/300x400'}
                                    style={{ width: '100%', height: 'auto', borderRadius: `${bookThemeStyles.borderRadius} ${bookThemeStyles.borderRadius} 0 0` }}
                                />
                                <div style={{ padding: '20px' }}>
                                    <h2 style={{ color: bookThemeStyles.primaryColor }}>Mô tả</h2>
                                    <p style={{ color: bookThemeStyles.textSecondary }}>{book.description}</p>
                                </div>
                            </Card>
                            <div
                                style={{
                                    maxHeight: '500px',
                                    overflowY: 'auto',
                                    padding: '10px',
                                    backgroundColor: bookThemeStyles.cardBackground,
                                    borderRadius: bookThemeStyles.borderRadius,
                                    boxShadow: bookThemeStyles.boxShadow
                                }}
                            >
                                {book.files.slice(1).map((file, index) => (
                                    <Image
                                        key={index}
                                        alt={`Hình ảnh sách ${index + 2}`}
                                        src={file}
                                        style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '16px' }}
                                    />
                                ))}
                            </div>
                        </Col>
                        <Col span={10}>
                            <Card
                                style={{
                                    borderRadius: bookThemeStyles.borderRadius,
                                    boxShadow: bookThemeStyles.boxShadow,
                                    backgroundColor: bookThemeStyles.cardBackground
                                }}
                                bodyStyle={{ padding: '24px'}}
                            >
                                <Title level={3} style={{ color: bookThemeStyles.primaryColor, marginBottom: '24px' }}>{book.title}</Title>
                                <Row gutter={[24, 16]}>
                                    <Col span={12}>
                                        <DetailItem icon={<FaUser />} label="Tác giả" value={book.author_name} />
                                        <DetailItem icon={<FaBookOpen />} label="Nhà xuất bản" value={book.publisher} />
                                        <DetailItem icon={<FaCalendarAlt />} label="Ngày xuất bản" value={book.published_date} />
                                        <DetailItem icon={<FaBarcode />} label="ISBN" value={book.isbn} />
                                        <DetailItem icon={<BiBookAlt />} label="Thể loại" value={book.genre} />
                                        <DetailItem icon={<FaLanguage />} label="Ngôn ngữ" value={book.language} />
                                    </Col>
                                    <Col span={12}>
                                        <DetailItem icon={<FaFileAlt />} label="Số trang" value={book.page_count} />
                                        <DetailItem icon={<FaRulerCombined />} label="Kích thước" value={book.dimensions} />
                                        <DetailItem icon={<FaWeightHanging />} label="Cân nặng" value={`${book.weight} kg`} />
                                        <DetailItem icon={<FaDollarSign />} label="Giá" value={`${book.price} VND`} />
                                        <DetailItem icon={<FaPercent />} label="Giá giảm" value={`${book.discount_price} VND`} />
                                        <DetailItem icon={<FaBoxes />} label="Tồn kho" value={book.stock} />
                                    </Col>
                                </Row>
                                <DetailItem icon={<FaStickyNote />} label="Ghi chú" value={book.notes} />
                                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        style={{
                                            backgroundColor: bookThemeStyles.secondaryColor,
                                            borderColor: bookThemeStyles.secondaryColor,
                                            padding: '0 40px',
                                            height: '48px',
                                            fontSize: '18px',
                                            borderRadius: '24px'
                                        }}
                                        onClick={() => alert('Mua ngay')}
                                    >
                                        Mua ngay
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                style={{
                                    borderRadius: bookThemeStyles.borderRadius,
                                    boxShadow: bookThemeStyles.boxShadow,
                                    backgroundColor: bookThemeStyles.cardBackground,
                                    marginBottom: '20px'
                                }}
                                bodyStyle={{ padding: '16px' }}
                            >
                                <Title level={4} style={{ color: bookThemeStyles.primaryColor, marginBottom: '16px' }}>Recommended Books</Title>
                                {recommendedBooks.map(book => (
                                    <RecommendedBook key={book.id} {...book} />
                                ))}
                            </Card>
                            <Card
                                style={{
                                    borderRadius: bookThemeStyles.borderRadius,
                                    boxShadow: bookThemeStyles.boxShadow,
                                    backgroundColor: bookThemeStyles.cardBackground
                                }}
                                bodyStyle={{ padding: '16px' }}
                            >
                                <Title level={4} style={{ color: bookThemeStyles.primaryColor, marginBottom: '16px' }}>Customer Reviews</Title>
                                {reviews.map(review => (
                                    <Review key={review.id} {...review} />
                                ))}
                                <Button type="link" style={{ color: bookThemeStyles.secondaryColor, padding: 0 }}>
                                    See all reviews
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', background: bookThemeStyles.primaryColor, color: '#FFFFFF' }}>
                Bookstore ©2024 Created by Your Company
            </Footer>
        </Layout>
    );
};

export default DetailBuy;