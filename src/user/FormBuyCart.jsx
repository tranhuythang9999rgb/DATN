import React from 'react';
import { Form, Button, notification } from 'antd';
import './user_index.css';
import ProductCard from './ProductCard';

const Context = React.createContext({
    name: 'Default',
});

function FormBuyCart() {
    // Lấy dữ liệu từ localStorage và phân tích JSON
    const listCart = localStorage.getItem('list_cart');
    const listCartJson = JSON.parse(listCart || '[]');

    // Sử dụng hook notification của Ant Design
    const [api, contextHolder] = notification.useNotification();

    // Tính tổng tiền
    const totalAmount = listCartJson.reduce((total, item) => total + item.total_amount, 0);

    // Hàm thông báo đặt hàng thành công
    const openNotification = (placement) => {
        api.success({
            message: 'Đặt hàng thành công!',
            description: (
                <Context.Consumer>
                    {({ name }) => `Cảm ơn bạn đã dặt hàng , ! Đơn hàng của bạn đã được ghi nhận. chúng tôi sẽ liên hệ ngay với bạn`}
                </Context.Consumer>
            ),
            placement,
            duration: 3, // Thời gian hiển thị thông báo (tính bằng giây)
        });
    };

    // Hàm xử lý khi nhấn nút "Mua ngay"
    const handleBuyNow = () => {
        // Logic cho nút "Mua ngay"
        console.log('Mua ngay');
    };

    // Hàm xử lý khi nhấn nút "Đặt hàng"
    const handleOrder = () => {
        // Logic khi đặt hàng
        console.log('Đặt hàng');
        // Gọi thông báo thành công
        openNotification('topRight');
    };

    return (
        <div>
            {contextHolder} {/* Để render thông báo */}
            <Form className="form-cart">
                <Form.Item>
                    <p style={{ color: '#87CEFA', fontSize: '25px' }}>
                        Tổng tiền: {totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </p>
                </Form.Item>
                <Form.Item>
                    {listCartJson.map((item) => (
                        <ProductCard
                            key={item.cart_id}
                            imageUrl={item.url} // Cần cập nhật URL hình ảnh thực tế
                            title={item.book_name}
                            price={item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            quantity={item.quantity}
                            sell="15" // Giảm giá, ví dụ giá cố định, cần thay đổi nếu có dữ liệu thực
                        />
                    ))}
                </Form.Item>
                <Form.Item className="form-item-button">
                    <Button
                        type="primary"
                        onClick={handleBuyNow}
                        className="form-button"
                    >
                        Mua ngay
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="default"
                        onClick={handleOrder}
                        className="form-button"
                    >
                        Đặt hàng
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default FormBuyCart;
