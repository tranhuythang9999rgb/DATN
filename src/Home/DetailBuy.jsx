import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Image, Row, Typography, Button } from 'antd';

const { Title, Text } = Typography;

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

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!book) {
        return <div>Không có thông tin sách.</div>;
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            <Title level={2}>{book.title}</Title>
            <Row gutter={16}>
                <Col span={8}>
                    <Image
                        alt={book.title}
                        src={book.files[0] || 'http://placehold.it/300x400'}
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                </Col>
                <Col span={16}>
                    <Card
                        style={{ padding: '20px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '0' }}
                    >
                        <Title level={4}>Chi tiết</Title>
                        <p><strong>Tác giả:</strong> <Text>{book.author_name}</Text></p>
                        <p><strong>Nhà xuất bản:</strong> <Text>{book.publisher}</Text></p>
                        <p><strong>Ngày xuất bản:</strong> <Text>{book.published_date}</Text></p>
                        <p><strong>ISBN:</strong> <Text>{book.isbn}</Text></p>
                        <p><strong>Thể loại:</strong> <Text>{book.genre}</Text></p>
                        <p><strong>Mô tả:</strong> <Text>{book.description}</Text></p>
                        <p><strong>Ngôn ngữ:</strong> <Text>{book.language}</Text></p>
                        <p><strong>Số trang:</strong> <Text>{book.page_count}</Text></p>
                        <p><strong>Kích thước:</strong> <Text>{book.dimensions}</Text></p>
                        <p><strong>Cân nặng:</strong> <Text>{book.weight} kg</Text></p>
                        <p><strong>Giá:</strong> <Text>{book.price} VND</Text></p>
                        <p><strong>Giá giảm:</strong> <Text>{book.discount_price} VND</Text></p>
                        <p><strong>Tồn kho:</strong> <Text>{book.stock}</Text></p>
                        <p><strong>Ghi chú:</strong> <Text>{book.notes}</Text></p>
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <Button
                                type="primary"
                                size="large"
                                style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
                                onClick={() => alert('Mua ngay')}
                            >
                                Mua ngay
                            </Button>
                        </div>
                    </Card>
                    <Row gutter={16} style={{ marginTop: '20px' }}>
                        {book.files.slice(1).map((file, index) => (
                            <Col span={8} key={index}>
                                <Image
                                    alt={`Hình ảnh sách ${index + 2}`}
                                    src={file}
                                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default DetailBuy;
