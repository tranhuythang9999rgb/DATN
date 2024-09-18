import { Avatar, Badge, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import styles from './index_publicshder.module.css'; // Import CSS module

const defaultAvatar = 'https://example.com/default-avatar.jpg';

function ListPublicSher({ eventOnClick }) {
    const [publishers, setPublishers] = useState([]);

    const fetchPublishers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/publisher/list');
            if (response.data.code === 0) {
                setPublishers(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching publishers:', error);
            message.error('Error fetching publishers');
        } finally {
        }
    };

    // Fetch publishers on component mount
    useEffect(() => {
        fetchPublishers();
    }, []);

    // Slick slider settings
    const settings = {
        dots: false,
        infinite: true, // Use infinite scrolling correctly
        className: "center",
        centerMode: true,
        slidesToShow: 4,
        speed: 200,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: "linear",
    };

    const handleListBookByPublicSherName = (name) => {
        localStorage.setItem('publicsher', name);
        if (eventOnClick) {
            eventOnClick(name);
        }
    };

    return (
        <div className={styles.sliderContainer}>
            <Slider {...settings}>
                {publishers.map((publisher) => (
                    <div key={publisher.id} className={styles.slickSlide}> {/* Use publisher.id if available */}
                        <Badge.Ribbon style={{ width: '170px', height: '20px' }} text={publisher.name}>
                            <Avatar
                                onClick={() => handleListBookByPublicSherName(publisher.name)} // Handle click on avatar
                                size={200}
                                src={publisher.avatar || defaultAvatar}
                                fallback={defaultAvatar} // Use default avatar if image fails
                                style={{ cursor: 'pointer' }} // Make cursor pointer for clickable avatar
                            />
                        </Badge.Ribbon>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default ListPublicSher;
