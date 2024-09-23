import React, { useEffect, useState } from 'react';
import { Button, List, message, Modal, Radio, Table } from 'antd';
import axios from 'axios';
import AddAddress from './AddAddress';

function GetTheShippingAddress() {
    const [addressInfo, setAddressInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addressData, setAddressData] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const userData = JSON.parse(localStorage.getItem('userData'));
    const userName = userData ? userData.user_name : '';

    useEffect(() => {
        if (userName) {
            fetchAddress();
            fetchData();
        }
    }, [userName]);

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

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8080/manager/delivery_address/list?name=${userName}`);
            if (response.data.code === 0) {
                const sortedData = response.data.body.sort((a, b) => b.default_address - a.default_address);
                setAddressData(sortedData);
                const defaultAddress = sortedData.find(addr => addr.default_address);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress.id);
                }
            } else {
                console.error('Error fetching data:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleUpdateStatusAddress = async (id) => {
        try {
            const response = await axios.patch(`http://127.0.0.1:8080/manager/delivery_address/update`, null, {
                params: { name: userName, id }
            });
            if (response.data.code === 0) {
                localStorage.setItem('delivery_address', id)
                message.success('Địa chỉ mặc định đã được cập nhật thành công');
                fetchData();
                fetchAddress();
            } else {
                message.error('Lỗi khi cập nhật địa chỉ: ' + response.data.message);
            }
        } catch (error) {
            message.error('Lỗi khi cập nhật địa chỉ: ' + error.message);
        }
    };

    const handleRadioChange = (id) => {
        setSelectedAddressId(id);
        handleUpdateStatusAddress(id);
    };

    const handleAddAddressSuccess = () => {
        fetchData();
        message.success('Địa chỉ mới đã được thêm thành công');
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Chọn',
            dataIndex: 'id',
            key: 'select',
            render: (id) => (
                <Radio
                    checked={id === selectedAddressId}
                    onChange={() => handleRadioChange(id)}
                />
            )
        },
        { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province' },
        { title: 'Quận/Huyện', dataIndex: 'district', key: 'district' },
        { title: 'Phường/Xã', dataIndex: 'commune', key: 'commune' },
        { title: 'Chi tiết địa chỉ', dataIndex: 'detailed', key: 'detailed' },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (text, record) => (
                <span>{record.default_address ? 'Mặc định' : 'Không mặc định'}</span>
            ),
        },
    ];

    return (
        <div style={{ width: '700px', marginRight: '400px' }}>
            <h1>Thông tin địa chỉ giao hàng mặc định</h1>
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : addressInfo ? (
                <List
                    bordered
                    dataSource={[
                        { label: 'Tên người nhận', value: addressInfo.nick_name },
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
                <p>Chưa có thông tin địa chỉ giao hàng</p>
            )}

            <Button onClick={showModal}>Thay đổi địa chỉ</Button>
            <div style={{ color: 'green', marginTop: '50px' }}>

            </div>
            <Modal
                title="Quản lý địa chỉ giao hàng"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
            >
                <Table dataSource={addressData} columns={columns} rowKey="id" />
                <div>
                    <AddAddress onSuccess={handleAddAddressSuccess} />
                </div>
            </Modal>
        </div>
    );
}

export default GetTheShippingAddress;