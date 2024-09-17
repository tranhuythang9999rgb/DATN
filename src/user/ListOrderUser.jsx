import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, Alert, Input } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Search } = Input;

const ListOrderUser = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Fetch data when component mounts
  useEffect(() => {
    axios.get('http://127.0.0.1:8080/manager/order/api/getlist/user?name=thangth7')
      .then(response => {
        setData(response.data.body);
        setFilteredData(response.data.body);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle search input
  const handleSearch = (value) => {
    setSearchText(value);
    const lowercasedValue = value.toLowerCase();
    const numericValue = parseFloat(value);

    const filtered = data.filter(order => {
      const orderIdMatches = order.order_id.toString().includes(value);
      const addressMatches = 
        order.address.district.toLowerCase().includes(lowercasedValue) ||
        order.address.commune.toLowerCase().includes(lowercasedValue) ||
        order.address.detailed.toLowerCase().includes(lowercasedValue);
      const amountMatches = 
        !isNaN(numericValue) && (order.amount / 100).toFixed(2).includes(numericValue.toString());

      return orderIdMatches || addressMatches || amountMatches;
    });
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'Thời Gian Tạo',
      dataIndex: 'create_time',
      key: 'create_time',
      render: text => new Date(text).toLocaleString(),
    },
    {
      title: 'Địa Chỉ',
      key: 'address',
      render: (text, record) => (
        <>
          <div>{record.address.district}</div>
          <div>{record.address.commune}</div>
          <div>{record.address.detailed}</div>
        </>
      ),
    },
    {
      title: 'Số Tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: text => `$${(text / 100).toFixed(2)}`, // Assuming amount is in cents
    },
    {
      title: 'Ngày Dự Đoán',
      dataIndex: 'estimated_date',
      key: 'estimated_date',
      render: text => new Date(text).toLocaleString(),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        switch (status) {
          case 21: return 'Đang Chờ Thanh Toán Online';
          case 19: return 'Đang Chờ Gửi Hàng';
          case 23: return 'Đang Giao';
          case 11: return 'Đơn Hàng Đã Hủy';
          case 9: return 'Đã Giao Hàng và Thanh Toán';
          default: return 'Trạng Thái Không Xác Định';
        }
      },
    },
    {
      title: 'Loại Thanh Toán',
      dataIndex: 'payment_type',
      key: 'payment_type',
      render: paymentType => paymentType === 25 ? 'Thanh Toán Online' : 'Thanh Toán Khi Nhận Hàng',
    },
  ];

  if (loading) return <Spin tip="Đang Tải..." />;
  if (error) return <Alert message="Lỗi" description={error} type="error" />;

  return (
    <div>
      <Title level={2}>Danh Sách Đơn Hàng</Title>
      <Search
        placeholder="Tìm kiếm theo mã đơn hàng, địa chỉ, hoặc giá tiền"
        allowClear
        enterButton="Tìm kiếm"
        size="large"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="order_id"
        pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
      />
    </div>
  );
};

export default ListOrderUser;
