import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Form, DatePicker, Popconfirm, Upload, Avatar, Space } from 'antd';
import axios from 'axios';

function AuthorBook() {
    const [authors, setAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [searchBiography, setSearchBiography] = useState('');
    const [searchNationality, setSearchNationality] = useState('');

    // Function to fetch the list of authors
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

    // Function to add a new author
    const addAuthor = async (values) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('biography', values.biography);
            formData.append('birth_date', values.birth_date.format('YYYY-MM-DD'));
            formData.append('nationality', values.nationality);
            formData.append('file', imageFile);  // Đảm bảo đính kèm đúng file

            const response = await axios.post('http://127.0.0.1:8080/manager/author_book/add', formData);
            if (response.data.code === 0) {
                message.success('Author added successfully!');
                fetchAuthors(); // Refresh the list
            } else if (response.data.code === 2) {
                message.error('Author name already exists.');
            }
        } catch (error) {
            console.error('Error adding author:', error);
            message.error('Unable to add author.');
        }
    };

    // Function to delete an author by ID
    const handleDeleteBook = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8080/manager/author_book/delete?id=${id}`);
            if (response.data.code === 0) {
                message.success('Book deleted successfully!');
                fetchAuthors(); // Refresh the list
            } else {
                message.error('Failed to delete the book.');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            message.error('Unable to delete book.');
        }
    };

    // Function to filter authors based on search criteria
    const filterAuthors = () => {
        const filtered = authors.filter(author =>
            author.name.toLowerCase().includes(searchName.toLowerCase()) &&
            author.biography.toLowerCase().includes(searchBiography.toLowerCase()) &&
            author.nationality.toLowerCase().includes(searchNationality.toLowerCase())
        );
        setFilteredAuthors(filtered);
    };

    // Fetch authors when the component mounts
    useEffect(() => {
        fetchAuthors();
    }, []);

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
                    <Button type="primary" onClick={() => handleUpdate(record)}>
                        Sửa
                    </Button>
                    <span style={{ margin: '0 8px' }}>|</span>
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

    // Function to handle update action
    const handleUpdate = (record) => {
        console.log('Update:', record);
        // Add your update logic here, such as opening a modal or redirecting to an edit page
    };

    return (
        <div style={{ padding: '10px' }}>
            <h1>Quản Lý Tác Giả</h1>
            <Form
                layout="inline"
                onFinish={addAuthor}
                style={{ marginBottom: 10, maxWidth: 800 }}
            >
                <div style={{ display: 'flex' }}>
                    <Form.Item
                        name="name"
                        style={{
                            marginBottom: '10px'
                        }}
                    >
                        <Input
                            placeholder="Tên Tác Giả"
                            style={{ height: '40px' }}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="biography"
                    >
                        <Input
                            placeholder="Tiểu Sử"
                            style={{ height: '40px' }}
                            onChange={(e) => setSearchBiography(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="nationality"
                    >
                        <Input
                            placeholder="Quốc Tịch"
                            style={{ height: '40px' }}
                            onChange={(e) => setSearchNationality(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                height: '40px',
                                marginLeft: 8,
                                width: '195px',
                                paddingTop: '5px',
                            }}
                        >
                            Thêm Tác Giả
                        </Button>
                    </Form.Item>
                </div>
            </Form>
            <Space style={{ marginBottom: 16 }}>
                <Button style={{height:'42px'}} type="default" onClick={filterAuthors}>Tìm kiếm</Button>
            </Space>
            <Table
                columns={columns}
                dataSource={filteredAuthors}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}

export default AuthorBook;
