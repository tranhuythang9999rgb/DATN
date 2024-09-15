import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag, Button, message, Tooltip, Space, Input } from 'antd';
import { TiDocumentDelete } from 'react-icons/ti';
import DetailBook from './DetailBook';

function ListBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchAuthor, setSearchAuthor] = useState('');
    const [searchPublisher, setSearchPublisher] = useState('');
    const [searchGenre, setSearchGenre] = useState('');

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

    // Handle search input changes
    const handleTitleChange = (event) => {
        setSearchTitle(event.target.value.trim());
    };

    const handleAuthorChange = (event) => {
        setSearchAuthor(event.target.value.trim());
    };

    const handlePublisherChange = (event) => {
        setSearchPublisher(event.target.value.trim());
    };

    const handleGenreChange = (event) => {
        setSearchGenre(event.target.value.trim());
    };

    // Filter books based on search criteria
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        book.author_name.toLowerCase().includes(searchAuthor.toLowerCase()) &&
        book.publisher.toLowerCase().includes(searchPublisher.toLowerCase()) &&
        book.genre.toLowerCase().includes(searchGenre.toLowerCase())
    );

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
                    <DetailBook book={record}/>
                </div>
            ),
        }
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Tìm kiếm theo tên sách"
                    onChange={handleTitleChange}
                />
                <Input
                    placeholder="Tìm kiếm theo tác giả"
                    onChange={handleAuthorChange}
                />
                <Input
                    placeholder="Tìm kiếm theo nhà xuất bản"
                    onChange={handlePublisherChange}
                />
                <Input
                    placeholder="Tìm kiếm theo thể loại"
                    onChange={handleGenreChange}
                />
                <Button onClick={() => {
                    setSearchTitle('');
                    setSearchAuthor('');
                    setSearchPublisher('');
                    setSearchGenre('');
                }}>Xóa tìm kiếm</Button>
            </Space>
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
