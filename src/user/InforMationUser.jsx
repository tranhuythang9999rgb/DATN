import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Avatar } from 'antd';

const InforMationUser = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUserData = JSON.parse(localStorage.getItem('userData'));
            const userName = storedUserData?.user_name;

            if (!userName) {
                console.error('Username not found in local storage');
                setError('Username not found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://127.0.0.1:8080/manager/user/profile?name=${userName}`);
                if (response.data.code === 0) {
                    setUserData(response.data.body);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Error fetching user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!userData) return <div>No user data available</div>;

    const { username, email, full_name, phone_number, avatar ,loyalty_points} = userData;

    const userInfo = [
        { title: 'Tên đăng nhập', value: username },
        { title: 'Email', value: email },
        { title: 'Họ và tên', value: full_name || username },
        { title: 'Số điểm tích lũy', value: loyalty_points },
    ];

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Avatar
                src={avatar}
                size={100}
                alt="Avatar"
                style={{ marginBottom: 20 }}
            />
            <List
                itemLayout="horizontal"
                dataSource={userInfo}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={item.title}
                            description={item.value}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default InforMationUser;
