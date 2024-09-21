import axios from 'axios';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { Button, DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;

function BieuDoThongKe() {
    const [dataByDate, setDataByDate] = useState([]);
    const [bookTypes, setBookTypes] = useState([]);
    const [statusTypes, setStatusTypes] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [allOrders, setAllOrders] = useState([]);

    const fetchDataOrder = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/order/api/listorder/admin');
            setAllOrders(response.data.body);
            processOrders(response.data.body);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const processOrders = (orders, startDate = null, endDate = null) => {
        const dateStats = {};
        const bookTypesSet = new Set();
        const statusStats = {};

        orders.forEach(order => {
            const orderDate = moment(order.create_time).format('YYYY-MM-DD');

            // Check if the order date is within the selected date range
            if (startDate && moment(orderDate).isBefore(startDate)) return;
            if (endDate && moment(orderDate).isAfter(endDate)) return;

            const status = getStatusText(order.status);

            // Initialize stats for the date
            if (!dateStats[orderDate]) dateStats[orderDate] = {};
            if (!statusStats[orderDate]) statusStats[orderDate] = {};

            // Process items for book sales
            order.items.forEach(item => {
                bookTypesSet.add(item.name);
                if (!dateStats[orderDate][item.name]) dateStats[orderDate][item.name] = 0;
                dateStats[orderDate][item.name] += item.quantity;
            });

            // Process status counts
            if (!statusStats[orderDate][status]) statusStats[orderDate][status] = 0;
            statusStats[orderDate][status] += 1;
        });

        const bookTypesArray = Array.from(bookTypesSet);
        setBookTypes(bookTypesArray);

        const chartData = Object.keys(dateStats).map(date => {
            const dayData = { date };
            bookTypesArray.forEach(book => {
                dayData[book] = dateStats[date][book] || 0;
            });
            Object.keys(statusStats[date] || {}).forEach(status => {
                dayData[status] = statusStats[date][status] || 0;
            });
            return dayData;
        });

        setDataByDate(chartData);

        // Collect unique status types
        const statusArray = Object.values(statusStats).flatMap(Object.keys);
        setStatusTypes(Array.from(new Set(statusArray)));
    };

    useEffect(() => {
        fetchDataOrder();
    }, []);

    const getStatusText = (statusCode) => {
        switch (statusCode) {
            case 23: return 'Đã thanh toán online và đang chờ gửi hàng';
            case 21: return 'Đang Chờ Thanh Toán Online';
            case 19: return 'Đang Chờ Gửi Hàng';
            case 22: return 'Đang Giao';
            case 11: return 'Đơn Hàng Đã Hủy';
            case 9: return 'Đã Giao Hàng và Thanh Toán';
            default: return 'Trạng thái không xác định';
        }
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #cccccc',
                    textAlign: 'center'
                }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>{payload[0].payload.date}</h4>
                    {payload.map((entry, index) => {
                        const value = entry.value;
                        return value > 0 ? (
                            <p key={`item-${index}`} style={{ margin: '5px 0' }}>
                                {`${entry.name} - Số lượng ${value}`}
                            </p>
                        ) : null;
                    })}
                </div>
            );
        }
        return null;
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handleFilter = () => {
        const [startDate, endDate] = dateRange;

        // Ensure valid dates are selected
        if (startDate && endDate) {
            processOrders(allOrders, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        } else {
            setDataByDate([]); // Clear data if no valid range
            setBookTypes([]);
            setStatusTypes([]);
        }
    };

    return (
        <div>
            <h2>Thống kê số lượng bán từng loại sách và trạng thái đơn hàng theo ngày</h2>
            <Space>
                <RangePicker onChange={handleDateRangeChange} />
                <Button   picker="month" onClick={handleFilter}>Thống kê</Button>
            </Space>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dataByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {bookTypes.map((book, index) => (
                        <Bar key={`book-${index}`} dataKey={book} fill={getColor(index)} name={book} />
                    ))}
                    {statusTypes.map((status, index) => (
                        <Bar key={`status-${index}`} dataKey={status} fill={getColor(bookTypes.length + index)} name={status} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function getColor(index) {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ff7300'];
    return colors[index % colors.length];
}

export default BieuDoThongKe;
