import React, { useEffect } from 'react';
import { Form, Input, Button, message, Checkbox, Select, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

function UpdateBook({ book }) {
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
                    const bookData = response.data.body;
                    // Convert date string to moment object
                    bookData.published_date = bookData.published_date ? moment(bookData.published_date) : null;
                    // Ensure opening_status is in the correct format for labelInValue
                    bookData.opening_status = bookData.opening_status 
                        ? { value: bookData.opening_status, label: bookData.opening_status === 15 ? 'Mở bán' : 'Đóng bán' }
                        : null;
                    form.setFieldsValue(bookData);
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

    const handleFormSubmitUpdate = async (values) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('author_name', values.author_name);
            formData.append('publisher', values.publisher);
            formData.append('published_date', values.published_date ? values.published_date.format('YYYY-MM-DD') : ''); // Use moment's format method
            formData.append('isbn', values.isbn);
            formData.append('genre', values.genre);
            formData.append('description', values.description);
            formData.append('language', values.language);
            formData.append('page_count', values.page_count);
            formData.append('dimensions', values.dimensions);
            formData.append('weight', values.weight);
            formData.append('price', values.price);
            formData.append('discount_price', values.discount_price);
            formData.append('quantity', values.quantity);
            formData.append('notes', values.notes);
            formData.append('opening_status', values.opening_status ? values.opening_status.value : ''); // Handle Select value
            formData.append('id', book.id);

            const response = await axios.put(
                'http://127.0.0.1:8080/manager/book/update',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.code === 0) {
                message.success('Cập nhật sách thành công');
            } else {
                message.error('Lỗi server, vui lòng thử lại');
            }
        } catch (error) {
            message.error('Lỗi server, vui lòng thử lại');
        }
    };

    return (
        <Form {...layout} form={form} onFinish={handleFormSubmitUpdate}>
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
                <DatePicker format="YYYY-MM-DD" />
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

            <Form.Item label="Số lượng" name="quantity">
                <Input />
            </Form.Item>
            <Form.Item label="Ghi chú" name="notes">
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="Đang hoạt động" name="is_active" valuePropName="checked">
                <Checkbox />
            </Form.Item>
            <Form.Item label="Trạng thái mở bán" name="opening_status">
                <Select
                    labelInValue
                    style={{
                        width: '100%',
                    }}
                    options={[
                        {
                            value: 15,
                            label: 'Mở bán',
                        },
                        {
                            value: 17,
                            label: 'Đóng bán',
                        },
                    ]}
                />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Chỉnh sửa
                </Button>
            </Form.Item>
        </Form>
    );
}

export default UpdateBook;
