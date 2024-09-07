import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Typography, Spin, Alert, Button } from 'antd'; // Import Button from Ant Design

const { Title } = Typography;

const GetOrderById = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const orderId = localStorage.getItem('order_id') || 0;

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId || orderId === 0) {
                setError('Mã đơn hàng không hợp lệ');
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

        fetchOrder();
    }, [orderId]);

    const handleBuyNow = () => {
        // Handle buy now logic (e.g., redirect to a payment page, call an API)
        alert('Chức năng mua ngay chưa được triển khai!');
    };

    if (loading) return <Spin size="large" tip="Đang tải..." />;
    if (error) return <Alert message="Lỗi" description={error} type="error" />;

    return (
        <div>
            {order ? (
                <div>
                    <Title level={2}>Thông tin đơn hàng</Title>
                    <div style={{ maxHeight: '1000px', overflowY: 'auto' }}>
                        <List
                            bordered
                            dataSource={[
                                { label: 'Tổng số tiền', value: order.total_amount },
                                { label: 'Tiêu đề sách', value: order.book_title },
                                { label: 'Giá sách', value: order.book_price },
                                { label: 'Số lượng', value: order.quantity },
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <strong>{item.label}:</strong> {item.value}
                                </List.Item>
                            )}
                        />
                    </div>

                  
                </div>
            ) : (
                <p>Không có thông tin đơn hàng</p>
            )}
        </div>
    );
};

export default GetOrderById;
