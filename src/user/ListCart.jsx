import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { List, Typography, Spin, Alert, Button, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ListCart = forwardRef((props, ref) => {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch cart list
    const fetchCartList = async () => {
        setLoading(true);
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            const response = await axios.get('http://127.0.0.1:8080/manager/cart/list', {
                params: { name: userData.user_name }
            });

            if (response.data.code === 0) {
                setCarts(response.data.body.carts);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Cuộc gọi API thất bại');
        } finally {
            setLoading(false);
        }
    };

    // Expose the fetchCartList function to the parent component via ref
    useImperativeHandle(ref, () => ({
        reloadCart: fetchCartList
    }));

    useEffect(() => {
        fetchCartList();
    }, []);

    const handleDelete = (cartId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa mục này khỏi giỏ hàng?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await axios.delete('http://127.0.0.1:8080/manager/cart/delete', {
                        params: { id: cartId }
                    });

                    if (response.data.code === 0) {
                        setCarts(carts.filter(item => item.cart_id !== cartId));
                    } else {
                        setError(response.data.message);
                    }
                } catch (err) {
                    setError('Cuộc gọi API xóa thất bại');
                }
            }
        });
    };

    if (loading) {
        return <Spin tip="Đang tải..." />;
    }

    if (error) {
        return <Alert message="Lỗi" description={error} type="error" />;
    }

    return (
        <div>
            <Title level={2}>Giỏ hàng của bạn</Title>
            {carts.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={carts}
                    renderItem={item => (
                        <List.Item
                            style={{
                                border: '1px solid #d9d9d9',
                                borderRadius: '4px',
                                marginBottom: '10px',
                                padding: '10px'
                            }}
                            actions={[
                                <Button
                                    type="danger"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDelete(item.cart_id)}
                                >
                                    Xóa
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={<Text strong>Mã sách:</Text>}
                                description={item.book_id}
                            />
                            <List.Item.Meta
                                title={<Text strong>Tên sách:</Text>}
                                description={item.book_name}
                            />
                            <List.Item.Meta
                                title={<Text strong>Số lượng:</Text>}
                                description={item.quantity}
                            />
                            <List.Item.Meta
                                title={<Text strong>Giá:</Text>}
                                description={item.price}
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Text>Giỏ hàng của bạn đang trống</Text>
            )}
        </div>
    );
});

export default ListCart;
