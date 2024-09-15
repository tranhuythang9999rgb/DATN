import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Table, Spin } from 'antd';

function ListCustomer() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,  // Items per page
    });

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const fetchData = (page, pageSize) => {
        setLoading(true);
        // Call the API to fetch customer data with pagination
        axios.get('http://127.0.0.1:8080/manager/user/list/use/admin')
            .then((response) => {
                if (response.data.code === 0) {
                    setCustomers(response.data.body); // Save customers to state
                    setPagination({
                        ...pagination,
                        total: response.data.body.length, // Set total for pagination
                    });
                }
            })
            .catch((error) => {
                console.error('There was an error fetching the customer list:', error);
            })
            .finally(() => {
                setLoading(false); // Hide loading spinner after request completes
            });
    };

    const handleTableChange = (pagination) => {
        setPagination({
            ...pagination,
            current: pagination.current,
        });
    };

    const columns = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            key: 'avatar',
            render: avatar => <Avatar src={avatar} />,  // Display avatar
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
            render: (text, record) => record.full_name || record.username,  // Fallback to username if full name is empty
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
    ];

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <Table
            columns={columns}
            dataSource={customers}
            pagination={pagination}
            loading={loading}
            rowKey="id"
            onChange={handleTableChange}
        />
    );
}

export default ListCustomer;
