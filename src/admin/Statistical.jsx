import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

function Statistical() {
    const [data, setData] = useState([]);

    // Function to generate a random color
    const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;

    // Fetch order data from API
    useEffect(() => {
        fetch('http://127.0.0.1:8080/manager/order/list/admin')
            .then(response => response.json())
            .then(result => {
                if (result.code === 0) {
                    // Process data and add a random color for each order
                    const chartData = result.body.map(order => ({
                        orderId: order.id,
                        customer: order.customer_name,
                        totalAmount: order.total_amount,
                        orderDate: order.order_date,
                        color: randomColor() // Add a random color for each order
                    }));
                    setData(chartData);
                }
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    }, []);

    return (
        <div>
            <h1>Thống kê Doanh thu Đơn hàng</h1>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="orderId" label={{ value: "Mã Đơn hàng", position: "insideBottomRight", offset: 0 }} />
                    <YAxis label={{ value: "Doanh thu (VND)", angle: -90, position: "insideLeft" }} />
                    <Tooltip 
                        formatter={(value) => [`${value} VND`, 'Doanh thu']}
                        labelFormatter={(label) => `Mã Đơn hàng: ${label}`}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar 
                        dataKey="totalAmount"
                        fill="#8884d8" // Default color for bars
                        barSize={30}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Statistical;
