import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { DatePicker, Button, Space } from 'antd';

const { RangePicker } = DatePicker;

function BieuDoLineChart() {
    const [dataByDate, setDataByDate] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);

    const fetchDataOrder = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/order/api/listorder/admin');
            processOrders(response.data.body);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
        }
    };

    const processOrders = (orders, startDate = null, endDate = null) => {
        const dateStats = {};

        orders.forEach(order => {
            const orderDate = moment(order.create_time).format('YYYY-MM-DD');

            if (startDate && moment(orderDate).isBefore(startDate)) return;
            if (endDate && moment(orderDate).isAfter(endDate)) return;

            if (!dateStats[orderDate]) {
                dateStats[orderDate] = { hoanthanh: 0, choxuly: 0 };
            }

            const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

            if (order.status === 23) { // Đơn hàng đã giao và hoàn tất
                dateStats[orderDate].hoanthanh += totalAmount;
            } else {
                dateStats[orderDate].choxuly += totalAmount;
            }
        });

        const chartData = Object.keys(dateStats).map(date => ({
            date,
            'Hoàn tất giao dịch': dateStats[date].hoanthanh,
            'Đang chờ xử lý': dateStats[date].choxuly
        })).sort((a, b) => moment(a.date).diff(moment(b.date)));

        setDataByDate(chartData);
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handleFilter = () => {
        const [startDate, endDate] = dateRange;
        if (startDate && endDate) {
            fetchDataOrder(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        }
    };

    useEffect(() => {
        fetchDataOrder();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #cccccc' }}>
                    <p className="label">{`Ngày: ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={`item-${index}`} style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value.toLocaleString()} VND`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ backgroundColor: '#e6fffb', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Doanh số bán hàng</h2>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Doanh thu theo ngày</h3>
                <p style={{ textAlign: 'center', color: '#888' }}>Doanh thu của từng ngày trong tháng</p>
                <Space style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <RangePicker onChange={handleDateRangeChange} />
                    <Button onClick={handleFilter}>Thống kê</Button>
                </Space>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={dataByDate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="Hoàn tất giao dịch" stroke="#00bcd4" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Đang chờ xử lý" stroke="#3f51b5" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default BieuDoLineChart;
