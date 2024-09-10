import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Form, Popconfirm, Upload, Avatar } from 'antd';
import axios from 'axios';
import './admin_index.css'; // Import your custom CSS

// Nhà Xuất Bản
function Publishers() {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    // Function to fetch the list of publishers
    const fetchPublishers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/publisher/list');
            if (response.data.code === 0) {
                setPublishers(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching publishers:', error);
            message.error('Error fetching publishers');
        } finally {
            setLoading(false);
        }
    };

    // Function to add a new publisher
    const addPublisher = async (values) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('address', values.address);
            formData.append('contact_number', values.contact_number);
            formData.append('website', values.website);
            formData.append('file', imageFile);  // Đảm bảo đính kèm đúng file

            const response = await axios.post('http://127.0.0.1:8080/manager/publisher/add', formData);
            if (response.data.code === 0) {
                message.success('Publisher added successfully!');
                fetchPublishers(); // Refresh the list
            } else if (response.data.code === 2) {
                message.error('Tên nhà xuất bản đã tồn tại');
            }
        } catch (error) {
            console.error('Error adding publisher:', error);
            message.error('Tên nhà xuất bản đã tồn tại.');
        }
    };

    // Function to delete a publisher by ID
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8080/manager/publisher/delete?id=${id}`);
            if (response.data.code === 0) {
                message.success('Publisher deleted successfully!');
                fetchPublishers(); // Refresh the list
            } else {
                message.error('Failed to delete publisher.');
            }
        } catch (error) {
            console.error('Error deleting publisher:', error);
            message.error('Unable to delete publisher.');
        }
    };

    // Function to handle edit action
    const handleEdit = (record) => {
        console.log('Edit:', record);
        // Add your edit logic here, such as opening a modal or redirecting to an edit page
    };

    // Fetch publishers when the component mounts
    useEffect(() => {
        fetchPublishers();
    }, []);

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên nhà xuất bản',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Số điện thoại liên hệ',
            dataIndex: 'contact_number',
            key: 'contact_number',
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
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
            title: '',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button
                        type="primary"
                        onClick={() => handleEdit(record)}
                        style={{ marginRight: 8 }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa nhà xuất bản này không?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="dashed">Xóa</Button>
                    </Popconfirm>
                </span>
            ),
        }
        
    ];

    return (
        <div style={{ padding: 10 }}>
            <h1>Nhà Xuất Bản</h1>
            <Form
                layout="inline"
                onFinish={addPublisher}
                style={{ marginBottom: 20, maxWidth: 800 }}
            >
                <div style={{ display: 'flex' }}>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên nhà xuất bản' }]}
                        style={{ marginBottom: '10px' }}
                    >
                        <Input className="custom-input" placeholder="Tên nhà xuất bản" />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input className="custom-input" placeholder="Địa chỉ" />
                    </Form.Item>
                    <Form.Item
                        name="contact_number"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại liên hệ' }]}
                    >
                        <Input className="custom-input" placeholder="Số điện thoại liên hệ" />
                    </Form.Item>
                    <Form.Item
                        name="website"
                    >
                        <Input className="custom-input" placeholder="Website" />
                    </Form.Item>
                    <Upload
                        maxCount={1}
                        listType="picture"
                        accept="image/jpeg,image/png"
                        beforeUpload={(file) => {
                            setImageFile(file);
                            return false;  // Ngăn upload tự động
                        }}
                        onRemove={() => {
                            setImageFile(null);
                        }}
                    >
                        +Upload
                    </Upload>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="custom-button"
                            style={{
                                padding: '20px',
                                width: '200px'
                            }}
                        >
                            Thêm Nhà Xuất Bản
                        </Button>
                    </Form.Item>
                </div>
            </Form>
            <Table
                columns={columns}
                dataSource={publishers}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}

export default Publishers;
