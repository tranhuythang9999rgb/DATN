import React from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd'
import { GiFastBackwardButton } from 'react-icons/gi';

const data = Array.from({ length: 23 }).map((_, i) => ({
    href: 'https://ant.design',
    title: `Sách ${i}`,
    avatar: `https://picsum.photos/200?random=${i}`,
    description:
        'Một cuốn sách tuyệt vời được biên soạn để mang lại trải nghiệm đọc sách tốt nhất.',
    content:
        'Chúng tôi cung cấp một loạt các sách thuộc nhiều thể loại khác nhau, từ văn học, khoa học đến lịch sử, giúp bạn khám phá thế giới qua từng trang sách và cải thiện kiến thức của mình.',
}));

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

function ListBlogUtils() {
    return (
        <div>
            <div>
            <GiFastBackwardButton />
            </div>
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 3,
                }}
                dataSource={data}
                footer={
                    <div>
                        <b>ant design</b> footer part
                    </div>
                }
                renderItem={(item) => (
                    <List.Item
                        key={item.title}
                        actions={[
                            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                        ]}
                        extra={
                            <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            />
                        }
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={<a href={item.href}>{item.title}</a>}
                            description={item.description}
                        />
                        {item.content}
                    </List.Item>
                )}
            />
        </div>
    );
}

export default ListBlogUtils;