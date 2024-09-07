import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag } from 'antd';

const ListAddress = () => {
    const [addressData, setAddressData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Number of records per page

    useEffect(() => {
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

        fetchData();
    }, []);

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'user_name',
            key: 'user_name',
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
            render: (default_address) => (
                default_address === 29 ? <Tag color="green">Mặc định</Tag> : null
            ),
        }
    ];

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    return (
        <div style={{ padding: 20 }}>
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
            />
        </div>
    );
};

export default ListAddress;
