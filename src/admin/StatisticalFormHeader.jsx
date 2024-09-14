import React, { useEffect, useState } from 'react';
import style from './index_statistical.module.css';
import axios from 'axios';
import { Button, DatePicker, Space } from 'antd';
import dayjs from 'dayjs'; // Import dayjs for date formatting

function StatisticalFormHeader() {
    const [order, setOrder] = useState({
        count: 0,
        count_product: 0,
        amount: 0,
        new_customer: 0
    });
    const [dayTime, setDayTime] = useState(dayjs().unix()); // Initialize with current timestamp

    useEffect(() => {
        handleGetInforOrder();
    }, [dayTime]); // Fetch data whenever dayTime changes

    const handleGetInforOrder = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8080/manager/order/api/admin/day?dayOne=${dayTime}`);
            if (response.data.code === 0) {
                setOrder(response.data.body);
            } else {
                console.error('Error fetching order information:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching order information:', error);
        }
    };

    const onChange = (date, dateString) => {
        if (date) {
            const timestamp = date.unix(); // Convert selected date to Unix timestamp
            setDayTime(timestamp); // Update the dayTime state
        }
    };

    return (
        <div>
            <div>
                <Space>
                    <DatePicker onChange={onChange} />
                  
                </Space>
            </div>
            <div className={style.container}>
                <div className={style.row}>
                    <div className={style.col}>
                        <div>Sản phẩm</div>
                        <div style={{ color: '#FFD700' }} className={style.col_value_product}>{order.count}</div>
                    </div>
                    <div className={style.col}>
                        <div>Số đơn hàng mới trong ngày</div>
                        <div style={{ color: '#1E90FF' }} className={style.col_value_count_order}>{order.count_product}</div>
                    </div>
                    <div className={style.col}>
                        <div>Số khách hàng mới trong tháng</div>
                        <div style={{ color: '#FFA500' }} className={style.col_value_count_new_customer}>{order.new_customer}</div>
                    </div>
                    <div className={style.col}>
                        <div>Doanh thu hôm nay</div>
                        <div style={{ color: '#20B2AA' }} className={style.col_value_amount}>{order.amount}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatisticalFormHeader;
