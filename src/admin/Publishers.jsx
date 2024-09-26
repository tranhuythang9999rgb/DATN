import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Form, Popconfirm, Avatar, Space, Upload, Typography } from 'antd';
import axios from 'axios';
import './admin_index.css';
import PublisherUpdateModal from './PublisherUpdateModal'; // Import the modal component
import { FaCloudUploadAlt } from 'react-icons/fa';

const { Title } = Typography;
const { Search } = Input;

function Publishers() {
    const [publishers, setPublishers] = useState([]);
    const [filteredPublishers, setFilteredPublishers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const fetchPublishers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/publisher/list');
            if (response.data.code === 0) {
                setPublishers(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching publishers:', error);
            message.error('Lỗi khi lấy danh sách nhà xuất bản');
        } finally {
            setLoading(false);
        }
    };

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

    const addPublisher = async (values) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('address', values.address);
            formData.append('contact_number', values.contact_number);
            formData.append('website', values.website);
            formData.append('file', imageFile);  // Ensure the correct file is attached

            const response = await axios.post('http://127.0.0.1:8080/manager/publisher/add', formData);
            if (response.data.code === 0) {
                message.success('Thêm nhà xuất bản thành công!');
                fetchPublishers(); // Refresh the list
            } else {
                message.warning('Lỗi máy chủ, vui lòng kiểm tra lại thiết bị và kết nối mạng');
            }
        } catch (error) {
            console.error('Error adding publisher:', error);
            message.warning('Tên nhà xuất bản đã tồn tại');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8080/manager/publisher/delete?id=${id}`);
            if (response.data.code === 0) {
                message.success('Xóa nhà xuất bản thành công!');
                fetchPublishers();
            } else {
                message.error('Không thể xóa nhà xuất bản.');
            }
        } catch (error) {
            console.error('Error deleting publisher:', error);
            message.error('Lỗi khi xóa nhà xuất bản.');
        }
    };

    const columns = [
        {
            title: 'Ảnh Đại Diện',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, record) => <Avatar src={record.avatar} />
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'contact_number',
            key: 'contact_number',
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
            render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>,
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Ngày Cập Nhật',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa nhà xuất bản này không?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="danger">Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, publishers]);

    const handleSearch = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (lowercasedValue === '') {
            setFilteredPublishers(publishers);
        } else {
            const filtered = publishers.filter(publisher => 
                publisher.name.toLowerCase().includes(lowercasedValue) ||
                publisher.address.toLowerCase().includes(lowercasedValue) ||
                publisher.contact_number.toLowerCase().includes(lowercasedValue)
            );
            setFilteredPublishers(filtered);
        }
    };

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
                        <Input placeholder="Tên nhà xuất bản" />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input placeholder="Địa chỉ" />
                    </Form.Item>
                    <Form.Item
                        name="contact_number"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại liên hệ' }]}
                    >
                        <Input placeholder="Số điện thoại liên hệ" />
                    </Form.Item>
                    <Form.Item
                        name="website"
                    >
                        <Input placeholder="Website" />
                    </Form.Item>
                    <Upload
                        maxCount={1}
                        listType="picture"
                        accept="image/jpeg,image/png"
                        beforeUpload={(file) => {
                            setImageFile(file);
                            return false;  // Prevent auto-upload
                        }}
                        onRemove={() => {
                            setImageFile(null);
                        }}
                    >
                        <FaCloudUploadAlt />
                    </Upload>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
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
           
            <Search
                placeholder="Tìm kiếm theo Tên nhà xuất bản, Địa chỉ, Số điện thoại liên hệ"
                allowClear
                enterButton="Tìm kiếm"
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                style={{ marginBottom: 16 }}
            />
            <Table
                columns={columns}
                dataSource={filteredPublishers}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

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
