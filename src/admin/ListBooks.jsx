import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag, Button, message, Tooltip, Input } from 'antd';
import { TiDocumentDelete } from 'react-icons/ti';
import DetailBook from './DetailBook';

const { Search } = Input;

function ListBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    // Handle search action
    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    // Filtered books based on search term
    const filteredBooks = books.filter(book => {
        return (
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Columns for books table
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
            title: 'Ngày xuất bản',
            dataIndex: 'published_date',
            key: 'published_date',
        },
        {
            title: 'Thể loại',
            dataIndex: 'genre',
            key: 'genre',
        },
        {
            title: 'Ngôn ngữ',
            dataIndex: 'language',
            key: 'language',
        },
        {
            title: 'Số trang',
            dataIndex: 'page_count',
            key: 'page_count',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Giá giảm',
            dataIndex: 'discount_price',
            key: 'discount_price',
        },
        {
            title: 'Số lượng sách',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'notes',
            key: 'notes',
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
            <h1>Quản lý sách</h1>
            <Search
                placeholder="Tìm kiếm theo Tên sách, Tác giả, Nhà xuất bản, Thể loại"
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
                dataSource={filteredBooks}
                loading={loading}
                pagination={{
                    pageSize: 10,
                }}
                scroll={{
                    y: 500,
                }}
                rowKey="id"
            />
        </div>
    );
}

export default ListBooks;
