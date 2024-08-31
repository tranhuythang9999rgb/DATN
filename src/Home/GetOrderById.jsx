import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Typography, Spin, Alert } from 'antd'; // Thêm các component Ant Design cần thiết

const { Title } = Typography; // Để sử dụng Title từ Ant Design

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
                                { label: 'ID', value: order.id },
                                { label: 'ID sách', value: order.book_id },
                                { label: 'Tổng số tiền', value: order.total_amount },
                                { label: 'Tiêu đề sách', value: order.book_title },
                                { label: 'Tác giả sách', value: order.book_author },
                                { label: 'Nhà xuất bản sách', value: order.book_publisher },
                                { label: 'Ngày xuất bản sách', value: order.book_published_date },
                                { label: 'ISBN sách', value: order.book_isbn },
                                { label: 'Thể loại sách', value: order.book_genre },
                                { label: 'Ngôn ngữ sách', value: order.book_language },
                                { label: 'Số trang sách', value: order.book_page_count },
                                { label: 'Kích thước sách', value: order.book_dimensions },
                                { label: 'Cân nặng sách', value: order.book_weight },
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
