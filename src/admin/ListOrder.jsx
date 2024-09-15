import React, { useState, useEffect } from 'react';
import { Table, Typography, Pagination, Spin, Alert, Modal, Button, Drawer, Input, Space } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Search } = Input;

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

    // Search input states
    const [searchOrderId, setSearchOrderId] = useState('');
    const [searchCustomerName, setSearchCustomerName] = useState('');
    const [searchBookTitle, setSearchBookTitle] = useState('');
    const [searchBookPrice, setSearchBookPrice] = useState('');
    const [searchQuantity, setSearchQuantity] = useState('');
    const [searchTotalAmount, setSearchTotalAmount] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8080/manager/order/list/admin', {
                params: {
                    page: currentPage,
                    size: pageSize,
                    id: searchOrderId,
                    customer_name: searchCustomerName,
                    book_title: searchBookTitle,
                    book_price: searchBookPrice,
                    quantity: searchQuantity,
                    total_amount: searchTotalAmount,
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
    }, [currentPage, pageSize, searchOrderId, searchCustomerName, searchBookTitle, searchBookPrice, searchQuantity, searchTotalAmount]);

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
            render: (status) => {
                switch (status) {
                    case 31:
                        return 'Đơn hàng đã giao thành công và nhận tiền';
                    case 33:
                        return 'Đơn hàng đã bị hủy';
                    case 19:
                        return 'Chờ giao hàng';
                    default:
                        return 'Đang chờ';
                }
            }
        },
        {
            title: 'Loại Thanh Toán',
            dataIndex: 'type_payment',
            key: 'type_payment',
            render: (type_payment) => {
                if (type_payment === 25) {
                    return 'Đã thanh toán online';
                } else if (type_payment === 27) {
                    return 'Thanh toán khi nhận hàng';
                } else {
                    return 'Thanh toán khi nhận hàng'; // Default case if needed
                }
            }
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
            <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                <Space>
                    <Input
                        placeholder="Tìm kiếm theo mã đơn hàng"
                        value={searchOrderId}
                        onChange={(e) => setSearchOrderId(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Input
                        placeholder="Tìm kiếm theo tên khách hàng"
                        value={searchCustomerName}
                        onChange={(e) => setSearchCustomerName(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Input
                        placeholder="Tìm kiếm theo tên sách"
                        value={searchBookTitle}
                        onChange={(e) => setSearchBookTitle(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Input
                        placeholder="Tìm kiếm theo giá sách"
                        value={searchBookPrice}
                        onChange={(e) => setSearchBookPrice(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Input
                        placeholder="Tìm kiếm theo số lượng"
                        value={searchQuantity}
                        onChange={(e) => setSearchQuantity(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Input
                        placeholder="Tìm kiếm theo tổng số tiền"
                        value={searchTotalAmount}
                        onChange={(e) => setSearchTotalAmount(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Button type="primary" onClick={fetchOrders}>
                        Tìm kiếm
                    </Button>
                </Space>
            </Space>
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
                        <p><b>Địa chỉ:</b> {userProfile.address}</p>
                    </div>
                ) : (
                    <p>Đang tải thông tin...</p>
                )}
            </Drawer>
        </div>
    );
};

export default ListOrder;
