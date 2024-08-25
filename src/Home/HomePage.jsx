import React, { useState, useEffect } from 'react';
import './home_index.css';
import { FcHome } from 'react-icons/fc';
import { Avatar, Button, Image, Input, Modal, Tooltip } from 'antd';
import Login from '../common/Login';
import { CiLogin, CiSearch } from 'react-icons/ci';
import { GiArmoredBoomerang } from 'react-icons/gi';
import BookWellSell from './BookWellSell';
import { AiOutlineShoppingCart } from 'react-icons/ai';
const { Search } = Input;

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
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <GiArmoredBoomerang
                            style={{ display: 'flex', marginLeft: '10px', color: 'green', fontSize: '100px' }}
                        />
                        <span
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'orange',
                                fontWeight: 'bold',
                                fontSize: '18px',
                            }}
                        >
                            TS Shop
                        </span>
                    </div>
                </div>
                <div className='layout-header-center'>
                    <ul>
                        <li><FcHome />Trang chủ</li>
                        <li>Tin sách</li>
                        <li>Thư viện sách</li>
                        <li>Tác giả</li>
                        <li>Cuộc thi</li>
                        <li>Thông tin cửa hàng</li>
                        <li>
                            <div style={{ display: 'flex' }}>
                                <Input placeholder='Tìm kiếm ...' style={{ height: '30px' }} />
                                <Button style={{ height: '30px' }}><CiSearch />
                                </Button>
                            </div>
                        </li>
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
                        <li>
                            <Tooltip title="Giỏ hàng">
                                <AiOutlineShoppingCart style={{ fontSize: '20px' }} />
                            </Tooltip>
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
                    <h1>Tác giả</h1>
                    {/* List of new book authors */}
                    <ul style={{ display: 'flex' }}>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://ndu.khanhhoa.edu.vn/upload/104934/fck/files/download.png'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Nguyễn Du </div>
                            </div>

                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://baotangvanhoc.vn/wp-content/uploads/2021/12/Nha-van-Nam-Cao.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Nam Cao</div>
                            </div>
                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://www.nxbtre.com.vn/Images/Writer/nxbtre_thumb_30552016_085555.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Nguyễn Nhật Ánh</div>
                            </div>
                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://www.thivien.net/attachment/vnduJD_TYrIrUDl9fyOqRw.1503720312.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Xuân Diệu</div>
                            </div>
                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://imagev3.vietnamplus.vn/w1000/Uploaded/2024/hotnnz/2024_05_30/huy-can4-9561.jpg.webp'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Huy Cận </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className='layout-footer-list-bool-well-sell'>
                    <BookWellSell title={'Top Sản phẩm bán chạy '} />
                </div>
                <div className='layout-footer-list-bool-well-sell'>
                    <BookWellSell title={'Sắp xuất bản'} />
                </div>
                <div className='layout-footer-nhaf-xuatban'>
                    <h3>Nhà xuất bản</h3>
                    {/* List of publishers */}
                    <ul style={{ display: 'flex' }}>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://www.thivien.net/attachment/vnduJD_TYrIrUDl9fyOqRw.1503720312.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Kim Đồng</div>
                            </div>
                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://www.thivien.net/attachment/vnduJD_TYrIrUDl9fyOqRw.1503720312.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Xuân Diệu</div>
                            </div>
                        </li>
                        <li>
                            <div style={{ display: 'block' }}>
                                <Avatar size={160} src='https://www.thivien.net/attachment/vnduJD_TYrIrUDl9fyOqRw.1503720312.jpg'>
                                </Avatar>
                                <div style={{ marginTop: '5px', color: 'black', fontSize: '20px' }}>Xuân Diệu</div>
                            </div>
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
