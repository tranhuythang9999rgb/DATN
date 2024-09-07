import React, { useState, useEffect } from 'react';
import { Table, Typography, Pagination, Spin, Alert } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const ListOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:8080/manager/order/list/admin', {
                    params: {
                        page: currentPage,
                        size: pageSize,
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
        { title: 'Tên Khách Hàng', dataIndex: 'customer_name', key: 'customer_name' },
        { title: 'Ngày Đặt Hàng', dataIndex: 'order_date', key: 'order_date' },
        { title: 'Tiêu Đề Sách', dataIndex: 'book_title', key: 'book_title' },
        { title: 'Tác Giả Sách', dataIndex: 'book_author', key: 'book_author' },
        { title: 'Nhà Xuất Bản', dataIndex: 'book_publisher', key: 'book_publisher' },
        { title: 'Ngày Xuất Bản', dataIndex: 'book_published_date', key: 'book_published_date' },
        { title: 'ISBN', dataIndex: 'book_isbn', key: 'book_isbn' },
        { title: 'Thể Loại Sách', dataIndex: 'book_genre', key: 'book_genre' },
        { title: 'Mô Tả Sách', dataIndex: 'book_description', key: 'book_description' },
        { title: 'Ngôn Ngữ Sách', dataIndex: 'book_language', key: 'book_language' },
        { title: 'Số Trang', dataIndex: 'book_page_count', key: 'book_page_count' },
        { title: 'Kích Thước Sách', dataIndex: 'book_dimensions', key: 'book_dimensions' },
        { title: 'Trọng Lượng Sách', dataIndex: 'book_weight', key: 'book_weight' },
        { title: 'Giá Sách', dataIndex: 'book_price', key: 'book_price' },
        { title: 'Số Lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Tổng Số Tiền', dataIndex: 'total_amount', key: 'total_amount' },
        { title: 'Trạng Thái', dataIndex: 'status', key: 'status' },
        { title: 'Loại Thanh Toán', dataIndex: 'type_payment', key: 'type_payment' },
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
            />
        </div>
    );
};

export default ListOrder;
