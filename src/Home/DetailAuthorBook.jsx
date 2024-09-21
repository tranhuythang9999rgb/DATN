import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Image, Row } from "antd";
import styles from './DetailAuthorBook.module.css'; // Import CSS Module

function DetailAuthorBook({authorBooName}) {
    const [author, setAuthor] = useState(null); // State to store author data
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track errors

    useEffect(() => {
        const author = "Nam Cao";
        const fetchAuthorDetails = async () => {
            try {
                const response = await axios.get(
                    'http://127.0.0.1:8080/manager/author_book/details',
                    { params: { name: author } }
                );

                if (response.data.code === 0) {
                    setAuthor(response.data.body); // Set author data
                } else {
                    setError("Không thể lấy thông tin tác giả.");
                }
            } catch (err) {
                setError(err.message || "Đã xảy ra lỗi.");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorDetails(); // Call the function on component mount
    }, []);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className={styles.container}>
            {author ? (
                <div>
                    <div className={styles.authorDetails}>
                        <Col className={styles.column}>
                            <Image width={600} height={400} src={author.avatar} />
                        </Col>
                        <Col className={styles.column}>
                            <h1>Chi tiết Tác giả</h1>
                            <p><strong>Tên:</strong> {author.name}</p>
                            <p><strong>Ngày sinh:</strong> {author.birth_date}</p>
                            <p><strong>Quốc tịch:</strong> {author.nationality}</p>
                            <p><strong>Tiểu sử:</strong> {author.biography}</p>
                        </Col>

                    </div>
                </div>

            ) : (
                <p>Không có thông tin tác giả.</p>
            )}
        </div>
    );
}

export default DetailAuthorBook;
