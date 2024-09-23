import axios from 'axios';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { Button, DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;

function BieuDoLineChart() {
    const [dataByDate, setDataByDate] = useState([]);
    const [bookTypes, setBookTypes] = useState([]);
    const [statusCounts, setStatusCounts] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [allOrders, setAllOrders] = useState([]);
    const [topBook, setTopBook] = useState({ name: '', quantity: 0 });

    const fetchDataOrder = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/order/api/listorder/admin');
            setAllOrders(response.data.body);
            processOrders(response.data.body);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
        }
    };

    const processOrders = (orders, startDate = null, endDate = null) => {
        const dateStats = {};
        const totalBookQuantities = {};

        orders.forEach(order => {
            const orderDate = moment(order.create_time).format('YYYY-MM-DD');

            // Lọc theo khoảng thời gian
            if (startDate && moment(orderDate).isBefore(startDate)) return;
            if (endDate && moment(orderDate).isAfter(endDate)) return;

            // Lọc theo trạng thái 15 hoặc 23 cho biểu đồ
            if (![15, 23].includes(order.status)) return;

            order.items.forEach(item => {
                // Cập nhật thống kê theo ngày cho biểu đồ
                if (!dateStats[orderDate]) dateStats[orderDate] = {};
                if (!dateStats[orderDate][item.name]) dateStats[orderDate][item.name] = 0;
                dateStats[orderDate][item.name] += item.quantity;

                // Cập nhật tổng số lượng sách cho tất cả trạng thái
                if (!totalBookQuantities[item.name]) totalBookQuantities[item.name] = 0;
                totalBookQuantities[item.name] += item.quantity;
            });
        });

        // Xác định sách có số lượng cao nhất từ tất cả trạng thái
        let maxBook = { name: '', quantity: 0 };
        for (const [name, quantity] of Object.entries(totalBookQuantities)) {
            if (quantity > maxBook.quantity) {
                maxBook = { name, quantity };
            }
        }
        setTopBook(maxBook);

        const bookTypesArray = Array.from(new Set(orders.flatMap(order => order.items.map(item => item.name))));
        setBookTypes(bookTypesArray);

        const chartData = Object.keys(dateStats).map(date => {
            const dayData = { date };
            bookTypesArray.forEach(book => {
                dayData[book] = dateStats[date][book] || 0;
            });
            return dayData;
        });

        setDataByDate(chartData);

        // Tính toán số lượng trạng thái
        const totalStatusCounts = {};
        orders.forEach(order => {
            const status = getStatusText(order.status);
            totalStatusCounts[status] = (totalStatusCounts[status] || 0) + 1;
        });
        setStatusCounts(Object.entries(totalStatusCounts).map(([name, value]) => ({ name, value })));
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const date = payload[0].payload.date;
            let maxBook = { name: '', quantity: 0 };

            payload.forEach(entry => {
                if (entry.value > maxBook.quantity) {
                    maxBook = { name: entry.name, quantity: entry.value };
                }
            });

            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #cccccc',
                    textAlign: 'center'
                }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>{date}</h4>
                    <p style={{ margin: '5px 0' }}>
                        {`${maxBook.name} - Số lượng: ${maxBook.quantity}`}
                    </p>
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

        if (startDate && endDate) {
            processOrders(allOrders, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        } else {
            setDataByDate([]);
            setBookTypes([]);
            setTopBook({ name: '', quantity: 0 });
        }
    };

    useEffect(() => {
        fetchDataOrder();
    }, []);

    const getStatusText = (statusCode) => {
        switch (statusCode) {
            case 11: return 'Đang chờ xác nhận';
            case 13: return 'Đang chờ thanh toán online';
            case 15: return 'Đã thanh toán online và đang chờ gửi hàng';
            case 17: return 'Đang chuẩn bị đơn hàng';
            case 19: return 'Đang vận chuyển';
            case 21: return 'Đang giao hàng';
            case 23: return 'Đơn hàng đã giao và hoàn tất';
            case 25: return 'Đơn hàng đã hủy';
            default: return 'Trạng thái không xác định';
        }
    };

    return (
        <div>
            <h2>Thống kê số lượng bán từng loại sách và trạng thái đơn hàng theo ngày</h2>
            <Space>
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
                    {bookTypes.map((book, index) => (
                        <Line key={`book-${index}`} type="monotone" dataKey={book} stroke={getColor(index)} name={book} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            <h2>Sách được quan tâm nhiều nhất:</h2>
            {topBook.name ? (
                <p>{`${topBook.name} - Số lượng: ${topBook.quantity}`}</p>
            ) : (
                <p>Không có dữ liệu.</p>
            )}
            <h2>Danh sách trạng thái các đơn hàng:</h2>
            <ul>
                {statusCounts.map((status) => (
                    <li key={status.name}>{`${status.name}: ${status.value}`}</li>
                ))}
            </ul>
        </div>
    );
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function getColor(index) {
    return getRandomColor();
}

export default BieuDoLineChart;
