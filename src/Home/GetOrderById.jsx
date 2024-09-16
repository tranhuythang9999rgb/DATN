import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Alert, Form, Button } from 'antd'; // Import Button from Ant Design
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

        // Simulate a delay before checking local storage and fetching data
        const timer = setTimeout(() => {
            setLocalLoading(false);
            fetchOrder();
        }, 2000); // Delay of 2 seconds

        // Cleanup timer on component unmount
        return () => clearTimeout(timer);
    }, [orderId]);

    useEffect(() => {
        const storedList = localStorage.getItem('listbook');
        if (storedList) {
            setListBookJson(JSON.parse(storedList));
        }
    }, []);


    const handleDeleteItem = (bookId) => {
        if (listBookJson.length > 1) { // Ensure at least one item remains
            const updatedCart = listBookJson.filter(item => item.id !== bookId);
            setListBookJson(updatedCart);
            localStorage.setItem('listbook', JSON.stringify(updatedCart)); // Update localStorage after deletion
        } else {
            alert('Không thể xóa mục vì danh sách chỉ còn lại một mục');
            return;    
        }
    };

    const totalAmount = listBookJson.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalWithShipping = totalAmount + shippingFee;

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
                                    key={item.id} // Changed from item.cart_id to item.id
                                    imageUrl={item.files[0]} // Assuming files[0] is the image URL
                                    title={item.title}
                                    price={item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    quantity={item.quantity}
                                    sell="15"
                                    onDelete={() => handleDeleteItem(item.id)} // Changed from item.cart_id to item.id
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
                            <Button type="primary" className="form-button">
                                Mua ngay <RiSecurePaymentLine />
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="default"
                                // onClick={handleOrder} // Uncomment and implement handleOrder if needed
                                className="form-button"
                                // loading={buttonLoading} // Uncomment and handle buttonLoading if needed
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
