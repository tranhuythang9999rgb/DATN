import React from 'react';
import Dashboard from '../admin/Dashboard';
import HomePage from '../Home/HomePage';

function CheckLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    // Kiểm tra nếu userData tồn tại và role không phải là 13
    if (userData && userData.role && userData.role !== 13) {
        return <Dashboard />;
    } else {
        // Trả về HomePage nếu không có userData hoặc role là 13
        return <HomePage />;
    }
}

export default CheckLogin;
