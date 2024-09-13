import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import CardProduct from '../Home/CardProduct';
import styles from './Slider_card.module.css'; // Import CSS Module
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SliderCard = ({ onEventClick }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
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
        slidesToShow: 5,
        slidesToScroll: 1,
    };

    return (
        <div>
            <div className={styles.sliderContainer}>
                <Slider {...settings}>
                    {books.map((book) => (
                        <div key={book.id} className={styles.cardContainer}>
                            <CardProduct
                                onEventClick={onEventClick}
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
        </div>
    );
};

export default SliderCard;
