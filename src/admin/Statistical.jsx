import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { DatePicker } from 'antd'; // Đảm bảo bạn đã cài đặt thư viện Ant Design
import 'antd/dist/reset.css'; // Import CSS cho Ant Design
import moment from 'moment'; // Thêm thư viện moment để xử lý ngày giờ

function Statistical() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
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
                    const groupedByBook = result.body.reduce((acc, order) => {
                        const book = order.book_title;
                        if (!acc[book]) {
                            acc[book] = { totalAmount: 0, color: randomColor() };
                        }
                        acc[book].totalAmount += order.total_amount;
                        return acc;
                    }, {});

                    const chartData = Object.keys(groupedByBook).map(book => ({
                        bookTitle: book,
                        totalAmount: groupedByBook[book].totalAmount,
                        color: groupedByBook[book].color
                    }));

                    setData(chartData);
                    setFilteredData(chartData); // Set initial filtered data
                }
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
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
                        const groupedByBook = result.body.reduce((acc, order) => {
                            const book = order.book_title;
                            if (!acc[book]) {
                                acc[book] = { totalAmount: 0, color: randomColor() };
                            }
                            acc[book].totalAmount += order.total_amount;
                            return acc;
                        }, {});

                        const chartData = Object.keys(groupedByBook).map(book => ({
                            bookTitle: book,
                            totalAmount: groupedByBook[book].totalAmount,
                            color: groupedByBook[book].color
                        }));

                        setFilteredData(chartData);
                    }
                })
                .catch(error => {
                    console.error('Error fetching orders by date range:', error);
                });
        } else {
            setFilteredData(data); // Reset to initial data if no date is selected
        }
    };

    return (
        <div>
            <h1>Thống kê doanh thu</h1>
            <div style={{ marginBottom: 16 }}>
                <DatePicker 
                    onChange={(date, dateString) => setStartDate(dateString)}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày bắt đầu"
                    style={{ marginRight: 8 }}
                />
                <DatePicker 
                    onChange={(date, dateString) => setEndDate(dateString)}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày kết thúc"
                />
                <button onClick={handleDateChange} style={{ marginLeft: 8 }}>Thống kê</button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bookTitle" label={{ value: "Tên Sách", position: "insideBottomRight", offset: 0 }} />
                    <YAxis label={{ value: "Doanh thu (VND)", angle: -90, position: "insideLeft" }} />
                    <Tooltip 
                        formatter={(value) => [`${value} VND`, 'Doanh thu']}
                        labelFormatter={(label) => `Tên Sách: ${label}`}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar 
                        dataKey="totalAmount"
                        barSize={30}
                    >
                        {filteredData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Statistical;
