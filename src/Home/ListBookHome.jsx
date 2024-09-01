import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, List, Card, Typography, message,Carousel } from 'antd';

const { Title, Text } = Typography;

function  ListBookHome({ nameTypeBook }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch books data
    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://127.0.0.1:8080/manager/book/list/type_book?name=${encodeURIComponent(nameTypeBook)}`);
            if (response.data.code === 0) {
                setBooks(response.data.body);
            } else {
                message.error('Failed to fetch books');
            }
        } catch (err) {
            setError('Error fetching books');
            message.error('Error fetching books');
        } finally {
            setLoading(false);
        }
    };

    // Fetch books when the component mounts or nameTypeBook changes
    useEffect(() => {
        fetchBooks();
    }, [nameTypeBook]);

  return(
    <div>
        
    </div>
  )
}

export default ListBookHome;
