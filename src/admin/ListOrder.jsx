import React, { useState, useEffect } from 'react';
import { Table, Typography, Pagination, Spin, Alert, Modal, Button, Drawer } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const ListOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

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
            setTotal(response.data.total);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, pageSize]);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const showModal = (id) => {
        setSelectedOrderId(id);
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const response = await axios.patch(`http://127.0.0.1:8080/manager/order/update/admin/submit`, null, {
                params: { id: selectedOrderId },
            });

            if (response.data.code === 0) {
                Modal.success({ title: 'Success', content: 'Order updated successfully!' });
                setIsModalVisible(false);
                fetchOrders(); // refresh the orders list
            } else {
                Modal.error({ title: 'Error', content: response.data.message });
            }
        } catch (err) {
            Modal.error({ title: 'Error', content: 'An error occurred during the update.' });
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showDrawer = async (userName) => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/delivery_address/infor/profile', {
                params: { name: userName },
            });
            setUserProfile(response.data.body);
            setIsDrawerVisible(true);
        } catch (err) {
            setError(err);
        }
    };

    const handleDrawerClose = () => {
        setIsDrawerVisible(false);
        setUserProfile(null);
    };

    const columns = [
        { title: 'Mã Đơn Hàng', dataIndex: 'id', key: 'id' },
        { title: 'Tên Khách Hàng', dataIndex: 'customer_name', key: 'customer_name' },
        { title: 'Ngày Đặt Hàng', dataIndex: 'order_date', key: 'order_date' },
        { title: 'Tên sách', dataIndex: 'book_title', key: 'book_title' },
        { title: 'Giá Sách', dataIndex: 'book_price', key: 'book_price' },
        { title: 'Số Lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Tổng Số Tiền', dataIndex: 'total_amount', key: 'total_amount' },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => status === 31 ? 'Đơn hàng đã giao thành công và nhận tiền' : 'Đang chờ'
        },
        {
            title: 'Loại Thanh Toán',
            dataIndex: 'type_payment',
            key: 'type_payment',
            render: (type_payment) => type_payment === 25 ? 'Đã thanh toán online' : 'Thanh toán khi nhận hàng'
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" onClick={() => showModal(record.id)}>
                        Cập Nhật Đơn Hàng
                    </Button>
                    <Button type="link" onClick={() => showDrawer(record.customer_name)}>
                        Xem Thông Tin Khách Hàng
                    </Button>
                </>
            )
        }
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
            <Modal
                title="Xác Nhận Cập Nhật"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>Bạn có chắc chắn muốn cập nhật đơn hàng {selectedOrderId} không?</p>
            </Modal>
            <Drawer
                title="Thông Tin Khách Hàng"
                width={400}
                onClose={handleDrawerClose}
                visible={isDrawerVisible}
            >
                {userProfile ? (
                    <div>
                        <p><b>Tên người dùng:</b> {userProfile.user_name}</p>
                        <p><b>Email:</b> {userProfile.email}</p>
                        <p><b>Số điện thoại:</b> {userProfile.phone_number}</p>
                        <p><b>Tỉnh:</b> {userProfile.province}</p>
                        <p><b>Huyện:</b> {userProfile.district}</p>
                        <p><b>Xã:</b> {userProfile.commune}</p>
                        <p><b>Địa chỉ chi tiết:</b> {userProfile.detailed}</p>
                    </div>
                ) : (
                    <Spin size="large" />
                )}
            </Drawer>
        </div>
    );
};

export default ListOrder;
