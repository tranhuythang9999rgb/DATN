import React, { useState } from 'react';
import Dashboard from '../admin/Dashboard';
import HomePage from '../Home/HomePage';

function CheckLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if(userData.role){
        return<Dashboard/>
    }else{
        return<HomePage/>
    }
}

export default CheckLogin;