import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { IoReturnUpBackOutline } from 'react-icons/io5'; // Import the icon
import './index_utils.css'; // Ensure this file is correctly imported

const { Title, Text, Link } = Typography;

const Footer = () => {
    // Define the go back handler function
    const onGoBack = () => {
        window.history.back(); // Navigate to the previous page
    };

    return (
        <div className='footer-home-page' style={{ marginTop:'285px', padding: '16px', backgroundColor: '#f5f5f5', borderTop: '1px solid #dcdcdc' }}>
            <Row justify="center" align="middle" style={{ marginBottom: '16px' }}>
                <Col span={24}>
                 
                </Col>
            </Row>
            <Row justify="space-evenly" align="top">
                <Col span={5} className='footer-col-home-page'>
                    <Title level={4}>Thông tin</Title>
                    <ul>
                        <li><Link href="/about" target="_blank">Giới thiệu</Link></li>
                        <li><Link href="/contact" target="_blank">Liên hệ</Link></li>
                        <li><Link href="/faq" target="_blank">Câu hỏi thường gặp</Link></li>
                        <li><Link href="/returns" target="_blank">Chính sách đổi trả</Link></li>
                    </ul>
                </Col>
                <Col span={5} className='footer-col-home-page'>
                    <Title level={4}>Dịch vụ khách hàng</Title>
                    <ul>
                        <li><Link href="/support" target="_blank">Hỗ trợ khách hàng</Link></li>
                        <li><Link href="/shipping" target="_blank">Giao hàng</Link></li>
                        <li><Link href="/payment" target="_blank">Phương thức thanh toán</Link></li>
                    </ul>
                </Col>
                <Col span={5} className='footer-col-home-page'>
                    <Title level={4}>Kết nối với chúng tôi 6666</Title>
                    <ul>
                        <li><Link href="https://facebook.com" target="_blank">Facebook</Link></li>
                        <li><Link href="https://twitter.com" target="_blank">Twitter</Link></li>
                        <li><Link href="https://instagram.com" target="_blank">Instagram</Link></li>
                    </ul>
                </Col>
                <Col span={5} className='footer-col-home-page'>
                    <Title level={4}>Thông tin liên hệ</Title>
                    <Text>Hưng Hà Thái Bình, Việt Nam</Text><br />
                    <Text>Email: contact@bookstore.vn</Text><br />
                    <Text>Điện thoại: +84 123 456 789</Text>
                </Col>
            </Row>
            <div className='footer-bottom-home-page' style={{ textAlign: 'center', marginTop: '16px' }}>
                <Text>© 2024 Sách Việt Nam. Bảo lưu mọi quyền.</Text>
            </div>
        </div>
    );
};

export default Footer;
