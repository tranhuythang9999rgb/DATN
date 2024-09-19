import React from 'react';

const Header = () => {
    const headerStyle = {
        padding: '10px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center the content horizontally
    };

    const navStyle = {
        display: 'flex',
        justifyContent: 'center', // Center the nav items horizontally
        listStyle: 'none',
        margin: 0,
        padding: 0,
    };

    const navItemStyle = {
        margin: '0 15px', // Adjust spacing between items
        fontSize: '16px',
        fontWeight: 500,
    };

    const linkStyle = {
        textDecoration: 'none',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        transition: 'color 0.3s',
    };

    const iconStyle = {
        fontSize: '18px',
        marginRight: '5px',
    };

    return (
        <div style={headerStyle}>
            <nav>
                <ul style={navStyle}>
                    <li style={navItemStyle}>
                        <a href="/home" style={linkStyle}>
                            <span style={iconStyle}>🏠</span>
                            Trang Chủ
                        </a>
                    </li>
                    <li style={navItemStyle}>
                        <a href="/products" style={linkStyle}>
                            <span style={iconStyle}>🛒</span>
                            Sản Phẩm
                        </a>
                    </li>
                    <li style={navItemStyle}>
                        <a href="/services" style={linkStyle}>
                            <span style={iconStyle}>🛠️</span>
                            Dịch Vụ
                        </a>
                    </li>
                    <li style={navItemStyle}>
                        <a href="/about" style={linkStyle}>
                            <span style={iconStyle}>ℹ️</span>
                            Giới Thiệu
                        </a>
                    </li>
                    <li style={navItemStyle}>
                        <a href="/contact" style={linkStyle}>
                            <span style={iconStyle}>📧</span>
                            Liên Hệ
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Header;
