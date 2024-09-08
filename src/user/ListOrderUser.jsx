import React, { useState, useEffect } from 'react';
import { Table, Typography, Pagination, Spin, Alert } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const ListOrderUser = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            const userData = JSON.parse(localStorage.getItem('userData'));
            const customerName = userData?.user_name || '';

            try {
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:8080/manager/order/list/admin', {
                    params: {
                        page: currentPage,
                        size: pageSize,
                        customer_name: customerName,
                    },
                });
                setOrders(response.data.body);
                setTotal(response.data.total); // Ensure your API returns the total count of items
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage, pageSize]);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const columns = [
        { title: 'Mã Đơn Hàng', dataIndex: 'id', key: 'id' },
        { title: 'Ngày Đặt Hàng', dataIndex: 'order_date', key: 'order_date' },
        { title: 'Tên sách', dataIndex: 'book_title', key: 'book_title' },
        { title: 'Tác Giả Sách', dataIndex: 'book_author', key: 'book_author' },
        { title: 'Nhà Xuất Bản', dataIndex: 'book_publisher', key: 'book_publisher' },
        { title: 'Ngôn Ngữ Sách', dataIndex: 'book_language', key: 'book_language' },
        { title: 'Số Trang', dataIndex: 'book_page_count', key: 'book_page_count' },
        { title: 'Giá Sách', dataIndex: 'book_price', key: 'book_price' },
        { title: 'Số Lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Tổng Số Tiền', dataIndex: 'total_amount', key: 'total_amount' },
    ];

    if (loading) return <Spin size="large" />;
    if (error) return <Alert message="Đã xảy ra lỗi" description={error.message} type="error" />;

    return (
        <div>
            <Title level={2}>Danh Sách Đơn Hàng</Title>
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="id"
                pagination={false}
            />
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger
                style={{ marginTop: '16px' }}
            />
        </div>
    );
};

export default ListOrderUser;
