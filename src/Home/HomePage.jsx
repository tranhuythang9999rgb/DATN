import React, { useState, useEffect } from 'react';
import './home_index.css';
import { FcHome } from 'react-icons/fc';
import { Button, Modal } from 'antd';
import Login from '../common/Login';

function HomePage() {
    const [username, setUsername] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        // Check for the username in local storage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLoginClick = () => {
        setIsModalVisible(true);
    };

    const handleLogoutClick = () => {
        // Clear the username from local storage
        localStorage.removeItem('username');
        setUsername(null);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <div className='layout-home'>
            <div className='layout-header'>
                <div className='layout-header-start'></div>
                <div className='layout-header-center'>
                    <ul>
                        <li><FcHome />Trang chủ</li>
                        <li>Tin sách</li>
                        <li>Thư viện sách</li>
                        <li>Tác giả</li>
                        <li>Cuộc thi</li>
                        <li>Kiểm tra đơn hàng</li>
                        <li>
                            {username ? (
                                <Button onClick={handleLogoutClick}>Đăng xuất</Button>
                            ) : (
                                <>
                                    <Button onClick={handleLoginClick}>Đăng nhập</Button>
                                    <Modal
                                        title="Đăng nhập"
                                        visible={isModalVisible}
                                        onCancel={handleModalClose}
                                        footer={null}
                                    >
                                        <Login />
                                    </Modal>
                                </>
                            )}
                        </li>
                    </ul>
                </div>
                <div className='layout-header-end'></div>
            </div>
            <div className='layout-content'>
                {/* Content goes here */}
            </div>
            <div className='layout-footer'>
                {/* Footer content goes here */}
            </div>
        </div>
    );
}

export default HomePage;
