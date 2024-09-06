import React, { useEffect, useState } from 'react';
import { List, message } from 'antd';
import axios from 'axios';

function GetTheShippingAddress() {
    const [addressInfo, setAddressInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userName = userData ? userData.user_name : '';

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8080/manager/delivery_address/infor/profile?name=${userName}`);
                if (response.data.code === 0) {
                    setAddressInfo(response.data.body);
                } else {
                    message.error(`Có lỗi xảy ra: ${response.data.message}`);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin địa chỉ:', error);
                message.error('Lỗi khi kết nối đến API');
            } finally {
                setLoading(false);
            }
        };

        if (userName) {
            fetchAddress();
        }
    }, [userName]);

    return (
        <div>
            <h1>Thông tin địa chỉ giao hàng</h1>
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : addressInfo ? (
                <List
                    bordered
                    dataSource={[
                        { label: 'Tên người dùng', value: addressInfo.user_name },
                        { label: 'Số điện thoại', value: addressInfo.phone_number },
                        { label: 'Email', value: addressInfo.email },
                        { label: 'Tỉnh/Thành phố', value: addressInfo.province },
                        { label: 'Quận/Huyện', value: addressInfo.district },
                        { label: 'Phường/Xã', value: addressInfo.commune },
                        { label: 'Chi tiết địa chỉ', value: addressInfo.detailed }
                    ]}
                    renderItem={item => (
                        <List.Item>
                            <strong>{item.label}:</strong> {item.value}
                        </List.Item>
                    )}
                />
            ) : (
                <p>Chưa có địa chỉ giao hàngthông tin địa chỉ</p>
            )}
        </div>
    );
}

export default GetTheShippingAddress;
