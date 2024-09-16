import React, { useEffect, useState } from 'react';
import { Form, Button, notification, Spin } from 'antd';
import axios from 'axios'; // Make sure axios is installed
import ProductCard from './ProductCard';
import HomePage from '../Home/HomePage';
import { RiSecurePaymentLine } from 'react-icons/ri';
import ListCart from './ListCart';
import { TiArrowBack } from 'react-icons/ti';

//todo
function FormBuyCart() {
    const [listCartJson, setListCartJson] = useState([]);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    const [nextHomePage, setNextHomePage] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false); // New state for button loading
    const shippingFee = 30000; // Default shipping fee
    const [goback, setGoBack] = useState(false);

    const openNotification = (placement, message, description) => {
        api.success({
            message,
            description,
            placement,
            duration: 3,
        });
    };

    const userData = JSON.parse(localStorage.getItem('userData'));
    const userName = userData ? userData.user_name : '';

    const handleOrder = async () => {
        // Add user_name to each item in listCartJson
        const updatedCartJson = listCartJson.map(item => ({
            ...item,
            user_name: userName, // Include user_name here
        }));

        setButtonLoading(true); // Show spinner on button
        try {
            const response = await axios.post('http://127.0.0.1:8080/manager/order/api/orders', updatedCartJson);

            if (response.data.code === 0) {
                openNotification('topRight', 'Đặt hàng thành công!', 'Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được ghi nhận.');
                // Delay before redirecting
                setTimeout(() => {
                    setNextHomePage(true);
                }, 3000);
            } else if (response.data.code === 10) {
                openNotification('topRight', 'Hàng đã hết');
            } else {
                openNotification('topRight', 'Lỗi đặt hàng', 'Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi đặt hàng:', error);
            openNotification('topRight', 'Lỗi', 'Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại.');
        } finally {
            // Hide spinner after 3 seconds
            setTimeout(() => setButtonLoading(false), 3000);
        }
    };

    const handleDeleteItem = (cartId) => {
        if (listCartJson.length > 1) { // Ensure at least one item remains
            const updatedCart = listCartJson.filter(item => item.cart_id !== cartId);
            setListCartJson(updatedCart);
            localStorage.setItem('list_cart', JSON.stringify(updatedCart)); // Update localStorage after deletion
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


    const handlePaymentOnline = async () => {
        setButtonLoading(true);
        try {
            const items = listCartJson.map(item => ({
                cart_id: item.cart_id,
                book_id: item.book_id,
                book_name: item.book_name,
                quantity: item.quantity,
                price: item.price,
                total_amount: item.total_amount,
                url: item.url
            }));

            const paymentData = {
                customer_name: userName,
                items: JSON.stringify(items)
            };

            const response = await axios.post('http://127.0.0.1:8080/manager/payment/create/payment', paymentData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `order_id=${Math.floor(Math.random() * 10000000)}` // Generate a random order_id
                }
            });

            if (response.data.code === 0 && response.data.body && response.data.body.checkoutUrl) {
                openNotification('topRight', 'Chuyển hướng đến trang thanh toán', 'Bạn sẽ được chuyển đến trang thanh toán trong giây lát.');
                setTimeout(() => {
                    window.location.href = response.data.body.checkoutUrl;
                }, 2000);
            } else {
                openNotification('topRight', 'Lỗi thanh toán', 'Có lỗi xảy ra trong quá trình tạo liên kết thanh toán. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi thanh toán:', error);
            openNotification('topRight', 'Lỗi', 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
        } finally {
            setTimeout(() => setButtonLoading(false), 3000);
        }
    };
    

    if (goback) {
        return (
            <HomePage />
        )
    }

    if (nextHomePage) {
        window.location.reload();
    }

    return (
        <Spin spinning={loading} tip="Đang tải..." size="large">
            <TiArrowBack style={{ fontSize: '50px', cursor: 'pointer' }} onClick={() => setGoBack(true)} />

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
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                                className="total-product"
                            >
                                Tổng tiền sản phẩm: {totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </div>
                            <div className="total-shipping">
                                Phí vận chuyển: {shippingFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </div>
                            <div className="total-payment">
                                Tổng tiền thanh toán: {totalWithShipping.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </div>
                        </div>
                    </Form.Item>

                    <Form.Item className="form-item-button">
                        <Button type="primary" onClick={handlePaymentOnline} className="form-button">
                            Mua ngay  <RiSecurePaymentLine />
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="default"
                            onClick={handleOrder}
                            className="form-button"
                            loading={buttonLoading} // Show spinner on button
                        >
                            Đặt hàng
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    );
}

export default FormBuyCart;
