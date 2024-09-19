import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, Upload, Avatar } from 'antd';
import moment from 'moment';
import axios from 'axios';

const UpdateAuthorModal = ({ visible, onClose, onUpdate, author }) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (author) {
            form.setFieldsValue({
                name: author.name,
                biography: author.biography,
                nationality: author.nationality,
                birth_date: author.birth_date ? moment(author.birth_date) : null,
            });
        }
    }, [author, form]);

    const handleUpdate = async (values) => {
        const formData = new FormData();
        formData.append('id', author.id);
        formData.append('name', values.name);
        formData.append('biography', values.biography);
        formData.append('nationality', values.nationality);

        if (values.birth_date) {
            formData.append('birth_date', values.birth_date.format('YYYY-MM-DD'));
        }

        if (imageFile) {
            formData.append('file', imageFile);
        }

        try {
            const response = await axios.patch('http://127.0.0.1:8080/manager/author_book/update', formData);
            if (response.data.code === 0) {
                onUpdate(); // Gọi hàm để refresh danh sách
                onClose(); // Đóng modal sau khi cập nhật thành công
            } else {
                console.error('Error updating author:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating author:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            title="Cập nhật tác giả"
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>Hủy</Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>Cập nhật</Button>
            ]}
        >
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item name="name" label="Tên Tác Giả">
                    <Input />
                </Form.Item>
                <Form.Item name="biography" label="Tiểu Sử">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="nationality" label="Quốc Tịch">
                    <Input />
                </Form.Item>
                <Form.Item name="birth_date" label="Ngày Sinh">
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item label="Ảnh Đại Diện">
                    <Upload
                        maxCount={1}
                        listType="picture-card"
                        accept="image/jpeg,image/png"
                        beforeUpload={(file) => {
                            setImageFile(file);
                            return false;
                        }}
                        onRemove={() => setImageFile(null)}
                    >
                        {author?.avatar ? <Avatar src={author.avatar} size={64} /> : '+ Upload'}
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateAuthorModal;
