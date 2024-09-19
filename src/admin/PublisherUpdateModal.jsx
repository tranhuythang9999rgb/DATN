// PublisherUpdateModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import axios from 'axios';

const PublisherUpdateModal = ({ visible, onClose, publisher, onUpdate }) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = React.useState(null);

    useEffect(() => {
        if (publisher) {
            form.setFieldsValue({
                name: publisher.name,
                address: publisher.address,
                contact_number: publisher.contact_number,
                website: publisher.website,
            });
        }
    }, [publisher, form]);

    const handleUpdate = async (values) => {
        try {
            const formData = new FormData();
            formData.append('id', publisher.id);
            formData.append('name', values.name);
            formData.append('address', values.address);
            formData.append('contact_number', values.contact_number);
            formData.append('website', values.website);
            if (imageFile) {
                formData.append('file', imageFile);
            }

            const response = await axios.patch(`http://127.0.0.1:8080/manager/publisher/update`, formData);
            if (response.data.code === 0) {
                message.success('Publisher updated successfully!');
                onUpdate(); // Refresh list after update
                onClose();
            } else {
                message.error('Failed to update publisher.');
            }
        } catch (error) {
            console.error('Error updating publisher:', error);
            message.error('Unable to update publisher.');
        }
    };

    return (
        <Modal
            title="Update Publisher"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
            >
                <Form.Item
                    name="name"
                    label="Tên nhà xuất bản"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nhà xuất bản' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="contact_number"
                    label="Số điện thoại liên hệ"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại liên hệ' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="website"
                    label="Website"
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Ảnh Đại Diện">
                    <Upload
                        maxCount={1}
                        listType="picture"
                        accept="image/jpeg,image/png"
                        beforeUpload={(file) => {
                            setImageFile(file);
                            return false;
                        }}
                        onRemove={() => setImageFile(null)}
                    >
                        <Button>Upload Image</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Publisher
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PublisherUpdateModal;
