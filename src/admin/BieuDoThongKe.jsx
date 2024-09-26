import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { DatePicker, Button, Space, Select } from 'antd';

const { RangePicker } = DatePicker;

function BieuDoLineChart() {
    const [data, setData] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [viewMode, setViewMode] = useState('daily');
    const [allOrders, setAllOrders] = useState([]);

    const fetchDataOrder = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/order/api/listorder/admin');
            setAllOrders(response.data.body);
            processOrders(response.data.body);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
        }
    };

    const processOrders = (orders) => {
        const [startDate, endDate] = dateRange;
        const stats = {};

        orders.forEach(order => {
            const orderDateTime = moment(order.create_time);
            
            if (startDate && orderDateTime.isBefore(startDate)) return;
            if (endDate && orderDateTime.isAfter(endDate)) return;

            let key;
            if (viewMode === 'hourly') {
                key = orderDateTime.format('YYYY-MM-DD HH:00');
            } else {
                key = orderDateTime.format('YYYY-MM-DD');
            }

            if (!stats[key]) {
                stats[key] = { hoanthanh: 0, choxuly: 0 };
            }

            const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

            if (order.status === 23) {
                stats[key].hoanthanh += totalAmount;
            } else {
                stats[key].choxuly += totalAmount;
            }
        });

        const chartData = Object.keys(stats).map(key => ({
            time: key,
            'Hoàn tất giao dịch': stats[key].hoanthanh,
            'Đang chờ xử lý': stats[key].choxuly
        })).sort((a, b) => moment(a.time).diff(moment(b.time)));

        setData(chartData);
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handleFilter = () => {
        processOrders(allOrders);
    };

    const handleViewModeChange = (value) => {
        setViewMode(value);
        processOrders(allOrders);
    };

    useEffect(() => {
        fetchDataOrder();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #cccccc' }}>
                    <p className="label">{`${viewMode === 'hourly' ? 'Giờ' : 'Ngày'}: ${label}`}</p>
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
            <h1>Thống kê doanh thu</h1>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Doanh số bán hàng</h2>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    {viewMode === 'hourly' ? 'Doanh thu theo giờ' : 'Doanh thu theo ngày'}
                </h3>
                <p style={{ textAlign: 'center', color: '#888' }}>
                    {viewMode === 'hourly' ? 'Doanh thu của từng giờ trong ngày' : 'Doanh thu của từng ngày trong tháng'}
                </p>
                <Space style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <RangePicker 
                        onChange={handleDateRangeChange}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                    />
                    <Button onClick={handleFilter}>Thống kê</Button>
                    <Select
                        defaultValue="daily"
                        style={{ width: 120 }}
                        onChange={handleViewModeChange}
                        options={[
                            { value: 'daily', label: 'Theo ngày' },
                            { value: 'hourly', label: 'Theo giờ' },
                        ]}
                    />
                </Space>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="time" 
                            tickFormatter={(time) => viewMode === 'hourly' ? moment(time).format('HH:00') : moment(time).format('DD/MM')}
                        />
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