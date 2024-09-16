import React from 'react';
import { Col, Row, Avatar, Badge, Space, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './user_index.css';

const DEFAULT_IMAGE_URL = 'http://example.com/default-image.png'; // Thay đổi URL này thành URL hình ảnh mặc định của bạn
//cho cart
const ProductCard = ({ imageUrl, title, price, quantity, sell, onDelete }) => {
    const imageToDisplay = imageUrl ? imageUrl : DEFAULT_IMAGE_URL;

    return (
        <Row
            style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                height: '100px',
                padding: '10px',
                border: 'solid 1px pink',
                position: 'relative', // Để bố trí nút xóa
            }}
        >
            <Col
                span={6}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <Badge style={{ background: '#87CEFA' }} count={quantity}>
                    <Avatar
                        shape="square"
                        size={64}
                        src={imageToDisplay}
                        alt="Sản phẩm"
                    />
                </Badge>
            </Col>

            <Col span={18}>
                <Row>{title}</Row>
                <Row>
                    <Space>
                        <p style={{ marginTop: '25px' }}>Giảm {sell}% so với giá bìa (-72.000₫)</p>
                        <p
                            style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'green',
                                marginTop: '25px',
                                marginLeft: '20px',
                            }}
                        >
                            {price}
                        </p>
                    </Space>
                </Row>
            </Col>

            {/* Nút xóa ở góc trên bên phải */}
            <Button
                shape="circle"
                icon={<DeleteOutlined />}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: 'red',
                }}
                onClick={onDelete} // Gọi hàm xóa khi nhấn nút
            />
        </Row>
    );
};

export default ProductCard;
