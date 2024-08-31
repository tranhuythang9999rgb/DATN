import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Radio, Row, Select, Space, Typography, message, notification } from 'antd';
import DetailBuy from './DetailBuy';
import './home_index.css';
import { GrPaypal } from 'react-icons/gr';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import GetOrderById from './GetOrderById';

const { Title } = Typography;

const SubmitBuyBook = () => {
    const [isGoback, setIsGoback] = useState(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(1); // Default to 1 (Thanh toán khi giao hàng)

    const handleGoBack = () => {
        setIsGoback(true);
        openNotification('Notification', 'You have returned to the previous page.');
    };

    const handleFormSubmit = (values) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
        });
        formData.append('payment_method', paymentMethod); // Add payment method to FormData

        if (paymentMethod === 1) {
            // Call API for "Thanh toán khi giao hàng"
            fetch('http://localhost:8080/manager/delivery_address/add', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 0) {
                        message.success('Đặt hàng thành công!');
                        openNotification('Order Success', 'Your order has been placed successfully.');
                        handleGoBack();
                    } else {
                        message.error('Có lỗi xảy ra!');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    message.error('Có lỗi xảy ra!');
                });
        } else {
            // Handle other payment methods if needed
            message.warning('Chức năng thanh toán trực tuyến chưa được hỗ trợ.');
        }
    };

    const openNotification = (title, description) => {
        api.open({
            message: title,
            description: description,
            className: 'custom-class',
            style: {
                width: 600,
            },
        });
    };

    useEffect(() => {
        // Fetch list of cities
        fetch('http://localhost:8080/manager/public/customer/cities')
            .then(response => response.json())
            .then(data => setCities(data.cities.map(city => city['Tỉnh Thành Phố'])))
            .catch(error => console.error(error));
    }, []);

    const handleCityChange = (value) => {
        setSelectedCity(value);
        setSelectedDistrict('');
        setSelectedCommune('');
        setDistricts([]);
        setCommunes([]);

        // Fetch districts based on selected city
        fetch(`http://localhost:8080/manager/public/customer/districts?name=${encodeURIComponent(value)}`)
            .then(response => response.json())
            .then(data => setDistricts(data.districts.map(district => district['Quận Huyện'])))
            .catch(error => console.error(error));
    };

    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
        setSelectedCommune('');
        setCommunes([]);

        // Fetch communes based on selected district
        fetch(`http://localhost:8080/manager/public/customer/communes?name=${encodeURIComponent(value)}`)
            .then(response => response.json())
            .then(data => setCommunes(data.communes.map(commune => commune['Phường Xã'])))
            .catch(error => console.error(error));
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    if (isGoback) {
        return <DetailBuy book_id={localStorage.getItem('book_id')} />;
    }

    return (
        <div>
            {contextHolder}
            <Row>
                <IoReturnUpBackOutline onClick={handleGoBack} style={{ fontSize: '25px', cursor: 'pointer' }} />
            </Row>
            <Row justify="center">
                <Col span={16}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <GetOrderById />
                        </Col>
                        <Col span={8}>
                            <Form form={form} onFinish={handleFormSubmit}>
                                <Title level={2}>Nhập thông tin nhận hàng</Title>
                                <Form.Item name="email" rules={[{ required: true, message: 'Email is required' }]}>
                                    <Input placeholder='Email' />
                                </Form.Item>
                                <Form.Item name="user_name" rules={[{ required: true, message: 'Họ tên is required' }]}>
                                    <Input placeholder='Họ tên' />
                                </Form.Item>
                                <Form.Item name="phone_number" rules={[{ required: true, message: 'Số điện thoại is required' }]}>
                                    <Input placeholder='Số điện thoại' />
                                </Form.Item>
                                <Form.Item name="province" rules={[{ required: true, message: 'Chọn thành phố' }]}>
                                    <Select
                                        placeholder="Chọn thành phố"
                                        style={{ width: '100%', height: 42 }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={handleCityChange}
                                        value={selectedCity || undefined}
                                    >
                                        {cities.map(city => (
                                            <Select.Option key={city} value={city}>{city}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="district" rules={[{ required: true, message: 'Chọn quận/huyện' }]}>
                                    <Select
                                        style={{ width: '100%', height: 42 }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={handleDistrictChange}
                                        value={selectedDistrict || undefined}
                                        placeholder="Chọn quận/huyện"
                                    >
                                        {districts.map(district => (
                                            <Select.Option key={district} value={district}>{district}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="commune" rules={[{ required: true, message: 'Chọn phường/xã' }]}>
                                    <Select
                                        style={{ width: '100%', height: 42 }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        value={selectedCommune || undefined}
                                        placeholder="Chọn phường/xã"
                                    >
                                        {communes.map(commune => (
                                            <Select.Option key={commune} value={commune}>{commune}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="detailed" rules={[{ required: true, message: 'Chi tiết địa chỉ is required' }]}>
                                    <Input placeholder='Chi tiết địa chỉ' />
                                </Form.Item>
                                <Form.Item name="note">
                                    <Input placeholder='Ghi chú' />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                        Đặt hàng
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col style={{ marginTop: '16px' }} span={8}>
                            <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
                                <Space direction='vertical' style={{ width: '100%' }}>
                                    <Space.Compact>
                                        <Button style={{ height: '50px', fontSize: '20px', width: '100%' }}>
                                            <Radio value={1} /> Thanh toán khi giao hàng
                                        </Button>
                                    </Space.Compact>
                                    <Space.Compact>
                                        <Button style={{ height: '50px', fontSize: '20px', width: '100%' }}>
                                            <Radio value={2} /> Thanh toán trực tuyến <GrPaypal />
                                        </Button>
                                    </Space.Compact>
                                    {paymentMethod !== 1 && (
                                        <Space.Compact>
                                            <Button style={{ height: '50px', fontSize: '20px', width: '100%' }}>
                                                Thanh toán
                                            </Button>
                                        </Space.Compact>
                                    )}
                                </Space>
                            </Radio.Group>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default SubmitBuyBook;
