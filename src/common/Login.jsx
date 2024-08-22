import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import Dashboard from '../admin/Dashboard';

const Login = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isCheckAdmin, setIsCheckAdmin] = useState(false);

    const handleFormSubmit = async (values) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', values.username);
            formData.append('password', values.password);

            const response = await axios.post('http://127.0.0.1:8080/manager/user/login', formData);

            if (response.data.code === 0) {
                localStorage.setItem('username', response.data.body.user_name);

                if (response.data.body.role === 1) {
                    setIsCheckAdmin(true);
                    return <Dashboard />;  // Trả về Dashboard nếu role là 1
                } else {
                    alert('Bạn không có quyền truy cập Dashboard.');
                }
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

    // Nếu isCheckAdmin là true, hiển thị Dashboard
    if (isCheckAdmin) {
        return <Dashboard />;
    }

    // Nếu chưa đăng nhập, hiển thị form đăng nhập
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
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
