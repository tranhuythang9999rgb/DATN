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

    const shippingFee = 30000; // Phí vận chuyển mặc định

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
        if (listCartJson.length > 1) { // Kiểm tra nếu còn nhiều hơn 1 item
            const updatedCart = listCartJson.filter(item => item.cart_id !== cartId);
            setListCartJson(updatedCart);
            localStorage.setItem('list_cart', JSON.stringify(updatedCart)); // Cập nhật localStorage sau khi xóa
        } else {
            notification.error({
                message: 'Không thể xóa',
                description: 'Phải có ít nhất 1 sản phẩm trong giỏ hàng',
                placement: 'topRight',
            });
        }
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
    const totalWithShipping = totalAmount + shippingFee;

    return (
        <Spin spinning={loading} tip="Đang tải..." size="large">
            <div>
                {contextHolder}
                <Form className="form-cart">

                    <Form.Item>
                        {listCartJson.map(item => (
                            <ProductCard
                                key={item.cart_id}
                                imageUrl={item.url}
                                title={item.book_name}
                                price={item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                quantity={item.quantity}
                                sell="15"
                                onDelete={() => handleDeleteItem(item.cart_id)}
                            />
                        ))}
                    </Form.Item>
                    <Form.Item>
                        <div className="form-item-total">
                            <div
                                style={{
                                    backgroundColor: 'white',
                                    height: '50px',
                                    fontSize: '20px',
                                    padding: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                                className="total-product"
                            >
                                Tổng tiền sản phẩm: {totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </div>
                            <div
                                style={{
                                    backgroundColor: 'white',
                                    height: '50px',
                                    fontSize: '20px',
                                    padding: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                                className="total-shipping"
                            >
                                Phí vận chuyển: {shippingFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </div>
                            <div
                                style={{
                                    backgroundColor: '#2ecc71',
                                    height: '50px',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    padding: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '8px',
                                    color: 'white',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                                className="total-payment"
                            >
                                Tổng tiền thanh toán: {totalWithShipping.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </div>
                        </div>

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
