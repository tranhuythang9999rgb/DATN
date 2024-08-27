import React, { useState } from 'react';
import axios from 'axios';
import { Table, Button, Drawer, message, Tooltip, Modal } from 'antd';
import { TiDocumentDelete } from 'react-icons/ti';
import { HiOutlineFolderPlus } from 'react-icons/hi2';
import UpSertFileByBookId from './UpSertFileByBookId';
import { TbListDetails } from 'react-icons/tb';
import UpdateBook from './UpdateBook';

function DetailBook({ book }) {  // Destructuring book prop
    const [images, setImages] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showAddFileModal, setShowAddFileModal] = useState(false);

    // Handle delete action for an image
    const handleDeleteImage = async (id) => {
        try {
            const response = await axios.delete('http://127.0.0.1:8080/manager/file/delete', {
                params: { id }
            });
            if (response.data.code === 0) {
                setImages(prevImages => prevImages.filter(image => image.id !== id));
                message.success('Image deleted successfully');
            } else {
                message.error('Failed to delete image');
            }
        } catch (error) {
            message.error('An error occurred while deleting the image');
        }
    };

    // Handle view details action and open drawer
    const handleViewDetails = async () => {
        try {
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

    // Toggle Add File Modal
    const toggleAddFileModal = () => {
        setShowAddFileModal(!showAddFileModal);
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

            <Tooltip title="Xem chi tiết">
                <Button type="primary" onClick={handleViewDetails}>
                    <TbListDetails />
                </Button>
            </Tooltip>
            <Drawer
                width={720}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                title={`Chi tiết sách: ${book.title}`}
            >
                <Button type="primary" onClick={toggleAddFileModal} style={{ marginBottom: 16 }}>
                    <HiOutlineFolderPlus /> Thêm tệp
                </Button>
                <UpdateBook book={book}/>

                <Modal
                    width={800}
                    visible={showAddFileModal}
                    onCancel={toggleAddFileModal}
                    footer={null}
                >
                    <UpSertFileByBookId anyId={book.id} load={handleViewDetails} />
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

export default DetailBook;
