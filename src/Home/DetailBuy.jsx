import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Image, Row, Typography, Button, Tooltip } from 'antd';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import { FaUser, FaBookOpen, FaCalendarAlt, FaBarcode, FaLanguage, FaFileAlt, FaRulerCombined, FaWeightHanging, FaDollarSign, FaPercent, FaBoxes, FaStickyNote } from 'react-icons/fa';
import { BiBookAlt } from 'react-icons/bi';

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

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!book) return <div>Không có thông tin sách.</div>;

    const DetailItem = ({ icon, label, value }) => (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            {icon}
            <Text strong style={{ marginLeft: '10px', marginRight: '5px' }}>{label}:</Text>
            <Text>{value}</Text>
        </div>
    );

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            <div>
                <Tooltip title="Quay lại">
                    <IoReturnUpBackOutline onClick={() => { window.location.reload() }} style={{ fontSize: '25px', cursor: 'pointer' }} />
                </Tooltip>
            </div>
            <Row gutter={16}>
                <Col span={8}>
                    <Image
                        alt={book.title}
                        src={book.files[0] || 'http://placehold.it/300x400'}
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                    <Card style={{ marginTop: '20px', borderRadius: '8px' }}>
                        <h2>Mô tả</h2>
                        <p>{book.description}</p>
                    </Card>
                </Col>
                <Col span={16}>
                    <Card
                        style={{ padding: '20px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '0' }}
                    >
                        <Title level={4}>{book.title}</Title>
                        <Row gutter={[16, 16]}>
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