import React, { useEffect, useState } from 'react';
import { Form, Button, notification, Spin } from 'antd';
import './user_index.css';
import ProductCard from './ProductCard';

const Context = React.createContext({
    name: 'Default',
});

function FormBuyCart() {
    const [listCartJson, setListCartJson] = useState([]);
    const [loading, setLoading] = useState(true);

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (placement) => {
        api.success({
            message: 'Đặt hàng thành công!',
            description: (
                <Context.Consumer>
                    {({ name }) =>
                        'Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ ngay với bạn.'
                    }
                </Context.Consumer>
            ),
            placement,
            duration: 3,
        });
    };

    const handleBuyNow = () => {
        console.log('Mua ngay');
    };

    const handleOrder = () => {
        console.log('Đặt hàng');
        openNotification('topRight');
    };

    const handleDeleteItem = (cartId) => {
        const updatedCart = listCartJson.filter(item => item.cart_id !== cartId);
        setListCartJson(updatedCart);
        localStorage.setItem('list_cart', JSON.stringify(updatedCart)); // Cập nhật localStorage sau khi xóa
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const listCart = localStorage.getItem('list_cart');
            const parsedData = JSON.parse(listCart || '[]');
            setListCartJson(parsedData);
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const totalAmount = listCartJson.reduce((total, item) => total + item.total_amount, 0);

    return (
        <Spin spinning={loading} tip="Đang tải..." size="large">
            <div>
                {contextHolder}
                <Form className="form-cart">
                    <Form.Item>
                        <p style={{ color: '#87CEFA', fontSize: '25px' }}>
                            Tổng tiền: {totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
                    </Form.Item>
                    <Form.Item>
                        {listCartJson.map(item => (
                            <ProductCard
                                key={item.cart_id}
                                imageUrl={item.url}
                                title={item.book_name}
                                price={item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                quantity={item.quantity}
                                sell="15"
                                onDelete={() => handleDeleteItem(item.cart_id)} // Thêm sự kiện onDelete
                            />
                        ))}
                    </Form.Item>
                    <Form.Item className="form-item-button">
                        <Button type="primary" onClick={handleBuyNow} className="form-button">
                            Mua ngay
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="default" onClick={handleOrder} className="form-button">
                            Đặt hàng
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    );
}

export default FormBuyCart;
