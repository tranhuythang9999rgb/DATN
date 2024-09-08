import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import axios from 'axios';
import { DatePicker, Space } from 'antd';

const Statistical = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch data from the API
        axios.get('http://127.0.0.1:8080/manager/order/list/order/admin?start=1725774521&end=1725774521')
            .then(response => {
                setData(response.data.body);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu:', error);
            });
    }, []);

    // Transform the data for the chart
    const aggregatedData = data.reduce((acc, order) => {
        const existing = acc.find(item => item.book_title === order.book_title);
        if (existing) {
            existing.amount += order.total_amount;
            existing.quantity += order.quantity; // Aggregate quantity as well
        } else {
            acc.push({
                book_title: order.book_title,
                amount: order.total_amount,
                quantity: order.quantity
            });
        }
        return acc;
    }, []);

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const { book_title, amount, quantity } = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="label"><strong>{book_title}</strong></p>
                    <p className="intro">Tổng số tiền: {amount} VND</p>
                    <p className="intro">Số lượng: {quantity}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <h1>Thống Kê Đơn Hàng Theo Tựa Sách</h1>
            <div>
                <Space>
                    start
                    <DatePicker />
                    end
                    <DatePicker />
                </Space>
            </div>
            <BarChart
                width={800}
                height={400}
                data={aggregatedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="book_title"
                    tick={{ angle: -45 }}
                    textAnchor="end"
                    label={{ value: 'Tựa Sách', position: 'insideBottomRight', offset: 0 }}
                />
                <YAxis
                    label={{ value: 'Tổng Số Tiền', angle: -90, position: 'insideLeft', offset: 0 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                    dataKey="amount"
                    fill="#8884d8"
                    barSize={20} // Adjust this value to make the bars narrower or wider
                />
            </BarChart>
        </div>
    );
}

export default Statistical;
