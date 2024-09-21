import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Radio, Row, Select, Space, Typography, message, notification } from 'antd';
import DetailBuy from './DetailBuy';
import { GrPaypal } from 'react-icons/gr';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import GetOrderById from './GetOrderById';
import axios from 'axios';
import Cookies from 'js-cookie';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { BsBackpack2 } from 'react-icons/bs';
import GetTheShippingAddress from '../user/GetTheShippingAddress';
import HomePage from './HomePage';
import {style} from './submit_buy.module.css';

//màn thanh toán
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
    const [paymentMethod, setPaymentMethod] = useState(1);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [valueAddress, setValueAddress] = useState(1);
    const [isGobackOrderOff, setIsGobackOrderOff] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (isGobackOrderOff) {
            const timer = setTimeout(() => {
                setRedirect(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isGobackOrderOff]);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await fetch('http://localhost:8080/manager/public/customer/cities');
            const data = await response.json();
            setCities(data.cities.map(city => city['Tỉnh Thành Phố']));
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleCityChange = async (value) => {
        setSelectedCity(value);
        setSelectedDistrict('');
        setSelectedCommune('');
        setDistricts([]);
        setCommunes([]);

        try {
            const response = await fetch(`http://localhost:8080/manager/public/customer/districts?name=${encodeURIComponent(value)}`);
            const data = await response.json();
            setDistricts(data.districts.map(district => district['Quận Huyện']));
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const handleDistrictChange = async (value) => {
        setSelectedDistrict(value);
        setSelectedCommune('');
        setCommunes([]);

        try {
            const response = await fetch(`http://localhost:8080/manager/public/customer/communes?name=${encodeURIComponent(value)}`);
            const data = await response.json();
            setCommunes(data.communes.map(commune => commune['Phường Xã']));
        } catch (error) {
            console.error('Error fetching communes:', error);
        }
    };

    const handleFormSubmit = async (values) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
        });
        formData.append('payment_method', paymentMethod);

        const orderId = localStorage.getItem('order_id');

        if (orderId) {
            formData.append('order_id', orderId);

            try {
                if (paymentMethod === 1) {
                    const response = await axios.post('http://localhost:8080/manager/delivery_address/add', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    const data = response.data;

                    if (data.code === 0) {
                        message.success('Đặt hàng thành công!');
                        localStorage.setItem('status_address', 'ok');
                        openNotification('Đặt hàng thành công', 'Đơn hàng của bạn đã được đặt thành công.');
                        setIsGoback(true);
                    } else {
                        message.error('Có lỗi xảy ra!');
                    }
                } else {
                    handleCreatePayment();
                }
            } catch (error) {
                console.error('Error:', error);
                message.error('Có lỗi xảy ra!');
            }
        } else {
            message.error('Order ID is missing!');
        }
    };

    const handleCreatePayment = async () => {
        setLoadingPayment(true);
        try {
            const orderId = localStorage.getItem('order_id') || 0;
            const response = await axios.patch(`http://127.0.0.1:8080/manager/payment/add?id=${orderId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            Cookies.set("order_id", localStorage.getItem('order_id'), { expires: 30 });

            const paymentResult = response.data;
            if (paymentResult.code === 0) {
                localStorage.removeItem('order_id');
                console.log('Redirecting to:', paymentResult.checkoutUrl);  // Debugging line
                window.location.href = paymentResult.body.checkoutUrl;
                return;
            } else {
                setLoadingPayment(false);
                message.error('Lỗi máy chủ vui lòng thử lại hoặc kiểm tra kết nối mạng thiết bị');
            }


        } catch (error) {
            console.log(error);
            message.error('Lỗi máy chủ vui lòng thử lại hoặc kiểm tra kết nối mạng thiết bị');
        } finally {
            setLoadingPayment(false);
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


    const storedUsername = localStorage.getItem('userData');

    if (isGoback) {
        // return <DetailBuy book_id={localStorage.getItem('book_id')} />;
        return <HomePage/>
    }

    if (redirect) {
        // return <DetailBuy book_id={localStorage.getItem('book_id')} />;
        return <HomePage/>
    }
    return (
        <div style={{marginTop:'90px'}}>
            {contextHolder}
           
            <Row justify="center">
                <Col span={16}>
                    <Row gutter={16}>
                        <Col span={8}>

                            {valueAddress === 1 && storedUsername ? (
                                <p>
                                    <GetTheShippingAddress />
                                </p>
                            ) : (
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
                                            placeholder="Chọn quận/huyện"
                                            onChange={handleDistrictChange}
                                            value={selectedDistrict || undefined}
                                        >
                                            {districts.map(district => (
                                                <Select.Option key={district} value={district}>{district}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="commune" rules={[{ required: true, message: 'Chọn phường/xã' }]}>
                                        <Select
                                            placeholder="Chọn phường/xã"
                                            value={selectedCommune || undefined}
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

                                </Form>
                            )}
                        </Col>
                        <Col span={8} style={{ marginTop: '16px' }}>
                           
                        </Col>
                        <Col span={8}>
                            <GetOrderById />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default SubmitBuyBook;
