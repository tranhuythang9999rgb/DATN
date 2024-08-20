import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag, Button, Drawer, message, Tooltip, Modal } from 'antd';
import { TiDocumentDelete } from 'react-icons/ti';
import { TbListDetails } from 'react-icons/tb';
import { render } from '@testing-library/react';
import UpSertFileByBookId from './UpSertFileByBookId';
import { HiOutlineFolderPlus } from 'react-icons/hi2';

function ListBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [images, setImages] = useState([]);
    const [showAddFileModal, setShowAddFileModal] = useState(false);


    const toggleAddFileModal = () => {
        setShowAddFileModal(!showAddFileModal);
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
            key: 'delete',
            render: (_, record) => (
                <Tooltip title="Xóa sách">
                    <Button
                        type="link"
                        onClick={() => handleDelete(record.id)}
                        style={{ display: 'block', marginBottom: 8 }}
                    >
                        <TiDocumentDelete style={{ fontSize: '30px' }} />
                    </Button>
                </Tooltip>
            ),
        },
        {
            title: '',
            key: 'details',
            render: (_, record) => (
                <Tooltip title="Xem chi tiết">
                    <Button
                        type="link"
                        onClick={() => handleViewDetails(record)}
                    >
                        <TbListDetails style={{ fontSize: '30px' }} />
                    </Button>
                </Tooltip>
            ),
        },
    ];
    // Handle delete action for an image
    const handleDeleteImage = async (id) => {
        try {
            const response = await axios.delete('http://127.0.0.1:8080/manager/file/delete', {
                params: { id }
            });
            if (response.data.code === 0) {
                // Re-fetch the images after deletion
                const updatedImages = images.filter(image => image.id !== id);
                setImages(updatedImages);
                message.success('Image deleted successfully');
            } else {
                message.error('Failed to delete image');
            }
        } catch (error) {
            message.error('An error occurred while deleting the image');
        }
    };
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
        {
            title: 'Hành động',
            key: 'delete',
            render: (_, record) => (
                <Tooltip title="Xóa ảnh">
                    <Button
                        type="link"
                        onClick={() => handleDeleteImage(record.id)}
                    >
                        <TiDocumentDelete style={{ fontSize: '24px' }} />
                    </Button>
                </Tooltip>
            ),
        },
    ];

    return (
        <div>
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
            <Drawer
                width={720}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                title={selectedBook ? `Chi tiết sách: ${selectedBook.title}` : ''}
            >
                <Button type="primary" onClick={toggleAddFileModal}>
                    <HiOutlineFolderPlus />
                </Button>
                <Modal
                    width={800}
                    visible={showAddFileModal}
                    onCancel={toggleAddFileModal}
                    footer={null}
                >
                    {selectedBook && (
                        <UpSertFileByBookId anyId={selectedBook.id} />
                    )}
                </Modal>

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
