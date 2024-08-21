import { Button, Form, message, Upload } from 'antd';
import axios from 'axios';
import React, { useState } from 'react'

export default function UpSertFileByBookId({anyId,load }) {

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList }) => {
    setFileList(fileList);
  };
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handlerSubmitUpsertFile = async () => {
    try {
      const formData = new FormData();
      formData.append('any_id', anyId);
      fileList.forEach((file) => {
        formData.append('file', file.originFileObj);
      });
      const response = await axios.post('http://127.0.0.1:8080/manager/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.data.code === 0) {
        load();
        message.success('Upload ảnh thành công');
        return;
      } else {
        message.error('error server');
        return;
      }
    } catch (error) {
      console.log(error);
      message.error('error server');
      return;
    }
  }

  return (
    <div>
      <Form {...layout} form={form} className="form-container-upsert-with-file" onFinish={handlerSubmitUpsertFile}>

        <Form.Item
          label="Nhập ảnh mô tả"
          className="form-row"
          name="file"
          rules={[{ required: true, message: 'Vui lòng chọn ảnh mô tả!' }]}
        >
          <Upload
            fileList={fileList}
            listType="picture-card"
            accept="image/jpeg,image/png"
            onChange={onChange}
            beforeUpload={() => false} // Prevent auto-upload
          >
            {'+ Upload'}
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
          Thêm ảnh mô tả
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
