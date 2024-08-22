import React from 'react';
import './home_index.css';
import { FcHome } from 'react-icons/fc';
function HomePage() {
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
                        <li>Đăng nhập</li>
                    </ul>
                </div>
                <div className='layout-header-end'></div>
            </div>
            <div className='layout-content'>

            </div>
            <div className='layout-footer'>

            </div>
        </div>
    );
}

export default HomePage;