import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Space } from 'antd';
import axios from 'axios';
import './index_login.css';
import { MdAdminPanelSettings } from 'react-icons/md';
import { RiAdminLine, RiLockPasswordFill } from 'react-icons/ri';
import RegisterUser from '../user/RegisterUser';

const Login = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isNextFormRegister,setIsNextFormRegister] = useState(false);
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
                localStorage.setItem('delivery_address',userData.address_id);
                localStorage.setItem('status_address', 'ok');
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
    const handlerNextRegisetr = ()=>{
        setIsNextFormRegister(true);
    }
    if(isNextFormRegister) {
        return (
            <RegisterUser/>
        )
    }
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
                        rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
                    >
                        <Input
                            placeholder="Username"
                            prefix={<RiLockPasswordFill style={{ color: 'rgba(0,0,0,.45)' }} />}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        className='form-login-input'
                        rules={[{ required: true, message: 'Vui lòng nhập mật khảu!' }]}
                    >
                        <Input.Password
                            placeholder="Password"
                            prefix={<RiAdminLine style={{ color: 'rgba(0,0,0,.45)' }} />}

                        />
                    </Form.Item>
                    <Form.Item name="isAdmin" valuePropName="checked">
                        <Checkbox>
                            <span style={{ color: 'white' }}>
                                admin <MdAdminPanelSettings />
                            </span>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Đăng nhập
                            </Button>
                            <Button onClick={handlerNextRegisetr}>
                                Đăng ký tài khoản
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
