import React, { useState, useEffect } from 'react';
import { message, Dropdown, Menu, Spin, Button } from 'antd';
import axios from 'axios';
import ListBookHome from '../Home/ListBookHome';

function Pages1() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isNext, setIsNext] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);

    const fetchAuthors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/type_book/list');
            console.log('Response data:', response.data); // Debugging
            if (response.data.code === 0) {
                setAuthors(response.data.body);
            } else {
                message.error('Failed to fetch authors');
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
            message.error('Error fetching authors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleMenuClick = (e) => {
        const selectedAuthor = authors.find(author => author.id === parseInt(e.key, 10));
        if (selectedAuthor) {
            setSelectedAuthor(selectedAuthor);
            setIsNext(true);
        }
    };

    if (isNext && selectedAuthor) {
        return <ListBookHome nameTypeBook={selectedAuthor.name} />;
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            {authors.map(author => (
                <Menu.Item key={author.id}>
                    {author.name}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <div style={{ padding: 20 }}>
            {loading ? (
                <Spin tip="Loading authors..." />
            ) : (
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button>
                        Thư viện sách
                    </Button>
                </Dropdown>
            )}
        </div>
    );
}

export default Pages1;
