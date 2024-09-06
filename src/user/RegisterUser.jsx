import { Button, Form, Input, message, Upload } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { WeiboCircleFilled } from '@ant-design/icons';
import './user_index.css';
import Login from '../common/Login';

export default function RegisterUser() {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [goBackFormLogin, setGoBackFormLogin] = useState(false);

    const handleFormSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('username', values.user_name);  // Thay đổi 'user_name' thành 'username'
            formData.append('password', values.password);
            formData.append('email', values.email);
            formData.append('phone_number', values.phone_number);
            formData.append('file', imageFile);  // Đảm bảo đính kèm đúng file

            const response = await axios.post(
                'http://127.0.0.1:8080/manager/user/register',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.code === 0) {
                message.success('Tạo tài khoản thành công');
            } else if (response.data.code === 5) {
                message.warning('Tên tài khoản hoặc email đã tồn tại');
            } else {
                message.error('Lỗi server, vui lòng thử lại');
            }
        } catch (error) {
            console.log(error);
            message.error('Lỗi server, vui lòng thử lại');
        }
    };

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const handlerGoback = () => {
        setGoBackFormLogin(true);
    }

    if (goBackFormLogin) {
        return <Login />;
    }

    return (
        <div>
            <div><WeiboCircleFilled /></div>
            <Form {...layout} form={form} className="form-container-register-customer" onFinish={handleFormSubmit}>
                <Form.Item
                    label="Tên tài khoản"
                    name="user_name"  // Thay đổi name thành 'user_name' vì trong form đang sử dụng key này
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên tài khoản!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            type: 'email',
                            message: 'Email không hợp lệ!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone_number"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Ảnh đại diện"
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                            return e;
                        }
                        return e && e.fileList;
                    }}
                >
                    <Upload
                        maxCount={1}
                        listType='picture-card'
                        accept="image/jpeg,image/png"
                        beforeUpload={(file) => {
                            setImageFile(file);
                            return false;  // Ngăn upload tự động
                        }}
                        onRemove={() => {
                            setImageFile(null);
                        }}
                    >
                        +Upload
                    </Upload>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button onClick={handlerGoback} style={{ marginRight: '10px' }}>Quay lại</Button>
                    <Button type="primary" htmlType="submit">
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
