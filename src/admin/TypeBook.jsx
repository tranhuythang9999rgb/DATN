import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Popconfirm, Space, Modal, Form } from 'antd';
import axios from 'axios';

function TypeBook() {
    const [typeBooks, setTypeBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [newTypeName, setNewTypeName] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBook, setEditingBook] = useState(null); // Loại sách đang sửa
    const [editForm] = Form.useForm(); // Form để update loại sách

    const fetchTypeBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/type_book/list');
            if (response.data.code === 0) {
                setTypeBooks(response.data.body);
                setFilteredBooks(response.data.body);
            } else {
                message.error('Không thể lấy danh sách loại sách.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách loại sách:', error);
            message.error('Lỗi kết nối.');
        } finally {
            setLoading(false);
        }
    };

    const addTypeBook = async () => {
        if (!newTypeName.trim()) {
            message.error('Vui lòng nhập tên loại sách.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', newTypeName);

            const response = await axios.post('http://127.0.0.1:8080/manager/type_book/add', formData);
            if (response.data.code === 0) {
                message.success('Thêm loại sách thành công!');
                setNewTypeName('');
                fetchTypeBooks();
            } else if (response.data.code === 2) {
                message.error('Tên loại sách đã tồn tại.');
            } else {
                message.error('Không thể thêm loại sách.');
            }
        } catch (error) {
            console.error('Lỗi khi thêm loại sách:', error);
            message.error('Lỗi kết nối.');
        }
    };

    const handleDelete = async (record) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8080/manager/type_book/delete?id=${record.id}`);
            if (response.data.code === 0) {
                message.success('Xóa loại sách thành công!');
                fetchTypeBooks();
            } else {
                message.error('Không thể xóa loại sách.');
            }
        } catch (error) {
            console.error('Lỗi khi xóa loại sách:', error);
            message.error('Lỗi kết nối.');
        }
    };

    const handleEdit = (record) => {
        setEditingBook(record); // Lưu thông tin sách đang chỉnh sửa
        setIsModalVisible(true); // Mở modal
        editForm.setFieldsValue({ name: record.name }); // Điền tên sách hiện tại vào form
    };

    const handleUpdate = async () => {
        try {
            const values = await editForm.validateFields();
            const formData = new FormData();
            formData.append('id', editingBook.id);
            formData.append('name', values.name);

            const response = await axios.patch('http://127.0.0.1:8080/manager/type_book/update', formData);
            if (response.data.code === 0) {
                message.success('Cập nhật loại sách thành công!');
                fetchTypeBooks();
                setIsModalVisible(false); // Đóng modal
            } else {
                message.error('Không thể cập nhật loại sách.');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật loại sách:', error);
            message.error('Lỗi kết nối.');
        }
    };

    useEffect(() => {
        fetchTypeBooks();
    }, []);

    useEffect(() => {
        const filtered = typeBooks.filter(book =>
            book.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredBooks(filtered);
    }, [searchText, typeBooks]);

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên loại sách',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa loại sách này không?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type='dashed'>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1>Loại Sách</h1>
            <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                <Space>
                    <Input
                        placeholder="Nhập tên loại sách mới"
                        value={newTypeName}
                        onChange={(e) => setNewTypeName(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button type="primary" onClick={addTypeBook}>
                        Thêm
                    </Button>
                </Space>
                <Space style={{ marginTop: 16 }}>
                    <Input
                        placeholder="Tìm kiếm theo tên loại sách"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                </Space>
            </Space>
            <Table
                columns={columns}
                dataSource={filteredBooks}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
            
            {/* Modal for editing */}
            <Modal
                title="Cập nhật loại sách"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleUpdate}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item
                        label="Tên loại sách"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên loại sách' }]}
                    >
                        <Input placeholder="Nhập tên loại sách" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default TypeBook;
