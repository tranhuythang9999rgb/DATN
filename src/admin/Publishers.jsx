import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Form, Popconfirm, Avatar, Space, Upload } from 'antd';
import axios from 'axios';
import './admin_index.css';
import PublisherUpdateModal from './PublisherUpdateModal'; // Import the modal component

// Nhà Xuất Bản
function Publishers() {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [searchParams, setSearchParams] = useState({
        name: '',
        address: '',
        contact_number: '',
        website: '',
    });
    const [selectedPublisher, setSelectedPublisher] = useState(null); // Track selected publisher
    const [isModalVisible, setModalVisible] = useState(false); // Modal visibility

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

    // Handle edit button click
    const handleEdit = (record) => {
        setSelectedPublisher(record);
        setModalVisible(true); // Show the modal
    };

    const handleUpdateSuccess = () => {
        fetchPublishers();
    };

    useEffect(() => {
        fetchPublishers();
    }, []);

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

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8080/manager/publisher/delete?id=${id}`);
            if (response.data.code === 0) {
                message.success('Publisher deleted successfully!');
                fetchPublishers();
            } else {
                message.error('Failed to delete publisher.');
            }
        } catch (error) {
            console.error('Error deleting publisher:', error);
            message.error('Unable to delete publisher.');
        }
    };

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, record) => (
                <Avatar src={record.avatar} />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Contact Number',
            dataIndex: 'contact_number',
            key: 'contact_number',
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
            render: (text) => (
                <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Updated At',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this publisher?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <Button type="danger">Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 10 }}>
            <h1>Publishers</h1>
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
            </Form>            <Table
                columns={columns}
                dataSource={publishers}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* Modal for updating publisher */}
            {selectedPublisher && (
                <PublisherUpdateModal
                    visible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    publisher={selectedPublisher}
                    onUpdate={handleUpdateSuccess}
                />
            )}
        </div>
    );
}

export default Publishers;
