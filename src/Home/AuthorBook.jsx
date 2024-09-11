import { Avatar, Badge, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import style from './index_publicshder.module.css'; // Importing CSS module

const defaultAvatar = 'https://example.com/default-avatar.jpg';

function AuthorBook() {

    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAuthors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/author_book/list');
            if (response.data.code === 0) {
                setAuthors(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
            message.error('Error fetching authors');
        } finally {
            setLoading(false);
        }
    };

    // Fetch authors when the component mounts
    useEffect(() => {
        fetchAuthors();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        speed: 200,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: "linear",
    };

    return (
        <div className={style.sliderContainer}> {/* Use CSS Module class */}
            <Slider {...settings}>
                {authors.map((author, index) => (
                    <div key={index} className={style.slickSlide}> {/* Apply CSS Module classes */}
                        <div className={style.slickSlideDiv}>
                            <Badge.Ribbon style={{ width: '170px', height: '20px' }} text={author.name}>
                                <Avatar
                                    size={200}
                                    src={author.avatar || defaultAvatar}
                                    fallback={defaultAvatar}
                                />
                            </Badge.Ribbon>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default AuthorBook;
