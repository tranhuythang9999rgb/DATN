import { Form, Input, InputNumber, Upload, Button, message, DatePicker, Select, Col, Row, Tag, Tooltip, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import './admin_index.css';
import { TiDocumentDelete } from "react-icons/ti";
import DetailBook from "./DetailBook";
import CountrySelect from "./CountrySelect";

function UploadBook() {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [typeBooks, setTypeBooks] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const onChange = ({ fileList }) => {
        setFileList(fileList);
    };

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

    // Fetch authors
    const fetchAuthors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/author_book/list');
            if (response.data.code === 0) {
                setAuthors(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
            message.error('Error fetching authors');
        } finally {
            setLoading(false);
        }
    };

    // Fetch type books
    const fetchTypeBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/type_book/list');
            if (response.data.code === 0) {
                setTypeBooks(response.data.body);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách loại sách:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch publishers
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

    useEffect(() => {
        fetchAuthors();
        fetchTypeBooks();
        fetchPublishers();
    }, []);

    // Handle form submission
    const handleFormSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('author_name', values.author_name);
            formData.append('publisher', values.publisher);
            formData.append('published_date', values.published_date.format('YYYY-MM-DD HH:mm:ss'));
            formData.append('isbn', values.isbn);
            formData.append('genre', values.genre);
            formData.append('description', values.description);
            formData.append('language', selectedCountry || ''); // Quốc gia từ CountrySelect
            formData.append('page_count', values.page_count);
            formData.append('dimensions', values.dimensions);
            formData.append('weight', values.weight);
            formData.append('price', values.price);
            formData.append('discount_price', values.discount_price);
            formData.append('quantity', values.quantity);
            formData.append('opening_status', values.opening_status ? values.opening_status.value : 15); // Handle Select value

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

            if (response.data.code === 0) {
                fetchBooks();
                message.success('Sách được tải lên thành công');
            } else {
                message.error('Server error, please try again');
            }
        } catch (error) {
            message.error('Server error, please try again');
        }
    };

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
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
            title: 'Giảm giá',
            dataIndex: 'discount_price',
            key: 'discount_price',
        },
        {
            title: 'Số lượng sách',
            dataIndex: 'quantity',
            key: 'quantity',
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
            <Row>
                <Form {...layout} form={form} className="form-container-upload-book-2" onFinish={handleFormSubmit}>
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="author_name" label="Tên tác giả" rules={[{ required: true }]}>
                        <Select
                            mode="tags"
                            maxCount={1}
                            options={authors.map(author => ({ value: author.name, label: author.name }))}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item name="publisher" label="Nhà xuất bản" rules={[{ required: true }]}>
                        <Select
                            mode="tags"
                            maxCount={1}
                            options={publishers.map(publisher => ({ value: publisher.name, label: publisher.name }))}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item name="published_date" label="Ngày xuất bản" rules={[{ required: true }]}>
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>
                    <Form.Item name="isbn" label="ISBN" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="genre" label="Thể loại" rules={[{ required: true }]}>
                        <Select
                            mode="tags"
                            maxCount={1}
                            options={typeBooks.map(typeBook => ({ value: typeBook.name, label: typeBook.name }))}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="language" label="Quốc gia" >
                        <CountrySelect onCountryChange={setSelectedCountry} />
                    </Form.Item>
                    <Form.Item name="page_count" label="Số trang" rules={[{ required: true }]}>
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item name="dimensions" label="Kích thước" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="weight" label="Trọng lượng" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="discount_price" label="Giá giảm">
                        <InputNumber min={0} max={99} />
                    </Form.Item>

                    <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                        <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item name="opening_status" label="Tình trạng mở" >
                        <Select
                            defaultValue={15}
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
                            onChange={onChange}
                            beforeUpload={() => false} // Prevent auto-upload
                        >
                            {'+ Tải lên'}
                        </Upload>
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit">Tải lên</Button>
                    </Form.Item>
                </Form>
            </Row>
            <Row>
                <Col span={24}>
                    <Table
                        columns={columns}
                        dataSource={books}
                        pagination={{ pageSize: 10 }}
                        loading={loading}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default UploadBook;
