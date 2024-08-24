import React, { useState, useEffect } from 'react';
import './home_index.css';
import { FcHome } from 'react-icons/fc';
import { Avatar, Button, Image, Modal, Tooltip } from 'antd';
import Login from '../common/Login';
import { CiLogin } from 'react-icons/ci';
import { GiArmoredBoomerang } from 'react-icons/gi';

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
                <div className='layout-header-start'>
                    <span>
                    <GiArmoredBoomerang style={{ display: 'flex', marginLeft: '10px', color: 'green', fontSize: '50px' }} />

                    </span>
                </div>
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

                                    <Tooltip title="Đăng nhập">
                                        <CiLogin style={{ fontSize: '20px', cursor: 'pointer' }} onClick={handleLoginClick} />
                                    </Tooltip>

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

                <div className='layout-content-image'>
                    <Image width='40%' src='https://th.bing.com/th/id/OIG2.gBo1U.SuIE.iiAHhpJnI?w=1024&h=1024&rs=1&pid=ImgDetMain' />
                </div>
                <div>

                </div>
            </div>
            <div className="layout-footer">
                <div className='layout-footer-tac-gia'>
                    <h3>Tác giả sách mới</h3>
                    {/* List of new book authors */}
                    <ul style={{ display: 'flex' }}>
                        <li>
                            <Avatar size={64} src='https://bizweb.dktcdn.net/100/363/455/articles/ta-c-gia-3.png?v=1724228914707'>
                            </Avatar>
                        </li>
                        <li>
                            <Avatar size={64} src='https://bizweb.dktcdn.net/100/363/455/articles/ta-c-gia-3.png?v=1724228914707'>
                            </Avatar>
                        </li>
                        <li>
                            <Avatar size={64} src='https://bizweb.dktcdn.net/100/363/455/articles/ta-c-gia-3.png?v=1724228914707'>
                            </Avatar>
                        </li>
                        {/* Add more authors as needed */}
                    </ul>
                </div>
                <div className='layout-footer-nhaf-xuatban'>
                    <h3>Các đối tác</h3>
                    {/* List of publishers */}
                    <ul style={{ display: 'flex' }}>
                        <li>
                         <Avatar></Avatar>
                        </li>
                        <li>
                        <Avatar></Avatar>

                        </li>
                        <li>
                        <Avatar></Avatar>

                        </li>
                        {/* Add more publishers as needed */}
                    </ul>
                </div>
                <div className='layout-footer-lien-he'>
                    <h3>Liên hệ</h3>
                    {/* Contact information or other footer content */}
                    <p>Email: thaonguyen@gmail.com</p>
                    <p>Phone: +123 456 789</p>
                    {/* Add more contact details as needed */}
                </div>
            </div>

        </div>
    );
}

export default HomePage;
