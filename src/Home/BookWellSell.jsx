import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Image, Row, Typography } from 'antd';
import axios from 'axios';
import { MdSell } from 'react-icons/md';

const { Meta } = Card;
const { Title } = Typography;

const BookWellSell = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Fetch data từ API
        axios.get('http://localhost:8080/manager/book/sell/well')
            .then(response => {
                if (response.data && response.data.body && response.data.body.books) {
                    setBooks(response.data.body.books);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>5 Sản phẩm bán chạy <MdSell /></Title> {/* Tiêu đề tiếng Việt */}
            <Row gutter={16} justify="space-between">
                {books.map(book => (
                    <Col span={4} key={book.id} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card
                            hoverable
                            cover={
                                <Image
                                    alt={book.title}
                                    src={book.file_desc_first || 'http://placehold.it/300x400'}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            }
                            style={{
                                width: '250px',
                                height: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '2px solid green'  // Thêm viền màu xanh lá cây
                            }}
                        >
                            <Meta
                                title={book.title}
                            />
                            {/* Đặt phần mô tả bên ngoài Meta */}
                            <div style={{ marginTop: '10px' }}>
                                <p><strong>Tác giả:</strong> {book.author_name}</p>
                                <p><strong>Nhà xuất bản:</strong> {book.publisher}</p>
                                <p><strong>Giá:</strong> ${book.price}</p>
                                <p><strong>Số lượng:</strong> {book.stock}</p>
                            </div>
                            <Button type="primary" style={{ marginTop: '20px' }}>Xem chi tiết</Button>
                        </Card>
                    </Col>
                ))}
            </Row>

        </div>
    );
};

export default BookWellSell;
