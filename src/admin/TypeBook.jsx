import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message } from 'antd';
import axios from 'axios';

const { Search } = Input;

function TypeBook() {
    const [typeBooks, setTypeBooks] = useState([]);
    const [newTypeName, setNewTypeName] = useState('');
    const [loading, setLoading] = useState(false);

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
    ];

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
                pagination={false}
            />
        </div>
    );
}

export default TypeBook;
