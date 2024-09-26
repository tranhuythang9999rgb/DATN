import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, Alert, Input, Button, message, Modal, Select } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ListOrderUser = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State for filters
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    let username = '';

    try {
      const parsedUserData = JSON.parse(userData);
      if (parsedUserData && parsedUserData.user_name) {
        username = parsedUserData.user_name;
      } else {
        throw new Error('User data is missing or invalid');
      }
    } catch (err) {
      setError('Error parsing user data from localStorage');
      setLoading(false);
      return;
    }

    // Fetching order data
    axios.get(`http://127.0.0.1:8080/manager/order/api/getlist/user?name=${username}`)
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

  // Function to handle search and filtering
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

      // Check for selected filters
      const statusMatches = selectedStatus ? order.status === parseInt(selectedStatus) : true;
      const paymentMatches = selectedPaymentType ? order.payment_type === parseInt(selectedPaymentType) : true;

      return (orderIdMatches || addressMatches || amountMatches) && statusMatches && paymentMatches;
    });

    setFilteredData(filtered);
  };

  const confirmCancel = (id) => {
    Modal.confirm({
      title: 'Xác Nhận Hủy Đơn Hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      onOk: () => handleCancel(id),
      onCancel() {
        // message.info('Hủy hủy đơn hàng');
      },
    });
  };

  const handleCancel = (id) => {
    axios.patch(`http://127.0.0.1:8080/manager/order/api/update/calcel?id=${id}`)
      .then(response => {
        if (response.data.code === 0) {
          message.success('Đơn hàng đã được hủy thành công');
          // Update data in both state arrays
          setData(prevData => {
            return prevData.map(order =>
              order.order_id === id
                ? { ...order, status: 11 } // Update status to "canceled"
                : order
            );
          });
          setFilteredData(prevData => {
            return prevData.map(order =>
              order.order_id === id
                ? { ...order, status: 11 } // Update status to "canceled"
                : order
            );
          });
        } else {
          message.error('Không thể hủy đơn hàng');
        }
      })
      .catch(err => {
        message.error(`Lỗi: ${err.message}`);
      });
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  // Filter options for order status
  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: '21', label: 'Đang Chờ Thanh Toán Online' },
    { value: '19', label: 'Đang Chờ Gửi Hàng' },
    { value: '23', label: 'Đang Giao' },
    { value: '11', label: 'Đơn Hàng Đã Hủy' },
    { value: '9', label: 'Đã Giao Hàng và Thanh Toán' },
  ];

  // Filter options for payment types
  const paymentTypeOptions = [
    { value: '', label: 'Tất cả loại thanh toán' },
    { value: '27', label: 'Thanh Toán Online' },
    { value: '25', label: 'Thanh Toán Khi Nhận Hàng' }, // Updated to 27 for offline payments
  ];

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
      title: 'Số Tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: text => `${(text / 100).toFixed(2)}`,
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
      render: paymentType => {
        switch (paymentType) {
          case 25: return 'Thanh Toán Online';
          case 27: return 'Thanh Toán Khi Nhận Hàng'; // Adjusted for offline payments
          default: return 'Loại Thanh Toán Không Xác Định';
        }
      },
    },
    {
      title: ' ',
      key: 'action',
      render: (text, record) => {
        const { status, order_id } = record;
        const canCancel = [19, 23].includes(status); // Orders that can be canceled

        return (
          <>
            {canCancel && (
              <Button 
                type="primary" 
                danger 
                onClick={() => confirmCancel(order_id)}
              >
                Hủy Đơn Hàng
              </Button>
            )}
            <Button 
              type="link" 
              onClick={() => showOrderDetails(record)}
            >
              Xem Chi Tiết
            </Button>
          </>
        );
      },
    },
  ];

  // Loading and error handling
  if (loading) return <Spin tip="Đang Tải..." />;
  if (error) return <Alert message="Lỗi" description={error} type="error" />;

  // Reset filters and data
  const handleReset = () => {
    setSelectedStatus('');
    setSelectedPaymentType('');
    setFilteredData(data); // Reset to original data
    setSearchText(''); // Clear search text
  };

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
      {/* Filters for Status and Payment Type */}
      <Select
        placeholder="Chọn Trạng Thái"
        style={{ width: 200, marginRight: 16 }}
        onChange={value => {
          setSelectedStatus(value);
          handleSearch(searchText); // Apply filtering on change
        }}
        value={selectedStatus}
      >
        {statusOptions.map(option => (
          <Option key={option.value} value={option.value}>{option.label}</Option>
        ))}
      </Select>
      <Select
        placeholder="Chọn Loại Thanh Toán"
        style={{ width: 200, marginRight: 16 }}
        onChange={value => {
          setSelectedPaymentType(value);
          handleSearch(searchText); // Apply filtering on change
        }}
        value={selectedPaymentType}
      >
        {paymentTypeOptions.map(option => (
          <Option key={option.value} value={option.value}>{option.label}</Option>
        ))}
      </Select>
      {/* Reset Button */}
      <Button type="default" onClick={handleReset} style={{ marginLeft: 8 }}>
      mặc định
      </Button>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="order_id"
        style={{ marginTop: 16 }}
      />
      <Modal
        title="Chi Tiết Đơn Hàng"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {/* Render details of selected order here */}
        <pre>{JSON.stringify(selectedOrder, null, 2)}</pre>
      </Modal>
    </div>
  );
};

export default ListOrderUser;
