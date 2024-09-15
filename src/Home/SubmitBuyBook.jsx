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
import Header from '../Utils/Header';
import Footer from '../Utils/Footer';
import HomePage from './HomePage';

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

    const onChangeAddress = (e) => {
        console.log('radio checked', e.target.value);
        setValueAddress(e.target.value);
    };

    useEffect(() => {
        if (isGobackOrderOff) {
            // Set a delay of 3 seconds (3000 milliseconds)
            const timer = setTimeout(() => {
                setRedirect(true);
            }, 3000);

            // Cleanup timer if the component unmounts or if `isGobackOrderOff` changes
            return () => clearTimeout(timer);
        }
    }, [isGobackOrderOff]);

    useEffect(() => {
        // Fetch list of cities on mount
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

    const handleOrderBook = async () => {
        const orderId = localStorage.getItem('order_id') || 0;

        if (!orderId) {
            message.error('Order ID not found in local storage.');
            return;
        }

        try {
            const response = await axios.patch(`http://127.0.0.1:8080/manager/order/api/order/offiline`, null, {
                params: { id: orderId }
            });

            if (response.data.code === 0) {
                openNotification('Đặt hàng thành công', 'Đơn hàng của bạn đã được đặt thành công.');
                message.success('Order updated successfully.');
                setIsGobackOrderOff(true)
            } else {
                message.error(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error updating order:', error);
            message.error('Failed to update order.');
        }
    };

    const storedUsername = localStorage.getItem('userData');

    if (isGoback) {
        return <DetailBuy book_id={localStorage.getItem('book_id')} />;
    }

    if (redirect) {
        // return <DetailBuy book_id={localStorage.getItem('book_id')} />;
        return <HomePage/>
    }
    return (
        <div>
            {contextHolder}
            <Row>
                <IoReturnUpBackOutline onClick={() => setIsGoback(true)} style={{ fontSize: '25px', cursor: 'pointer' }} />
            </Row>
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
                            <Radio.Group onChange={e => setPaymentMethod(e.target.value)} value={paymentMethod}>
                                <Space direction='vertical' style={{ width: '100%' }}>
                                    <Button
                                        style={{ height: '50px', fontSize: '20px', width: '100%' }}
                                        onClick={form.submit}
                                    >
                                        <Radio value={1} /> Thanh toán khi giao hàng
                                    </Button>
                                    <Button
                                        style={{ height: '50px', fontSize: '20px', width: '100%' }}
                                    >
                                        <Radio value={2} /> Thanh toán trực tuyến <GrPaypal />
                                    </Button>


                                    <Radio.Group onChange={onChangeAddress} value={valueAddress}>
                                        <Radio value={1}>Địa chỉ hiện tại</Radio>
                                        <Radio value={2}>Địa chỉ mới</Radio>
                                    </Radio.Group>

                                </Space>
                            </Radio.Group>
                        </Col>
                        <Col span={8}>
                            <GetOrderById />

                            {(() => {
                                if (paymentMethod === 2) {
                                    if (valueAddress === 2) {
                                        return (
                                            <Button
                                                onClick={handleCreatePayment && form.submit}
                                                loading={loadingPayment}
                                                style={{ height: '50px', fontSize: '20px', width: '100%' }}
                                            >
                                                {loadingPayment ? 'Đang xử lý...' : <>Thanh toán <RiSecurePaymentLine style={{ marginLeft: '8px' }} /></>}
                                            </Button>
                                        );
                                    } else {
                                        return (
                                            <div>
                                                <Button
                                                    onClick={handleCreatePayment}
                                                    loading={loadingPayment}
                                                    style={{ height: '50px', fontSize: '20px', width: '100%' }}
                                                >
                                                    {loadingPayment ? 'Đang xử lý...' : <>Thanh toán<RiSecurePaymentLine style={{ marginLeft: '8px' }} /></>}
                                                </Button>
                                            </div>

                                        );
                                    }
                                } else {
                                    if (valueAddress === 2) {
                                        return (
                                            <div>
                                                <Button
                                                    onClick={() => { handleOrderBook(); form.submit(); }}
                                                    style={{ height: '50px', fontSize: '20px', width: '100%' }}
                                                >
                                                    {"" ? 'Đang xử lý...' : <>Đặt hàng <BsBackpack2 style={{ marginLeft: '8px' }} /></>}
                                                </Button>
                                            </div>
                                        );
                                    } else {
                                        // Case 2.2: Other cases when paymentMethod is not 2 and different address conditions
                                        return (
                                            <Button
                                                onClick={handleOrderBook}
                                                style={{ height: '50px', fontSize: '20px', width: '100%' }}
                                            >
                                                {"" ? 'Đang xử lý...' : <>Đặt hàng <BsBackpack2 style={{ marginLeft: '8px' }} /></>}
                                            </Button>
                                        );
                                    }
                                }
                            })()}


                        </Col>
                    </Row>
                </Col>

            </Row>
            <Footer />
        </div>
    );
};

export default SubmitBuyBook;
