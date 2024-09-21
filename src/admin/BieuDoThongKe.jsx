import axios from 'axios';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import moment from 'moment';

function BieuDoThongKe() {
    const [dataByDate, setDataByDate] = useState([]);
    const [bookTypes, setBookTypes] = useState([]); // Lưu danh sách các loại sách để hiển thị trong legend của biểu đồ

    const fetchDataOrder = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/order/api/listorder/admin');
            const orders = response.data.body;

            // Khởi tạo đối tượng để lưu số lượng bán mỗi loại sách theo từng ngày
            const dateStats = {};
            const bookTypesSet = new Set(); // Dùng Set để lưu các loại sách, loại bỏ trùng lặp

            orders.forEach(order => {
                const date = moment(order.create_time).format('YYYY-MM-DD'); // Lấy ngày tạo đơn hàng
                
                if (!dateStats[date]) {
                    dateStats[date] = {}; // Khởi tạo đối tượng cho mỗi ngày
                }

                // Duyệt qua các sản phẩm trong đơn hàng
                order.items.forEach(item => {
                    bookTypesSet.add(item.name); // Thêm loại sách vào Set
                    if (!dateStats[date][item.name]) {
                        dateStats[date][item.name] = 0; // Khởi tạo số lượng sách nếu chưa có
                    }
                    dateStats[date][item.name] += item.quantity; // Cộng dồn số lượng bán được của sách trong ngày
                });
            });

            // Chuyển Set bookTypes thành mảng để sử dụng cho biểu đồ
            const bookTypesArray = Array.from(bookTypesSet);
            setBookTypes(bookTypesArray);

            // Chuyển đổi dữ liệu thành dạng sử dụng cho Recharts
            const chartData = Object.keys(dateStats).map(date => {
                const dayData = { date }; // Tạo một đối tượng cho mỗi ngày
                bookTypesArray.forEach(book => {
                    dayData[book] = dateStats[date][book] || 0; // Thêm số lượng sách bán được hoặc 0 nếu không có
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

    // Hàm tùy chỉnh cho tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <h4>{payload[0].payload.date}</h4>
                    {payload.map((entry, index) => {
                        const value = entry.value;
                        return value > 0 ? (
                            <p key={`item-${index}`}>{`${entry.name}: ${value}`}</p>
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

// Hàm để lấy màu sắc khác nhau cho từng loại sách
function getColor(index) {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ff7300'];
    return colors[index % colors.length];
}

export default BieuDoThongKe;
