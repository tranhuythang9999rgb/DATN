import React, { useEffect, useState } from 'react';
import { List, Avatar, Col, Row, Button, Tooltip } from 'antd';
import axios from 'axios';
import GetTheShippingAddress from './GetTheShippingAddress';
import { IoReturnUpBack } from 'react-icons/io5';
import ListCart from './ListCart';

function ProFile() {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8080/manager/user/profile', {
                    params: {
                        name: 'thangth1', // Tên tài khoản bạn muốn lấy thông tin
                    },
                });

                if (response.data.code === 0) {
                    setProfileData(response.data.body);
                } else {
                    console.log('Có lỗi xảy ra:', response.data.message);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };

        fetchProfileData();
    }, []);

    if (!profileData) {
        return <div>Loading...</div>;
    }

    const data = [
        { title: 'Tên tài khoản', description: profileData.username },
        { title: 'Email', description: profileData.email },
        { title: 'Họ và tên', description: profileData.full_name },
        { title: 'Địa chỉ', description: profileData.address },
    ];
    const handlerGoBack = () => {
        window.location.reload()
    }
    return (
        <div>
            <Row>
                <Tooltip title="Quay lại">
                    <IoReturnUpBack onClick={handlerGoBack} style={{ fontSize: '25px', cursor: 'pointer', marginLeft: '20px' }} />
                </Tooltip>
            </Row>

            <Row>
                <Col span={8}>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Avatar size={128} src={profileData.avatar} />
                    </div>
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={<strong>{item.title}</strong>}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={8}>
                    <GetTheShippingAddress />
                </Col>
                <Col span={8}>
                <ListCart/>
                </Col>
            </Row>



        </div>
    );
}

export default ProFile;
