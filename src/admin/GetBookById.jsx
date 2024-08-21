import React, { useEffect } from 'react';
import { Form, Input, Button, message, Checkbox, Select } from 'antd';
import axios from 'axios';
import { RiFacebookBoxFill } from "react-icons/ri";

const { Option } = Select;

function GetBookById({ book }) {
    const [form] = Form.useForm();

    useEffect(() => {
        // Fetch book data when component mounts
        const fetchBookData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8080/manager/book/id', {
                    params: { id: book.id }
                });
                if (response.data.code === 0) {
                    // Set form fields with the API response
                    form.setFieldsValue(response.data.body);
                } else {
                    message.error('Không thể lấy dữ liệu sách');
                }
            } catch (error) {
                message.error('Đã xảy ra lỗi khi lấy dữ liệu sách');
            }
        };

        fetchBookData();
    }, [book.id, form]);

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const onFinish = (values) => {
        console.log('Giá trị form:', values);
    };

    // Map status code to label
    const statusOptions = [
        { value: 15, label: 'Mở bán' },
        { value: 0, label: 'Đóng bán' }
    ];

    return (
        <Form {...layout} form={form} onFinish={onFinish}>
            <Form.Item label="Tiêu đề" name="title">
                <Input />
            </Form.Item>
            <Form.Item label="Tên tác giả" name="author_name">
                <Input />
            </Form.Item>
            <Form.Item label="Nhà xuất bản" name="publisher">
                <Input />
            </Form.Item>
            <Form.Item label="Ngày xuất bản" name="published_date">
                <Input />
            </Form.Item>
            <Form.Item label="ISBN" name="isbn">
                <Input />
            </Form.Item>
            <Form.Item label="Thể loại" name="genre">
                <Input />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="Ngôn ngữ" name="language">
                <Input />
            </Form.Item>
            <Form.Item label="Số trang" name="page_count">
                <Input />
            </Form.Item>
            <Form.Item label="Kích thước" name="dimensions">
                <Input />
            </Form.Item>
            <Form.Item label="Cân nặng" name="weight">
                <Input />
            </Form.Item>
            <Form.Item label="Giá" name="price">
                <Input />
            </Form.Item>
            <Form.Item label="Giá giảm" name="discount_price">
                <Input />
            </Form.Item>
            <Form.Item label="Giá mua" name="purchase_price">
                <Input />
            </Form.Item>
            <Form.Item label="Số lượng" name="stock">
                <Input />
            </Form.Item>
            <Form.Item label="Ghi chú" name="notes">
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="Đang hoạt động" name="is_active" valuePropName="checked">
                <Checkbox />
            </Form.Item>
            <Form.Item label="Trạng thái mở bán" name="opening_status">
                <Select>
                    {statusOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                Chỉnh sửa
                </Button>
            </Form.Item>
        </Form>
    );
}

export default GetBookById;
