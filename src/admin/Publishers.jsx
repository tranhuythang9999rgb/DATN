import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Form } from 'antd';
import axios from 'axios';
import './admin_index.css'; // Import your custom CSS
//Nhà Xuất Bản
function Publishers() {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(false);

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

            const response = await axios.post('http://127.0.0.1:8080/manager/publisher/add', formData);
            if (response.data.code === 0) {
                message.success('Publisher added successfully!');
                fetchPublishers(); // Refresh the list
            } else if (response.data.code === 2) {
                message.error('Publisher name already exists.');
            }
        } catch (error) {
            console.error('Error adding publisher:', error);
            message.error('Unable to add publisher.');
        }
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
            title: 'Trạng thái',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active) => (is_active ? 'Hoạt động' : 'Không hoạt động'),
        },
    ];

    return (
        <div style={{ padding: 10 }}>
            <h1>Nhà Xuất Bản</h1>
            <Form
                layout="inline"
                onFinish={addPublisher}
                style={{ marginBottom: 20, maxWidth: 800 }}
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nhà xuất bản' }]}
                    style={{
                        marginBottom: '10px'
                    }}
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
