import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag, Button, Drawer, message } from 'antd';
import { TiDocumentDelete } from 'react-icons/ti';
import { TbListDetails } from 'react-icons/tb';

function ListBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [images, setImages] = useState([]);

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

    // Handle view details action
    const handleViewDetails = async (book) => {
        try {
            setSelectedBook(book);
            const response = await axios.get('http://127.0.0.1:8080/manager/file/list', {
                params: { id: book.id }
            });
            if (response.data.code === 0) {
                setImages(response.data.body);
                setDrawerOpen(true);
            } else {
                message.error('Failed to fetch images');
            }
        } catch (error) {
            message.error('An error occurred while fetching images');
        }
    };

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
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button type="link" onClick={() => handleDelete(record.id)}>
                        <TiDocumentDelete style={{ fontSize: '30px' }} />
                    </Button>
                    <Button type="link" onClick={() => handleViewDetails(record)}>
                        <TbListDetails style={{ fontSize: '30px' }} />
                    </Button>
                </div>
            ),
        },
    ];

    // Columns for images table
    const imageColumns = [
        {
            title: 'Ảnh',
            dataIndex: 'url',
            key: 'url',
            render: url => (
                <img src={url} alt="Book" style={{ width: 100, height: 100, objectFit: 'cover' }} />
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: createdAt => new Date(createdAt * 1000).toLocaleDateString()
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={books}
                loading={loading}
                rowKey="id"
            />
            <Drawer
                width={720}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                title={selectedBook ? `Chi tiết sách: ${selectedBook.title}` : ''}
            >
                <Table
                    columns={imageColumns}
                    dataSource={images}
                    rowKey="id"
                />
            </Drawer>
        </div>
    );
}

export default ListBooks;
