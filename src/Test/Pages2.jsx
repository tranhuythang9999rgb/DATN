import React, { Component } from 'react';

class Pages2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: null,
            isLoading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchBookDetails();
    }

    fetchBookDetails = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/manager/book/detail/page?id=7861741');
            const data = await response.json();
            if (data.code === 0) {
                this.setState({ book: data.body, isLoading: false });
            } else {
                this.setState({ error: 'Error fetching book details', isLoading: false });
            }
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
        }
    };

    render() {
        const { book, isLoading, error } = this.state;

        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <div>
                {book && (
                    <>
                        <span>Title: {book.title}</span><br />
                        <span>Author Name: {book.author_name}</span><br />
                        <span>Publisher: {book.publisher}</span><br />
                        <span>Published Date: {book.published_date}</span><br />
                        <span>ISBN: {book.isbn}</span><br />
                        <span>Genre: {book.genre}</span><br />
                        <span>Description: {book.description}</span><br />
                        <span>Language: {book.language}</span><br />
                        <span>Page Count: {book.page_count}</span><br />
                        <span>Dimensions: {book.dimensions}</span><br />
                        <span>Weight: {book.weight}</span><br />
                        <span>Price: {book.price}</span><br />
                        <span>Discount Price: {book.discount_price}</span><br />
                        <span>Stock: {book.stock}</span><br />
                        <span>Notes: {book.notes}</span><br />
                        <span>Is Active: {book.is_active ? 'Yes' : 'No'}</span><br />
                        <span>Opening Status: {book.opening_status}</span><br />
                        <div>
                            <span>Files{book.files}:</span><br />
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default Pages2;
