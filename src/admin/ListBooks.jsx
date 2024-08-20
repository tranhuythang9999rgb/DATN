import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag, Space, message, Button } from 'antd';

function ListBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from API
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
                <Button type="link" onClick={() => handleDelete(record.id)}>
                    Xóa
                </Button>
            ),
        },
    ];
    const handleDelete = async (id) => {
        try {
            const response = await axios.patch(`http://127.0.0.1:8080/manager/book/delete`, null, {
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
    }; return (
        <div>
            <Table
                columns={columns}
                dataSource={books}
                loading={loading}
                rowKey="id"
            />
        </div>
    );
}

export default ListBooks;
