import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Alert, Form, Button, notification } from 'antd'; // Import Button from Ant Design
import ProductCard from '../user/ProductCard';
import { RiSecurePaymentLine } from 'react-icons/ri';

const GetOrderById = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localLoading, setLocalLoading] = useState(true); // State to handle local storage loading
    const [listBookJson, setListBookJson] = useState([]);
    const orderId = localStorage.getItem('order_id') || 0;
    const shippingFee = 30000; // Default shipping fee
    const [api, contextHolder] = notification.useNotification();
    const [buttonLoading, setButtonLoading] = useState(false); // State for button loading

    const openNotification = (placement, message, description) => {
        api.success({
            message,
            description,
            placement,
            duration: 3,
        });
    };

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId || orderId === 0) {
                setError('Vui lòng kiểm tra kết nối mạng hoặc thiết bị');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://127.0.0.1:8080/manager/order/infor?id=${orderId}`);
                if (response.data.code === 0) {
                    setOrder(response.data.body);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError('Lỗi khi lấy dữ liệu đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            setLocalLoading(false);
            fetchOrder();
        }, 2000); // Delay of 2 seconds

        return () => clearTimeout(timer);
    }, [orderId]);

    useEffect(() => {
        const storedList = localStorage.getItem('listbook');
        if (storedList) {
            setListBookJson(JSON.parse(storedList));
        }
    }, []);

    const totalAmount = listBookJson.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalWithShipping = totalAmount + shippingFee;
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userName = userData ? userData.user_name : '';

    const handleDeleteItem = (bookId) => {
        if (listBookJson.length > 1) {
            const updatedCart = listBookJson.filter(item => item.id !== bookId);
            setListBookJson(updatedCart);
            localStorage.setItem('listbook', JSON.stringify(updatedCart));
        } else {
            alert('Không thể xóa mục vì danh sách chỉ còn lại một mục');
            return;    
        }
    };

    const handlePaymentOnline = async () => {
        setButtonLoading(true); // Set loading state to true
        try {
            const items = listBookJson.map(item => ({
                cart_id: item.book_id,
                book_id: item.id,
                book_name: item.title,
                quantity: item.quantity,
                price: item.price,
                total_amount: totalWithShipping,
                url: item.url
            }));
            console.log(items);
            const paymentData = {
                customer_name: userName,
                items: JSON.stringify(items)
            };

            const response = await axios.post('http://127.0.0.1:8080/manager/payment/create/payment', paymentData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `order_id=${Math.floor(Math.random() * 10000000)}`
                }
            });

            if (response.data.code === 0 && response.data.body && response.data.body.checkoutUrl) {
                setListBookJson([]); // Clear the list of books
                localStorage.setItem('listbook', JSON.stringify([])); // 
                openNotification('topRight', 'Chuyển hướng đến trang thanh toán', 'Bạn sẽ được chuyển đến trang thanh toán trong giây lát.');
                setTimeout(() => {
                    window.location.href = response.data.body.checkoutUrl;
                }, 1000);
            } else {
                openNotification('topRight', 'Lỗi thanh toán', 'Có lỗi xảy ra trong quá trình tạo liên kết thanh toán. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi thanh toán:', error);
            openNotification('topRight', 'Lỗi', 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
        } finally {
            setButtonLoading(false); // Set loading state to false after completion
        }
    };

    if (localLoading) return <Spin size="large" tip="Đang tải dữ liệu từ bộ nhớ..." />;
    if (loading) return <Spin size="large" tip="Đang tải..." />;
    if (error) return <Alert message="Lỗi" description={error} type="error" />;

    return (
        <div>
            {order ? (
                <div>
                    <Form className="form-cart">
                        <Form.Item>
                            {listBookJson.map(item => (
                                <ProductCard
                                    key={item.id}
                                    imageUrl={item.files[0]}
                                    title={item.title}
                                    price={item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    quantity={item.quantity}
                                    sell="15"
                                    onDelete={() => handleDeleteItem(item.id)}
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
                            <Button
                                onClick={handlePaymentOnline}
                                type="primary"
                                className="form-button"
                                loading={buttonLoading} // Add the loading prop
                            >
                                Mua ngay <RiSecurePaymentLine />
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="default"
                                // onClick={handleOrder}
                                className="form-button"
                            >
                                Đặt hàng
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ) : (
                <p>Không có thông tin đơn hàng</p>
            )}
        </div>
    );
};

export default GetOrderById;
