import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, message, Select } from 'antd';

function AddAddress({ onSuccess }) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [form] = Form.useForm();
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await axios.get('http://localhost:8080/manager/public/customer/cities');
            setCities(response.data.cities.map(city => city['Tỉnh Thành Phố']));
        } catch (error) {
            console.error('Error fetching cities:', error);
            message.error('Không thể lấy danh sách thành phố.');
        }
    };

    const handleCityChange = async (value) => {
        form.setFieldsValue({ district: null, commune: null });
        setDistricts([]);
        setCommunes([]);

        try {
            const response = await axios.get(`http://localhost:8080/manager/public/customer/districts?name=${encodeURIComponent(value)}`);
            setDistricts(response.data.districts.map(district => district['Quận Huyện']));
        } catch (error) {
            console.error('Error fetching districts:', error);
            message.error('Không thể lấy danh sách quận/huyện.');
        }
    };

    const handleDistrictChange = async (value) => {
        form.setFieldsValue({ commune: null });
        setCommunes([]);

        try {
            const response = await axios.get(`http://localhost:8080/manager/public/customer/communes?name=${encodeURIComponent(value)}`);
            setCommunes(response.data.communes.map(commune => commune['Phường Xã']));
        } catch (error) {
            console.error('Error fetching communes:', error);
            message.error('Không thể lấy danh sách phường/xã.');
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const formData = new FormData();
        const nickname = values.nick_name.trim() === "" ? userData.user_name : values.nick_name;

        formData.append('nick_name', nickname); // Added nick_name field
        formData.append('user_name', userData.user_name);
        formData.append('phone_number', values.phone_number);
        formData.append('province', values.province);
        formData.append('district', values.district);
        formData.append('commune', values.commune);
        formData.append('detailed', values.detailed);
    
        try {
            const response = await axios.post('http://127.0.0.1:8080/manager/delivery_address/add/profile', formData);
            if (response.data.code === 0) {
                localStorage.setItem('status_address', 'ok');
                message.success('Địa chỉ đã được thêm thành công.');
                form.resetFields();
                onSuccess();  // Call onSuccess to refresh the address list
            } else {
                message.error(`Có lỗi xảy ra: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error while submitting form:', error);
            message.error('Có lỗi xảy ra khi gửi yêu cầu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Thêm địa chỉ giao hàng</h1>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              
                <Form.Item
                    name="nick_name"
                    label="Tên Nick"
                >
                    <Input placeholder="Nhập tên nick" />
                </Form.Item>

                <Form.Item
                    name="phone_number"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    name="province"
                    label="Thành phố"
                    rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
                >
                    <Select
                        placeholder="Chọn thành phố"
                        onChange={handleCityChange}
                        options={cities.map(city => ({ value: city, label: city }))}
                    />
                </Form.Item>

                <Form.Item
                    name="district"
                    label="Quận/Huyện"
                    rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                >
                    <Select
                        placeholder="Chọn quận/huyện"
                        onChange={handleDistrictChange}
                        options={districts.map(district => ({ value: district, label: district }))}
                    />
                </Form.Item>

                <Form.Item
                    name="commune"
                    label="Phường/Xã"
                    rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                >
                    <Select
                        placeholder="Chọn phường/xã"
                        options={communes.map(commune => ({ value: commune, label: commune }))}
                    />
                </Form.Item>

                <Form.Item
                    name="detailed"
                    label="Chi tiết địa chỉ"
                    rules={[{ required: true, message: 'Vui lòng nhập chi tiết địa chỉ' }]}
                >
                    <Input placeholder="Nhập chi tiết địa chỉ" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm địa chỉ
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddAddress;
