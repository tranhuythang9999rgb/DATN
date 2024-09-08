import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker } from 'antd'; // Import DatePicker component from Ant Design
import 'antd/dist/reset.css'; // Import Ant Design CSS
import moment from 'moment'; // Import moment for date manipulation

function CircularChart() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Function to generate a random color
    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    // Fetch order data from API
    useEffect(() => {
        fetch('http://127.0.0.1:8080/manager/order/list/admin')
            .then(response => response.json())
            .then(result => {
                if (result.code === 0) {
                    const statusCounts = result.body.reduce((acc, order) => {
                        const status = order.status;
                        if (status === 31) {
                            acc.successful += 1;
                        } else if (status === 33) {
                            acc.canceled += 1;
                        } else {
                            acc.pending += 1;
                        }
                        return acc;
                    }, { successful: 0, canceled: 0, pending: 0 });

                    const chartData = [
                        { name: 'Thành công', value: statusCounts.successful, color: randomColor() },
                        { name: 'Hủy bỏ', value: statusCounts.canceled, color: randomColor() },
                        { name: 'Đang chờ', value: statusCounts.pending, color: randomColor() }
                    ];

                    setData(chartData);
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
            });
    }, []);

    // Handle date change
    const handleDateChange = () => {
        if (startDate && endDate) {
            const start = moment(startDate).format('YYYY-MM-DD');
            const end = moment(endDate).format('YYYY-MM-DD');
            fetch(`http://127.0.0.1:8080/manager/order/list/admin?start_date=${start}&end_date=${end}`)
                .then(response => response.json())
                .then(result => {
                    if (result.code === 0) {
                        const statusCounts = result.body.reduce((acc, order) => {
                            const status = order.status;
                            if (status === 31) {
                                acc.successful += 1;
                            } else if (status === 33) {
                                acc.canceled += 1;
                            } else {
                                acc.pending += 1;
                            }
                            return acc;
                        }, { successful: 0, canceled: 0, pending: 0 });

                        const chartData = [
                            { name: 'Thành công', value: statusCounts.successful, color: randomColor() },
                            { name: 'Hủy bỏ', value: statusCounts.canceled, color: randomColor() },
                            { name: 'Đang chờ', value: statusCounts.pending, color: randomColor() }
                        ];

                        setData(chartData);
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi lấy dữ liệu đơn hàng theo khoảng thời gian:', error);
                });
        } else {
            // Reset to initial data if no date is selected
            setData(data);
        }
    };

    return (
        <div>
            <h1>Thống kê đơn hàng</h1>
            <div style={{ marginBottom: 16 }}>

            </div>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Số lượng']} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CircularChart;
