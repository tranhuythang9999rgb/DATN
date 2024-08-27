import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Image, Row, Typography } from 'antd';
import axios from 'axios';
import { MdSell } from 'react-icons/md';
import { FaShoppingCart } from 'react-icons/fa';

const { Meta } = Card;
const { Title } = Typography;

const BookWellSell = ({title}) => {
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
            <Title level={2}>{title}<MdSell /></Title> {/* Tiêu đề tiếng Việt */}
            <Row gutter={16} justify="space-between">
                {books.map(book => (
                    <Col span={4} key={book.id} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card
                            hoverable
                            cover={
                                <Image
                                    alt={book.title}
                                    src={book.file_desc_first || 'http://placehold.it/300x400'}
                                    style={{ height: '200px', objectFit: 'cover',width:'220px' }}
                                />
                            }
                            style={{
                                width: '300px',
                                height: '450px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Meta
                                title={book.title}
                            />
                            <div style={{ marginTop: '10px' }}>
                                <p><strong>Tác giả:</strong> {book.author_name}</p>
                                <p><strong>Nhà xuất bản:</strong> {book.publisher}</p>
                                <p><strong>Giá:</strong> ${book.price}</p>
                                <p><strong>Số lượng:</strong> {book.stock}</p>
                            </div>
                           <span style={{display:'flex',marginLeft:'10px'}}>
                           <div >
                                <Button type="primary" style={{ marginTop: '10px',marginLeft:'25px' }}>Xem chi tiết</Button>
                                <Button style={{marginTop:'10px',backgroundColor:'red',color:'white',marginLeft:'10px'}}>Thêm vào  giỏ hàng</Button>
                            </div>
                           </span>
                        </Card>
                    </Col>
                ))}
            </Row>

        </div>
    );
};

export default BookWellSell;
