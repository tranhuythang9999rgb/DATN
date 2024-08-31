import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd'; // Assuming you're using Ant Design for messages

const GetOrderById = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const orderId = localStorage.getItem('order_id') || 0;

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId || orderId === 0) {
                setError('Invalid order ID');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://127.0.0.1:8080/manager/order/infor?id=${orderId}`);
                if (response.data.code === 0) {
                    setOrder(response.data.body);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError('Error fetching order data');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {order ? (
                <div>
                    <h2>Order Information</h2>
                    <p><strong>ID:</strong> {order.id}</p>
                    <p><strong>Customer Name:</strong> {order.customer_name}</p>
                    <p><strong>Order Date:</strong> {order.order_date}</p>
                    <p><strong>Book ID:</strong> {order.book_id}</p>
                    <p><strong>Book Title:</strong> {order.book_title}</p>
                    <p><strong>Book Author:</strong> {order.book_author}</p>
                    <p><strong>Book Publisher:</strong> {order.book_publisher}</p>
                    <p><strong>Book Published Date:</strong> {order.book_published_date}</p>
                    <p><strong>Book ISBN:</strong> {order.book_isbn}</p>
                    <p><strong>Book Genre:</strong> {order.book_genre}</p>
                    <p><strong>Book Description:</strong> {order.book_description}</p>
                    <p><strong>Book Language:</strong> {order.book_language}</p>
                    <p><strong>Book Page Count:</strong> {order.book_page_count}</p>
                    <p><strong>Book Dimensions:</strong> {order.book_dimensions}</p>
                    <p><strong>Book Weight:</strong> {order.book_weight}</p>
                    <p><strong>Book Price:</strong> {order.book_price}</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Total Amount:</strong> {order.total_amount}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                </div>
            ) : (
                <p>No order information available</p>
            )}
        </div>
    );
};

export default GetOrderById;
