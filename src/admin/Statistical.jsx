import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import axios from 'axios';
import { Button, DatePicker, Space } from 'antd';
import moment from 'moment';
import CircularChart from './CircularChart';

const { RangePicker } = DatePicker;

const Statistical = () => {
    const [data, setData] = useState([]);
    const [fetchData, setFetchData] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        const [startDate, endDate] = dateRange;

        if (fetchData && startDate && endDate) {
            // Convert dates to ISO 8601 format
            const startIso = startDate.startOf('day').toISOString();
            const endIso = endDate.endOf('day').toISOString();

            console.log(`Fetching data with start=${startIso} and end=${endIso}`);

            // Fetch data from the API with selected date range
            axios.get(`http://127.0.0.1:8080/manager/order/list/order/admin`, {
                params: {
                    start: moment(startIso).unix(),
                    end: moment(endIso).unix()
                }
            })
                .then(response => {
                    console.log('API response:', response.data);
                    setData(response.data.body);
                    setFetchData(false); // Reset fetchData flag after fetching
                })
                .catch(error => {
                    console.error('Lỗi khi lấy dữ liệu:', error);
                });
        }
    }, [fetchData, dateRange]);

    // Grouping by date and book_title to handle multiple books on the same day
    const aggregatedData = data.reduce((acc, order) => {
        const orderDate = moment(order.order_date).format('DD/MM/YYYY'); // Format date
        const key = `${orderDate} - ${order.book_title}`; // Combine date and book title as the key

        const existingEntry = acc.find(item => item.key === key);

        if (existingEntry) {
            existingEntry.amount += order.total_amount;
            existingEntry.quantity += order.quantity; // Aggregate quantity for same book on the same day
        } else {
            acc.push({
                key, // Use date and book title as a combined key
                date: orderDate,
                book_title: order.book_title,
                amount: order.total_amount,
                quantity: order.quantity,
            });
        }
        return acc;
    }, []);

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const { book_title, amount, quantity, date } = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="label"><strong>{book_title}</strong></p>
                    <p>Ngày: {date}</p>
                    <p className="intro">Tổng số tiền: {amount} VND</p>
                    <p className="intro">Số lượng: {quantity}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <h1>Thống Kê Đơn Hàng Theo Ngày Và Tựa Sách</h1>
            <div>
                <Space>
                    <RangePicker
                        format="DD/MM/YYYY"
                        onChange={(dates) => setDateRange(dates)}
                    />
                    <Button onClick={() => setFetchData(true)}>Thống kê</Button>
                </Space>
            </div>
            <BarChart
                width={1000}
                height={500}
                data={aggregatedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="key" // Use the combined key for X-axis
                    tick={{ angle: -45 }}
                    textAnchor="end"
                    label={{ value: 'Ngày và Tựa Sách', position: 'insideBottomRight', offset: 0 }}
                />
                <YAxis
                    label={{ value: 'Tổng Số Tiền', angle: -90, position: 'insideLeft', offset: 0 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                    dataKey="amount"
                    fill="#8884d8"
                    barSize={20} // Adjust the size of the bars
                />
                <Bar
                    dataKey="quantity"
                    fill="#82ca9d"
                    barSize={20} // Adjust size for quantity bars
                />
            </BarChart>

            <CircularChart />
        </div>
    );
}

export default Statistical;
