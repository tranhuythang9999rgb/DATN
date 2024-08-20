import { Form, Input, InputNumber, Upload, Button, message, DatePicker } from "antd";
import axios from "axios";
import { useState } from "react";
import './admin_index.css';

function UploadBook() {

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const onChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleFormSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('author_name', values.author_name);
            formData.append('publisher', values.publisher);
            formData.append('published_date', values.published_date.format('YYYY-MM-DD HH:mm:ss')); // Use DatePicker's format method
            formData.append('isbn', values.isbn);
            formData.append('genre', values.genre);
            formData.append('description', values.description);
            formData.append('language', values.language);
            formData.append('page_count', values.page_count);
            formData.append('dimensions', values.dimensions);
            formData.append('weight', values.weight);
            formData.append('price', values.price);
            formData.append('discount_price', values.discount_price);
            formData.append('purchase_price', values.purchase_price);
            formData.append('condition', values.condition);
            formData.append('stock', values.stock);
            formData.append('notes', values.notes);
            formData.append('opening_status', values.opening_status);

            fileList.forEach((file) => {
                formData.append('file', file.originFileObj);
            });

            const response = await axios.post(
                'http://localhost:8080/manager/book/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log(response);
            if (response.data.code === 0) {
                message.success('Book uploaded successfully');
                return;
            } else {
                message.error('Server error, please try again');
                return;
            }
        } catch (error) {
            console.log(error);
            message.error('Server error, please try again');
            return;
        }
    };

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    return (
        <div>
            <Form {...layout} form={form} className="form-container-upload-book" onFinish={handleFormSubmit}>
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="author_name" label="Author Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="publisher" label="Publisher" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="published_date" label="Published Date" rules={[{ required: true }]}>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.Item name="isbn" label="ISBN" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="genre" label="Genre" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="language" label="Language" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="page_count" label="Page Count" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="dimensions" label="Dimensions" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="weight" label="Weight" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="discount_price" label="Discount Price" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="purchase_price" label="Purchase Price" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="condition" label="Condition" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="notes" label="Notes">
                    <Input.TextArea />
                </Form.Item>
              
                <Form.Item name="opening_status" label="Opening Status" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="file" label="File" valuePropName="fileList" getValueFromEvent={onChange}>
                <Upload
                        fileList={fileList}
                        listType="picture-card"
                        accept="image/jpeg,image/png"
                        onChange={onChange}
                        beforeUpload={() => false} // Prevent auto-upload
                    >
                        {'+ Upload'}
                    </Upload>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UploadBook;
