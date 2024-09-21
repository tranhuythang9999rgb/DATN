import axios from 'axios';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import moment from 'moment'; // Sử dụng moment.js để xử lý ngày tháng

function BieuDoThongKe() {
    const [dataByDate, setDataByDate] = useState([]);

    const fetchDataOrder = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/manager/order/api/listorder/admin');
            const orders = response.data.body;

            // Duyệt qua tất cả các đơn hàng và thống kê số lượng sách và doanh thu theo ngày
            const dateStats = {};

            orders.forEach(order => {
                const date = moment(order.create_time).format('YYYY-MM-DD'); // Lấy ngày tạo đơn hàng (không lấy giờ)
                
                // Nếu ngày chưa tồn tại trong đối tượng dateStats, khởi tạo nó
                if (!dateStats[date]) {
                    dateStats[date] = {
                        booksSold: new Set(), // Để lưu tên các loại sách (sử dụng Set để tránh trùng lặp)
                        totalRevenue: 0, // Để lưu tổng doanh thu trong ngày
                    };
                }

                // Duyệt qua các sản phẩm trong đơn hàng
                order.items.forEach(item => {
                    dateStats[date].booksSold.add(item.name); // Thêm tên sách vào Set (tránh trùng)
                    dateStats[date].totalRevenue += item.price * item.quantity; // Tính tổng doanh thu
                });
            });

            // Chuyển đổi dữ liệu thành dạng có thể sử dụng với Recharts
            const chartData = Object.keys(dateStats).map(key => ({
                date: key,
                booksCount: dateStats[key].booksSold.size, // Số lượng loại sách bán được (size của Set)
                revenue: dateStats[key].totalRevenue, // Tổng doanh thu
            }));

            setDataByDate(chartData);

        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchDataOrder();
    }, []);

    return (
        <div>
            <h2>Thống kê số loại sách và doanh thu theo ngày</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dataByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="booksCount" fill="#8884d8" name="Số loại sách" />
                    <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Doanh thu (VNĐ)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default BieuDoThongKe;
