import { Form, Input, InputNumber, Upload, Button, message, DatePicker, Select, Col, Row, Tag, Tooltip, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import './admin_index.css';
import { TiDocumentDelete } from "react-icons/ti";
import DetailBook from "./DetailBook";

function UploadBook() {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const onChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch books data
    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/book/list');
            if (response.data.code === 0) {
                setBooks(response.data.body);
            } else {
                message.error('Failed to fetch books');
            }
        } catch (error) {
            message.error('An error occurred while fetching books');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Handle delete action
    const handleDelete = async (id) => {
        try {
            const response = await axios.patch('http://127.0.0.1:8080/manager/book/delete', null, {
                params: { id }
            });
            if (response.data.code === 0) {
                fetchBooks();
                message.success('Book deleted successfully');
            } else {
                message.error('Failed to delete book');
            }
        } catch (error) {
            message.error('An error occurred while deleting the book');
        }
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
            formData.append('opening_status', values.opening_status ? values.opening_status.value : ''); // Handle Select value

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
                fetchBooks();
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
    const columns = [
        {
            title: 'Tên sách',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Tên tác giả',
            dataIndex: 'author_name',
            key: 'author_name',
        },
        {
            title: 'Nhà xuất bản',
            dataIndex: 'publisher',
            key: 'publisher',
        },

        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },

        {
            title: 'Giá mua',
            dataIndex: 'purchase_price',
            key: 'purchase_price',
        },
        {
            title: 'Số lượng sách',
            dataIndex: 'stock',
            key: 'stock',
        },

        {
            title: 'Tình trạng mở',
            dataIndex: 'opening_status',
            key: 'opening_status',
            render: (status) => (
                <Tag color={status === 15 ? 'green' : 'red'}>
                    {status === 15 ? 'Mở bán' : 'Đóng bán'}
                </Tag>
            ),
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Tooltip title="Xóa sách">
                        <Button
                            type="link"
                            onClick={() => handleDelete(record.id)}
                            style={{ display: 'block', marginBottom: 8 }}
                        >
                            <TiDocumentDelete style={{ fontSize: '30px' }} />
                        </Button>
                    </Tooltip>

                </div>
            ),
        },
        {
            title: '',
            key: 'action2',
            render: (_, record) => (
                <div>
                    <DetailBook book={record} />
                </div>
            ),
        }
    ];
    return (
        <div>
            <Row >
                <Col>
                    <Form {...layout} form={form} className="form-container-upload-book-2" onFinish={handleFormSubmit}>
                        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="author_name" label="Tên tác giả" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="publisher" label="Nhà xuất bản" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="published_date" label="Ngày xuất bản" rules={[{ required: true }]}>
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                        <Form.Item name="isbn" label="ISBN" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="genre" label="Thể loại" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item name="language" label="Ngôn ngữ" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="page_count" label="Số trang" rules={[{ required: true }]}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="dimensions" label="Kích thước" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="weight" label="Trọng lượng" rules={[{ required: true }]}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="discount_price" label="Giá giảm" rules={[{ required: true }]}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="purchase_price" label="Giá mua" rules={[{ required: true }]}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="stock" label="Số lượng sách" rules={[{ required: true }]}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="notes" label="Ghi chú">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item name="opening_status" label="Tình trạng mở" rules={[{ required: true }]}>
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
                        <Form.Item name="file" label="Ảnh mô tả" valuePropName="fileList" getValueFromEvent={onChange}>
                            <Upload
                                fileList={fileList}
                                listType="picture-card"
                                accept="image/jpeg,image/png"
                                onChange={onChange}
                                beforeUpload={() => false} // Prevent auto-upload
                            >
                                {'+ Tải lên'}
                            </Upload>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Gửi
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                    <Table
                        columns={columns}
                        dataSource={books}
                        loading={loading}
                        pagination={{
                            pageSize: 50,
                        }}
                        scroll={{
                            y: 500,
                        }}
                        rowKey="id"
                    />
                </Col>
            </Row>
        </div>
    );
}

export default UploadBook;
