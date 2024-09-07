import React from 'react';
import { Row, Col, Typography, Menu, Button } from 'antd';
import { IoReturnUpBackOutline } from 'react-icons/io5';

const { Title } = Typography;

const Header = () => {
    return (
        <Row justify="space-between" align="middle" style={{ padding: '16px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #dcdcdc' }}>
            <Col>
                <Title level={3} style={{ margin: 0 }}></Title>
            </Col>
            <Col>
                <Menu mode="horizontal" style={{ lineHeight: '64px' }}>
                    <Menu.Item key="1">
                        <a href="/home" >Trang Chủ</a>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <a href="/products">Sản Phẩm</a>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <a href="/services">Dịch Vụ</a>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <a href="/about">Giới Thiệu</a>
                    </Menu.Item>
                    <Menu.Item key="5">
                        <a href="/contact">Liên Hệ</a>
                    </Menu.Item>
                </Menu>
            </Col>
           
        </Row>
    );
};

export default Header;
