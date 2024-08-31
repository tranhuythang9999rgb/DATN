import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Popconfirm } from 'antd';
import axios from 'axios';

// Loại sách
const { Search } = Input;

function TypeBook() {
    const [typeBooks, setTypeBooks] = useState([]);
    const [newTypeName, setNewTypeName] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch the list of type books
    const fetchTypeBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/type_book/list');
            if (response.data.code === 0) {
                setTypeBooks(response.data.body);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách loại sách:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add a new type book
    const addTypeBook = async () => {
        if (!newTypeName.trim()) {
            message.error('Vui lòng nhập tên loại sách');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', newTypeName);

            const response = await axios.post('http://127.0.0.1:8080/manager/type_book/add', formData);
            if (response.data.code === 0) {
                message.success('Thêm loại sách thành công!');
                setNewTypeName('');
                fetchTypeBooks(); // Refresh the list
            } else if (response.data.code === 2) {
                message.error('Tên loại sách đã tồn tại.');
            }
        } catch (error) {
            console.error('Lỗi khi thêm loại sách:', error);
            message.error('Không thể thêm loại sách.');
        }
    };

    // Function to handle delete action
    const handleDelete = async (record) => {
        const { id } = record;
        try {
            const response = await axios.delete(`http://127.0.0.1:8080/manager/type_book/delete?id=${id}`);
            if (response.data.code === 0) {
                message.success('Xóa loại sách thành công!');
                fetchTypeBooks(); // Refresh the list after deletion
            } else {
                message.error('Không thể xóa loại sách.');
            }
        } catch (error) {
            console.error('Lỗi khi xóa loại sách:', error);
            message.error('Có lỗi xảy ra khi xóa loại sách.');
        }
    };

    useEffect(() => {
        fetchTypeBooks();
    }, []);

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên loại sách',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active) => (is_active ? 'Hoạt động' : 'Không hoạt động'),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a href="#" onClick={() => handleEdit(record)}>Sửa</a>
                    <span> | </span>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa loại sách này không?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <a href="#">Xóa</a>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    // Function to handle edit action (you can expand this)
    const handleEdit = (record) => {
        console.log('Edit:', record);
        // Add your edit logic here
    };

    return (
        <div>
            <h1>Loại Sách</h1>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, maxWidth: 400 }}>
                <Input
                    placeholder="Nhập tên loại sách mới"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    style={{ height: '40px' }}
                />
                <Button
                    type="primary"
                    onClick={addTypeBook}
                    style={{
                        height: '40px',
                        marginLeft: 8,
                    }}
                >
                    Thêm
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={typeBooks}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}

export default TypeBook;
