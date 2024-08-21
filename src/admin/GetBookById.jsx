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
                    message.error('Failed to fetch book data');
                }
            } catch (error) {
                message.error('An error occurred while fetching the book data');
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
        console.log('Form values:', values);
    };

    // Map status code to label
    const statusOptions = [
        { value: 15, label: 'Mở bán' },
        { value: 0, label: 'Đóng bán' }
    ];

    return (
        <Form {...layout} form={form} onFinish={onFinish}>
            <Form.Item label="Title" name="title">
                <Input />
            </Form.Item>
            <Form.Item label="Author Name" name="author_name">
                <Input />
            </Form.Item>
            <Form.Item label="Publisher" name="publisher">
                <Input />
            </Form.Item>
            <Form.Item label="Published Date" name="published_date">
                <Input />
            </Form.Item>
            <Form.Item label="ISBN" name="isbn">
                <Input />
            </Form.Item>
            <Form.Item label="Genre" name="genre">
                <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="Language" name="language">
                <Input />
            </Form.Item>
            <Form.Item label="Page Count" name="page_count">
                <Input />
            </Form.Item>
            <Form.Item label="Dimensions" name="dimensions">
                <Input />
            </Form.Item>
            <Form.Item label="Weight" name="weight">
                <Input />
            </Form.Item>
            <Form.Item label="Price" name="price">
                <Input />
            </Form.Item>
            <Form.Item label="Discount Price" name="discount_price">
                <Input />
            </Form.Item>
            <Form.Item label="Purchase Price" name="purchase_price">
                <Input />
            </Form.Item>
            <Form.Item label="Stock" name="stock">
                <Input />
            </Form.Item>
            <Form.Item label="Notes" name="notes">
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="Is Active" name="is_active" valuePropName="checked">
                <Checkbox />
            </Form.Item>
            <Form.Item label="Opening Status" name="opening_status">
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
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}

export default GetBookById;
