import React, { useState } from 'react';
import { Button, Form, Input, Typography, message, notification } from 'antd';
import DetailBuy from './DetailBuy';
import OpenApiAddress from './OpenApiAddress';
import './home_index.css';
const { Title } = Typography;

const SubmitBuyBook = () => {
    const [isGoback, setIsGoback] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [form] = Form.useForm();
    const [address, setAddress] = useState({ city: '', district: '', commune: '' });
    const [api, contextHolder] = notification.useNotification();

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

    if (isGoback) {
        return <DetailBuy book_id={localStorage.getItem('book_id')} />;
    }

    return (
        <div style={{ padding: '20px' }}>
            {contextHolder}
            {isFormVisible ? (
                <>
                    <Title level={3}>Nhập thông tin đặt hàng</Title>
                    <Form
                        className='submit-after-buy'
                        form={form}
                        onFinish={handleFormSubmit}
                        layout="vertical">
                        <Form.Item
                            label="Họ tên"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input placeholder="Nhập họ tên" />
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                        >
                            <OpenApiAddress onAddressChange={handleAddressChange} />
                        </Form.Item>
                        <Form.Item
                            label="Địa chỉ chi tiết"
                            name="detailedAddress"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết!' }]}
                        >
                            <Input.TextArea placeholder="Nhập địa chỉ chi tiết" rows={4} />
                        </Form.Item>
                        <Form.Item>
                            <Button  type="primary" htmlType="submit">Xác nhận đặt hàng</Button>
                        </Form.Item>
                    </Form>
                    <Button onClick={handleGoBack} style={{ marginTop: '20px' }}>Quay lại</Button>
                </>
            ) : (
                <Button onClick={handleNextSubmitBuy}>Quay lại</Button>
            )}
        </div>
    );
};

export default SubmitBuyBook;
