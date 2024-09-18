import { useEffect, useState } from "react";
import styles from './ListBookByAuthorName.module.css';
import CardProduct from "./CardProduct";

function ListBookByPublicsher() {
    const [books, setBooks] = useState([]);

    const handleGetListBookByPublicsherName = async () => {
        try {
            const publicsher = localStorage.getItem('publicsher');
            const response = await fetch(`http://127.0.0.1:8080/manager/book/list/by/publicsher?name=${publicsher}`);
            const data = await response.json();

            if (data.code === 0 && data.body) {
                setBooks(data.body.books);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    useEffect(() => {
        handleGetListBookByPublicsherName();
    }, []);

    return (
        <div>
            {books.length === 0 ? ( // Kiểm tra nếu không có sách
                <p>Chưa có sách nào từ nhà xuất bản này.</p> // Thông báo bằng tiếng Việt khi không có sách
            ) : (
                <div className={styles['books-container']}>
                    {books.map((item) => (
                        <div key={item.id} className={styles['book-card']}>
                            <CardProduct
                                bookId={item.id}
                                author_name={item.author_name}
                                discount_price={item.discount_price}
                                file_desc_first={item.file_desc_first}
                                price={item.price}
                                publisher={item.publisher}
                                title={item.title}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ListBookByPublicsher;
