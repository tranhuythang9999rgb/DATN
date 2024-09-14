import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Button, DatePicker, Space, Select } from 'antd';
import moment from 'moment';
import StatisticalFormHeader from './StatisticalFormHeader';
import CircularChart from './CircularChart';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Statistical = () => {
    const [data, setData] = useState([]);
    const [fetchData, setFetchData] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [topN, setTopN] = useState(5);
    const [groupBy, setGroupBy] = useState('date');

    useEffect(() => {
        const [startDate, endDate] = dateRange;

        if (fetchData && startDate && endDate) {
            const startIso = startDate.startOf('day').toISOString();
            const endIso = endDate.endOf('day').toISOString();

            axios.get(`http://127.0.0.1:8080/manager/order/list/order/admin`, {
                params: {
                    start: moment(startIso).unix(),
                    end: moment(endIso).unix()
                }
            })
                .then(response => {
                    setData(response.data.body);
                    setFetchData(false);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy dữ liệu:', error);
                });
        }
    }, [fetchData, dateRange]);

    const processData = () => {
        console.log('Dữ liệu gốc:', data);

        const groupedData = data.reduce((acc, order) => {
            const key = groupBy === 'date' ? moment(order.order_date).format('DD/MM/YYYY') : order.book_title;
            if (!acc[key]) {
                acc[key] = { quantity: 0, amount: 0 };
            }
            acc[key].quantity += order.quantity;
            acc[key].amount += order.total_amount;
            return acc;
        }, {});

        console.log('Dữ liệu nhóm:', groupedData);

        const sortedData = Object.entries(groupedData)
            .map(([key, value]) => ({
                key,
                ...value
            }))
            .sort((a, b) => b.quantity - a.quantity);

        console.log('Dữ liệu sắp xếp:', sortedData);

        return sortedData.slice(0, topN);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const { key, quantity, amount } = payload[0].payload;
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                    <p className="label"><strong>{key}</strong></p>
                    <p>Số lượng: {quantity}</p>
                    <p>Tổng số tiền: {amount.toLocaleString()} VND</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <StatisticalFormHeader/>
            <h1>Thống Kê doanh thu</h1>
            <Space direction="vertical" size="middle" style={{ marginBottom: 20 }}>
                <Space>
                    <RangePicker
                        format="DD/MM/YYYY"
                        onChange={(dates) => setDateRange(dates)}
                    />
                    <Select defaultValue="date" style={{ width: 120 }} onChange={setGroupBy}>
                        <Option value="date">Theo ngày</Option>
                        <Option value="product">Theo sản phẩm</Option>
                    </Select>
                    <Button onClick={() => setFetchData(true)}>Thống kê</Button>
                </Space>
            </Space>
            <ResponsiveContainer width="100%" height={500}>
                <BarChart
                    data={processData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="key"
                        tick={{ angle: -45 }}
                        textAnchor="end"
                        interval={0}
                        height={60}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="quantity" fill="#8884d8" name="Số lượng" barSize={20} />
                    <Bar yAxisId="right" dataKey="amount" fill="#82ca9d" name="Doanh thu" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
            <CircularChart/>
        </div>
    );
}

export default Statistical;
