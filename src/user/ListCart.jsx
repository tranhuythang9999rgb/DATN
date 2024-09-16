import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { List, Typography, Spin, Alert, Button, Modal, Checkbox, Tooltip, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import HomePage from '../Home/HomePage';
import { TiArrowBack } from 'react-icons/ti';

const { Title, Text } = Typography;

const ListCart = forwardRef(({ onEventClick }, ref) => {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);
    const [isNextHome,setIsNextHome] = useState(false);

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

    const handleCheckboxChange = (cartId) => {
        setCheckedItems(prevCheckedItems => {
            if (prevCheckedItems.includes(cartId)) {
                return prevCheckedItems.filter(id => id !== cartId);
            } else {
                return [...prevCheckedItems, cartId];
            }
        });
    };

    const handleBuyNow = () => {
        const selectedItems = carts.filter(item => checkedItems.includes(item.cart_id));
        const selectedItemsJSON = JSON.stringify(selectedItems);
        localStorage.setItem('list_cart', selectedItemsJSON);
        if (onEventClick) onEventClick(); // Call the onEventClick function if provided
    };

    if (loading) {
        return <Spin tip="Đang tải..." />;
    }

    if (error) {
        return <Alert message="Lỗi" description={error} type="error" />;
    }

    if(isNextHome) {
        return (
            <HomePage/>
        )
    }

    return (
        <div>
            <TiArrowBack style={{ fontSize: '50px', cursor: 'pointer' }} onClick={() => setIsNextHome(true)} />
            <Title level={2}>Giỏ hàng của bạn</Title>
            {carts.length > 0 ? (
                <div>
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
                                    <div>
                                        <Space>
                                            <Tooltip title="Chọn mục này">
                                                <Checkbox
                                                    checked={checkedItems.includes(item.cart_id)}
                                                    onChange={() => handleCheckboxChange(item.cart_id)}
                                                />
                                            </Tooltip>
                                            <Button
                                                type="danger"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDelete(item.cart_id)}
                                            >
                                                Xóa
                                            </Button>
                                        </Space>
                                    </div>
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
                                <List.Item.Meta
                                    title={<Text strong>Tổng số tiền:</Text>}
                                    description={item.total_amount}
                                />
                            </List.Item>
                        )}
                    />
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <Button
                            type="primary"
                            disabled={checkedItems.length === 0}
                            onClick={handleBuyNow}
                        >
                            Mua ngay
                        </Button>
                    </div>
                </div>
            ) : (
                <Text>Giỏ hàng của bạn đang trống</Text>
            )}
        </div>
    );
});

export default ListCart;
