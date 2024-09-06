import React, { useEffect, useState } from 'react';
import { List, Avatar } from 'antd';
import axios from 'axios';

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
        { title: 'Số điện thoại', description: profileData.phone_number },
        { title: 'Role', description: profileData.role },
    ];

    return (
        <div>
            <h1>Thông tin người dùng</h1>
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
         
        </div>
    );
}

export default ProFile;
