import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Function to call the API and get the list of books
const getListBookUserBook = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8080/manager/book/list');
        return response.data.body; // Return the list of books
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sách:', error);
        return [];
    }
};

// React component to display the list of books
function GetListBookUserBook() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const bookList = await getListBookUserBook();
            setBooks(bookList); // Set the books to the state
        };

        fetchBooks();
    }, []);

    return (
        <div>
            <h1>Danh sách sách</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {books.map((book) => (
                    <li key={book.id}>
                        <div style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '16px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#fff'
                        }}>
                            <h2>{book.title}</h2>
                            <p><strong>Tác giả:</strong> {book.author_name}</p>
                            <p><strong>Giá:</strong> {book.price}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GetListBookUserBook;
