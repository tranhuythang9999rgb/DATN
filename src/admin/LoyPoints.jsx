import React, { useEffect, useState } from 'react';
import { Table, Spin, message } from 'antd';
import axios from 'axios';

function LoyPoints() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    // Hàm gọi API để lấy dữ liệu điểm tích lũy
    const fetchLoyPoints = () => {
        setLoading(true);
        axios.get('http://127.0.0.1:8080/manager/loypoint/list/loys')
            .then((response) => {
                if (response.data.code === 0) {
                    setData(response.data.body);
                } else {
                    message.error('Có lỗi xảy ra khi lấy dữ liệu');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu điểm tích lũy:', error);
                message.error('Không thể kết nối với API');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchLoyPoints();
    }, []);

    const columns = [
        {
            title: 'ID Điểm Tích Lũy',
            dataIndex: 'loyalty_id',
            key: 'loyalty_id',
        },
        {
            title: 'ID Người Dùng',
            dataIndex: 'user_id',
            key: 'user_id',
        },
        {
            title: 'Số Điểm',
            dataIndex: 'points',
            key: 'points',
        },
        {
            title: 'Cập Nhật Lần Cuối',
            dataIndex: 'last_updated',
            key: 'last_updated',
            render: (timestamp) => new Date(timestamp * 1000).toLocaleString(),
        },
    ];

    return (
        <div>
            <h2>Danh Sách Điểm Tích Lũy</h2>
            {loading ? (
                <Spin size="large" tip="Đang tải dữ liệu..." />
            ) : (
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="loyalty_id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
}

export default LoyPoints;
