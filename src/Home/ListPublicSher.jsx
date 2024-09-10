import { Avatar, Badge, Image, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import './index.css';

// Ảnh mặc định khi không có avatar
const defaultAvatar = 'https://example.com/default-avatar.jpg';

function ListPublicSher() {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPublishers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/publisher/list');
            if (response.data.code === 0) {
                setPublishers(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching publishers:', error);
            message.error('Error fetching publishers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublishers();
    }, []);

    const settings = {
        dots: true,
        infinite: false,
        className: "center",
        centerMode: true,
        infinite: true,
        slidesToShow: 4,
        speed: 200,
        slidesToScroll: 1,
        initialSlide: 0,


    };

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {publishers.map((publisher, index) => (
                    <div key={index}>
                        <Badge.Ribbon style={{width:'170px',height:'20px'}} text={publisher.name}>
                            <Avatar
                                size={220}
                                src={publisher.avatar || defaultAvatar}
                                fallback={defaultAvatar} // Nếu ảnh lỗi, dùng ảnh mặc định
                            />
                        </Badge.Ribbon>



                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default ListPublicSher;
