import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import axios from 'axios';
import './index_login.css';

const Login = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (values) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', values.username);
            formData.append('password', values.password);

            const response = await axios.post('http://127.0.0.1:8080/manager/user/login', formData);

            console.log('API Response:', response.data); // Debug: Check response structure
            
            if (response.data.code === 0) {
                // Save entire response body as JSON
                const userData = response.data.body;
                localStorage.setItem('userData', JSON.stringify(userData));
                window.location.reload();
            } else {
                alert('Thông tin tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error(error);
            alert('Đã xảy ra lỗi khi đăng nhập.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-login-user">
            <div className='form-login'>
                <Form
                    className='login-form'
                    form={form}
                    onFinish={handleFormSubmit}
                    initialValues={{
                        remember: true,
                    }}
                >
                    <Form.Item
                        name="username"
                        className='form-login-input'
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        className='form-login-input'
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item name="isAdmin" valuePropName="checked">
                        <Checkbox>Admin</Checkbox>
                    </Form.Item>
                    <Form.Item style={{display:'flex', justifyContent:'center'}}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
