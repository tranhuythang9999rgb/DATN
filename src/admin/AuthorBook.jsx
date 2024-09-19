import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Form, DatePicker, Upload, Avatar, Space, Popconfirm } from 'antd';
import axios from 'axios';
import moment from 'moment';
import UpdateAuthorModal from './UpdateAuthorModal';  // Import modal

function AuthorBook() {
    const [authors, setAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [searchBiography, setSearchBiography] = useState('');
    const [searchNationality, setSearchNationality] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);  // State cho tác giả được chọn để cập nhật
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);  // State để hiển thị modal cập nhật

    const fetchAuthors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/author_book/list');
            if (response.data.code === 0) {
                setAuthors(response.data.body);
                setFilteredAuthors(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
            message.error('Error fetching authors');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBook = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8080/manager/author_book/delete?id=${id}`);
            if (response.data.code === 0) {
                message.success('Book deleted successfully!');
                fetchAuthors();
            } else {
                message.error('Failed to delete the book.');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            message.error('Unable to delete book.');
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên Tác Giả',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tiểu Sử',
            dataIndex: 'biography',
            key: 'biography',
        },
        {
            title: 'Ngày Sinh',
            dataIndex: 'birth_date',
            key: 'birth_date',
            render: (birth_date) => birth_date ? moment(birth_date).format('YYYY-MM-DD') : 'N/A',
        },
        {
            title: 'Ảnh Đại Diện',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (avatar) => (
                <Avatar src={avatar} size={64} />
            ),
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary" onClick={() => {
                        setSelectedAuthor(record);  // Set tác giả hiện tại
                        setUpdateModalVisible(true);  // Mở modal
                    }}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa tác giả này không?"
                        onConfirm={() => handleDeleteBook(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="dashed">Xóa</Button>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    useEffect(() => {
        fetchAuthors();
    }, []);

    return (
        <div style={{ padding: '10px' }}>
            <h1>Quản Lý Tác Giả</h1>
            <Table
                columns={columns}
                dataSource={filteredAuthors}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <UpdateAuthorModal
                visible={isUpdateModalVisible}
                onClose={() => setUpdateModalVisible(false)}  // Đóng modal
                onUpdate={fetchAuthors}  // Refresh danh sách sau khi cập nhật
                author={selectedAuthor}  // Truyền thông tin tác giả vào modal
            />
        </div>
    );
}

export default AuthorBook;
