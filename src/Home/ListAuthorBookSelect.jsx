import React, { useState, useEffect } from 'react';
import { Button, Spin, Dropdown, Menu, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

function ListAuthorBookButton({ onAuthorNameChange, onEventClick }) {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState(null);

    // Function to fetch publishers from the API
    const fetchPublishers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/author_book/list');
            if (response.data.code === 0) {
                setPublishers(response.data.body);
            } else {
                message.error('Failed to load publishers.');
            }
        } catch (error) {
            console.error('Error fetching publishers:', error);
            message.error('Error fetching publishers.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublishers();
    }, []);

    // Handle menu item click
    const handleMenuClick = (e) => {
        const selected = publishers.find(publisher => publisher.id === e.key);
        if (selected) {
            setSelectedPublisher(selected);
            onAuthorNameChange(selected.name); // Notify parent with selected publisher's name
            if (onEventClick) onEventClick(); // Call the onEventClick function if provided
        }
    };

    // Create the dropdown menu
    const menu = (
        <Menu onClick={handleMenuClick}>
            {loading ? (
                <Menu.Item disabled>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
                </Menu.Item>
            ) : (
                publishers.map((publisher) => (
                    <Menu.Item key={publisher.id}>
                        {publisher.name}
                    </Menu.Item>
                ))
            )}
        </Menu>
    );

    return (
        <div>
            <Dropdown overlay={menu} trigger={['click']} disabled={loading}>
                <Button
                    style={{
                        border: 'none',
                        background: 'none',
                        boxShadow: 'none',
                        padding: 0,
                        color: 'black',
                        cursor: 'pointer',
                        fontSize: '15px'
                    }}
                >
                    {selectedPublisher ? selectedPublisher.name : 'Tác giả'}
                </Button>
            </Dropdown>
            {selectedPublisher && (
                <Button
                    style={{
                        marginLeft: 10,
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        color: '#1890ff',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        setSelectedPublisher(null);
                        onAuthorNameChange(null); // Notify parent that selection is cleared
                    }}
                >
                    Clear Selection
                </Button>
            )}
        </div>
    );
}

export default ListAuthorBookButton;
