import React from 'react';
import { Row, Col, Typography } from 'antd';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import icons from react-icons
import Link from 'antd/es/typography/Link';
import styles from './index_footer.module.css';

const { Title, Text } = Typography;

const FooterHeader = () => {
  return (
    <footer className={styles['footer-home-page']}>
      <Row justify="space-evenly" align="middle">
        <Col xs={24} sm={12} md={6} className={styles['footer-col-home-page']}>
          <Title style={{display:'flex',marginTop:'10px'}} level={4}>Thông tin</Title>
          <ul>
            <li><Link to="/about">Giới thiệu</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
            <li><Link to="/returns">Chính sách đổi trả</Link></li>
          </ul>
        </Col>
        <Col xs={24} sm={12} md={6} className={styles['footer-col-home-page']}>
          <Title level={4}>Dịch vụ khách hàng</Title>
          <ul>
            <li><Link to="/support">Hỗ trợ khách hàng</Link></li>
            <li><Link to="/shipping">Giao hàng</Link></li>
            <li><Link to="/payment">Phương thức thanh toán</Link></li>
          </ul>
        </Col>
        <Col xs={24} sm={12} md={6} className={styles['footer-col-home-page']}>
          <Title level={4}>Kết nối với chúng tôi</Title>
          <ul className={styles['social-media-links']}>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /> Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /> Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a></li>
          </ul>
        </Col>
        <Col xs={24} sm={12} md={6} className={styles['footer-col-home-page']}>
          <Title level={4}>Thông tin liên hệ</Title>
          <Text>Hưng Hà Thái Bình, Việt Nam</Text><br />
          <Text>Email: contact@bookstore.vn</Text><br />
          <Text>Điện thoại: +84 123 456 789</Text>
        </Col>
      </Row>
      <div className={styles['footer-bottom-home-page']}>
        <Text>© 2024 Sách Việt Nam. Bảo lưu mọi quyền.</Text>
      </div>
    </footer>
  );
};

export default FooterHeader;
