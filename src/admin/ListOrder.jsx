import React, { useState, useEffect } from 'react';
import { Table, Typography, Pagination, Spin, Alert, Modal, Button, Drawer, Input, Space, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Search } = Input;

const ListOrder = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');

    // Fetch data when component mounts
    useEffect(() => {
        // Get username from localStorage
        const userData = localStorage.getItem('userData');
        let username = '';

        try {
            const parsedUserData = JSON.parse(userData);
            if (parsedUserData && parsedUserData.user_name) {
                username = parsedUserData.user_name;
            } else {
                throw new Error('User data is missing or invalid');
            }
        } catch (err) {
            setError('Error parsing user data from localStorage');
            setLoading(false);
            return;
        }

        // Fetch orders for the user
        axios.get("http://127.0.0.1:8080/manager/order/api/listorder/admin")
            .then(response => {
                setData(response.data.body);
                setFilteredData(response.data.body);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Handle search input
    const handleSearch = (value) => {
        setSearchText(value);
        const lowercasedValue = value.toLowerCase();
        const numericValue = parseFloat(value);

        const filtered = data.filter(order => {
            const orderIdMatches = order.order_id.toString().includes(value);
            const addressMatches =
                order.address.district.toLowerCase().includes(lowercasedValue) ||
                order.address.commune.toLowerCase().includes(lowercasedValue) ||
                order.address.detailed.toLowerCase().includes(lowercasedValue);
            const amountMatches =
                !isNaN(numericValue) && (order.amount / 100).toFixed(2).includes(numericValue.toString());

            return orderIdMatches || addressMatches || amountMatches;
        });
        setFilteredData(filtered);
    };

    // Handle cancellation of an order
    const handleCancel = (id) => {
        axios.patch(`http://127.0.0.1:8080/manager/order/api/update/calcel?id=${id}`)
            .then(response => {
                if (response.data.code === 0) {
                    message.success('Đơn hàng đã được hủy thành công');
                    // Update the status of the canceled order
                    setData(prevData => {
                        return prevData.map(order =>
                            order.order_id === id
                                ? { ...order, status: 11 } // Assuming 11 is the status code for canceled
                                : order
                        );
                    });
                    setFilteredData(prevData => {
                        return prevData.map(order =>
                            order.order_id === id
                                ? { ...order, status: 11 } // Assuming 11 is the status code for canceled
                                : order
                        );
                    });
                } else {
                    message.error('Không thể hủy đơn hàng');
                }
            })
            .catch(err => {
                message.error(`Lỗi: ${err.message}`);
            });
    };

    const columns = [
        {
            title: 'Mã Đơn Hàng',
            dataIndex: 'order_id',
            key: 'order_id',
        },
        {
            title: 'Người mua',
            dataIndex: 'user_name',
            key: 'user_name'
        },
        {
            title: 'Thời Gian Tạo',
            dataIndex: 'create_time',
            key: 'create_time',
            render: text => new Date(text).toLocaleString(),
        },
        {
            title: 'Địa Chỉ',
            key: 'address',
            render: (text, record) => (
                <>
                    <div>{record.address.district}</div>
                    <div>{record.address.commune}</div>
                    <div>{record.address.detailed}</div>
                </>
            ),
        },
        {
            title: 'Số Tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: text => `$${(text / 100).toFixed(2)}`, // Assuming amount is in cents
        },
        {
            title: 'Ngày Dự Đoán',
            dataIndex: 'estimated_date',
            key: 'estimated_date',
            render: text => new Date(text).toLocaleString(),
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                switch (status) {
                    case 21: return 'Đang Chờ Thanh Toán Online';
                    case 19: return 'Đang Chờ Gửi Hàng';
                    case 23: return 'Đang Giao';
                    case 11: return 'Đơn Hàng Đã Hủy';
                    case 9: return 'Đã Giao Hàng và Thanh Toán';
                    default: return 'Trạng Thái Không Xác Định';
                }
            },
        },
        {
            title: 'Loại Thanh Toán',
            dataIndex: 'payment_type',
            key: 'payment_type',
            render: paymentType => paymentType === 25 ? 'Thanh Toán Online' : 'Thanh Toán Khi Nhận Hàng',
        },
        {
            title: 'Danh Sách Mặt Hàng',
            key: 'items',
            render: (text, record) => (
                <div>
                    {record.items.map(item => (
                        <div key={item.name}>
                            <strong>{item.name}</strong> - Số lượng: {item.quantity} - Giá: ${item.price / 100}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: ' ',
            key: 'action',
            render: (text, record) => {
                const { status, order_id } = record;
                const canCancel = [19, 23].includes(status); // Status codes for orders that can be canceled

                return canCancel ? (
                    <Button
                        type="primary"
                        danger
                        onClick={() => handleCancel(order_id)}
                    >
                        Hủy Đơn Hàng
                    </Button>
                ) : null;
            },
        },
    ];

    if (loading) return <Spin tip="Đang Tải..." />;
    if (error) return <Alert message="Lỗi" description={error} type="error" />;

    return (
        <div>
            <Title level={2}>Danh Sách Đơn Hàng</Title>
            <Search
                placeholder="Tìm kiếm theo mã đơn hàng, địa chỉ, hoặc giá tiền"
                allowClear
                enterButton="Tìm kiếm"
                size="large"
                onSearch={handleSearch}
                style={{ marginBottom: 16 }}
            />
            <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="order_id"
                pagination={10}
            />
        </div>
    );
};




export default ListOrder;
