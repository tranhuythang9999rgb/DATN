import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';  // Import thư viện react-slick
import './slider_card.css';  // Assuming your styles are correct in this file
import axios from 'axios';
import CardProduct from '../Home/CardProduct';

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


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5, // Số card hiển thị
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



    return (
        <div className="slider-container">
            <Slider {...settings}>
                {books.map((book) => (
                    <div key={book.id} className="card-container">
                        <CardProduct
                            bookId={book.id}
                            author_name={book.author_name}
                            discount_price={book.discount_price}
                            file_desc_first={book.file_desc_first}
                            price={book.price}
                            publisher={book.publisher}
                            title={book.title}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderCard;
