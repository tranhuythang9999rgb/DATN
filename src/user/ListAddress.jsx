import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag, Button, message, Modal, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons'; // Import icons
import AddAddress from './AddAddress';

const ListAddress = () => {
    const [addressData, setAddressData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Number of records per page
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

    const fetchData = async () => {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        const userName = storedUserData?.user_name;

        if (!userName) {
            console.error('Username not found in local storage');
            return;
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8080/manager/delivery_address/list?name=${userName}`);
            if (response.data.code === 0) {
                const sortedData = response.data.body.sort((a, b) => {
                    // Sort default address first
                    return b.default_address - a.default_address;
                });
                setAddressData(sortedData);
            } else {
                console.error('Error fetching data:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleUpdateStatusAddress = async (id) => {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        const userName = storedUserData?.user_name;

        try {
            const response = await axios.patch(`http://127.0.0.1:8080/manager/delivery_address/update`, null, {
                params: { name: userName, id }
            });
            if (response.data.code === 0) {
                message.success('Địa chỉ mặc định đã được cập nhật thành công');
                // Refetch data to update the table
                localStorage.setItem('delivery_address', id);
                fetchData();
            } else {
                message.error('Lỗi khi cập nhật địa chỉ: ' + response.data.message);
            }
        } catch (error) {
            message.error('Lỗi khi cập nhật địa chỉ: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8080/manager/delivery_address/delete`, {
                params: { id }
            });
            if (response.data.code === 0) {
                message.success('Địa chỉ đã được xóa thành công');
                fetchData();
            } else {
                message.error('Lỗi khi xóa địa chỉ: ' + response.data.message);
            }
        } catch (error) {
            message.error('Lỗi khi xóa địa chỉ: ' + error.message);
        }
    };

    // Handle Modal visibility
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // After submitting the new address, close modal and refresh the table
    const handleAddAddressSuccess = () => {
        setIsModalVisible(false);
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'nick_name',
            key: 'nick_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Tỉnh/Thành phố',
            dataIndex: 'province',
            key: 'province',
        },
        {
            title: 'Quận/Huyện',
            dataIndex: 'district',
            key: 'district',
        },
        {
            title: 'Phường/Xã',
            dataIndex: 'commune',
            key: 'commune',
        },
        {
            title: 'Chi tiết',
            dataIndex: 'detailed',
            key: 'detailed',
        },
        {
            title: 'Địa chỉ mặc định',
            dataIndex: 'default_address',
            key: 'default_address',
            render: (default_address, record) => (
                <div>
                    {default_address === 29 ? (
                        <Tag color="green">Mặc định</Tag>
                    ) : (
                        <Button icon={<CheckOutlined />} onClick={() => handleUpdateStatusAddress(record.id)}>
                            Đặt làm mặc định
                        </Button>
                    )}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record) => (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa địa chỉ này?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Có"
                    cancelText="Không"
                    disabled={record.default_address === 29} // Disable delete for default address
                >
                    <Button type="primary" danger disabled={record.default_address === 29} icon={<DeleteOutlined />}>
                        Xóa
                    </Button>
                </Popconfirm>
            ),
        }
    ];

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    return (
        <div style={{ padding: 20 }}>
            <Button type="primary" onClick={showModal}>
                Thêm Địa Chỉ
            </Button>
            <Table
                columns={columns}
                dataSource={addressData}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: addressData.length,
                    onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                }}
                bordered
                style={{ marginTop: 20 }}
            />
            <Modal
                title="Thêm địa chỉ mới"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null} // We'll handle footer buttons within the AddAddress component
            >
                <AddAddress onSuccess={handleAddAddressSuccess} />
            </Modal>
        </div>
    );
};

export default ListAddress;
