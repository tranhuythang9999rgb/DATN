import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';  // Import thư viện react-slick
import './slider_card.css';  // Assuming your styles are correct in this file
import { Badge, Button, Form, Image, Space } from 'antd';
import axios from 'axios';

const SliderCard = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Fetch data from API
        axios.get('http://localhost:8080/manager/book/sell/well')
            .then(response => {
                if (response.data && response.data.body && response.data.body.books) {
                    setBooks(response.data.body.books);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    // Cấu hình cho slider
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4, // Số card hiển thị
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {books.map((book) => (
                    <div key={book.id} className="card-container">
                       
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderCard;
