import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Radio, Row, Select, Space, Typography, message, notification } from 'antd';
import DetailBuy from './DetailBuy';
import OpenApiAddress from './OpenApiAddress';
import './home_index.css';
import { GrPaypal } from 'react-icons/gr';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import GetOrderById from './GetOrderById';
const { Title } = Typography;

const SubmitBuyBook = () => {
    const [isGoback, setIsGoback] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [form] = Form.useForm();
    const [address, setAddress] = useState({ city: '', district: '', commune: '' });
    const [api, contextHolder] = notification.useNotification();
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);

    const handleNextSubmitBuy = () => {
        setIsFormVisible(false);
    };

    const handleGoBack = () => {
        setIsGoback(true);
        openNotification('Notification', 'You have returned to the previous page.');
    };

    const handleFormSubmit = (values) => {
        // Process the form data here (e.g., send it to a server)
        console.log('Form values:', { ...values, address });
        message.success('Đặt hàng thành công!');
        openNotification('Order Success', 'Your order has been placed successfully.');

        // After successful submission, trigger handleGoBack to navigate back
        handleGoBack();
    };

    const handleAddressChange = (address) => {
        setAddress(address);
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



    if (isGoback) {
        return <DetailBuy book_id={localStorage.getItem('book_id')} />;
    }

    return (
        <div>
            <Row>
            <IoReturnUpBackOutline onClick={handleGoBack} style={{fontSize:'25px',cursor:'pointer'}} />
            </Row>
            <Row>
                <Col span={6}>
                    <GetOrderById/>
                </Col>
                <Col span={6}>
                    <Form>
                        <Title><h2>Nhập thông tin nhận hàng</h2></Title>
                        <Form.Item>
                            <Input placeholder='email' />
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder='ho ten' />
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder='so dien thoai' />
                        </Form.Item>
                        <Form.Item>
                            <Select
                                placeholder="Chọn thành phố"
                                style={{ width: 460, height: 42 }}
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
                        <Form.Item>
                            <Select
                                style={{ width: 460, height: 42 }}
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={handleDistrictChange}
                                value={selectedDistrict || undefined}  // Update this line
                                placeholder="Chọn quận/huyện"
                            >
                                {districts.map(district => (
                                    <Select.Option key={district} value={district}>{district}</Select.Option>
                                ))}
                            </Select>

                        </Form.Item>
                        <Form.Item>
                            <Select
                                style={{ width: 460, height: 42 }}
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
                        <Form.Item>
                            <Input placeholder='Chi tiết địa chỉ' />
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder='ghi chu' />
                        </Form.Item>
                    </Form>
                </Col>
                <Col style={{ paddingLeft: '30px', paddingTop: '150px' }} span={6}>
                    <Radio.Group defaultValue={1}>
                        <Space direction='vertical'>
                            <Space.Compact>
                                <Button style={{ height: '50px', fontSize: '20px' }}>
                                    <Radio value={1} /> Thanh toán khi giao hàng
                                </Button>
                            </Space.Compact>
                            <Space.Compact>
                                <Button style={{ height: '50px', fontSize: '20px', width: '290px' }}>
                                    <Radio style={{ marginLeft: '' }} value={2} /> Thanh toán trực tuyến <GrPaypal />
                                </Button>
                            </Space.Compact>
                            <Space.Compact>
                                <Button style={{ height: '50px', fontSize: '20px' , width: '290px'}}>
                                    Thanh toán
                                </Button>
                            </Space.Compact>
                        </Space>
                    </Radio.Group>
                </Col>
                <Col span={6}>

                </Col>
            </Row>

        </div>
    );
};

export default SubmitBuyBook;
