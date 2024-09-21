import axios from 'axios';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import moment from 'moment';

function BieuDoThongKe() {
    const [dataByDate, setDataByDate] = useState([]);
    const [bookTypes, setBookTypes] = useState([]);

    const fetchDataOrder = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/order/api/listorder/admin');
            const orders = response.data.body;

            const dateStats = {};
            const bookTypesSet = new Set();

            orders.forEach(order => {
                const date = moment(order.create_time).format('YYYY-MM-DD');
                
                if (!dateStats[date]) {
                    dateStats[date] = {};
                }

                order.items.forEach(item => {
                    bookTypesSet.add(item.name);
                    if (!dateStats[date][item.name]) {
                        dateStats[date][item.name] = 0;
                    }
                    dateStats[date][item.name] += item.quantity;
                });
            });

            const bookTypesArray = Array.from(bookTypesSet);
            setBookTypes(bookTypesArray);

            const chartData = Object.keys(dateStats).map(date => {
                const dayData = { date };
                bookTypesArray.forEach(book => {
                    dayData[book] = dateStats[date][book] || 0;
                });
                return dayData;
            });

            setDataByDate(chartData);

        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchDataOrder();
    }, []);

    // Updated CustomTooltip component with centered content
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #cccccc',
                    textAlign: 'center' // Center align all text
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

    return (
        <div>
            <h2>Thống kê số lượng bán từng loại sách theo ngày</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dataByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {bookTypes.map((book, index) => (
                        <Bar key={index} dataKey={book} fill={getColor(index)} name={book} />
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