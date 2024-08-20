import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, theme, Tabs } from 'antd';
import { GiAbstract078 } from 'react-icons/gi';
import { GrUserAdmin } from 'react-icons/gr';

import './admin_index.css';
import { IoMdCloudUpload } from 'react-icons/io';
import { FcBarChart } from 'react-icons/fc';
import { LuClipboardList, LuFileBarChart } from 'react-icons/lu';
import { TbUsersGroup } from 'react-icons/tb';

const { Header, Content, Sider } = Layout;

const items1 = [
    {
        key: 'abstract',
        icon: (
            <GiAbstract078
                style={{
                    justifyContent: 'center',
                    fontSize: '60px',
                }}
            />
        ),
    },
];

const tabsContent = [
    {
        key: '1',
        label: (
            <span className="tab-label">
                <IoMdCloudUpload className="icon" /> Tải thông tin sách
            </span>
        ),
        content: <div>Content of Tab 1</div>,
    },
    {
        key: '2',
        label: (
            <span className="tab-label" style={{fontSize:'17px'}}>
                <FcBarChart className="icon" /> Thống kê doanh thu
            </span>
        ),
        content: <div>Content of Tab 2</div>,
    },
    {
        key: '3',
        label: (
            <span className="tab-label" style={{fontSize:'17px'}}>
                <LuFileBarChart className="icon" /> Thống kê đơn hàng
            </span>
        ),
        content: <div>Content of Tab 3</div>,
    },
    {
        key: '4',
        label: (
            <span className="tab-label" style={{fontSize:'17px',color:'#4a4a4a'}}>
                <LuClipboardList className="icon-quan-ly-sach" />Quản lý sách
                </span>
        ),
        content: <div>sách đã tải lên</div>,
    },
    {
        key: '5',
        label: (
            <span className="tab-label" style={{ fontSize: '17px', color: '#4a4a4a' }}>
                <TbUsersGroup className="icon-quan-ly-khach-hang" /> Quản lý khách hàng
            </span>
        ),
        content: <div>Tài khoản khách hàng đã được quản lý</div>,
    },
    
];

const items2 = [
    {
        key: 'sub1',
        icon: <GrUserAdmin />,
        label: (<span style={{
            fontSize:'18px',

        }}>
            Quản lý
        </span>),
        children: tabsContent.map(tab => ({
            key: tab.key,
            label: tab.label,
            content: tab.content,
        })),
    },
];

function Dashboard() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [activeMenuItem, setActiveMenuItem] = useState('1');

    const handleMenuClick = ({ key }) => {
        setActiveMenuItem(key);
    };

    return (
        <div>
            <Layout>
                <Header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        background:
                            'linear-gradient(90deg, rgba(255, 189, 68, 1) 0%, rgba(240, 98, 146, 1) 35%, rgba(0, 122, 166, 1) 100%)',
                    }}
                >
                    <div className="demo-logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['abstract']}
                        items={items1}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            background:
                                'linear-gradient(90deg, rgba(255, 189, 68, 1) 0%, rgba(240, 98, 146, 1) 35%, rgba(0, 122, 166, 1) 100%)',
                        }}
                    />
                </Header>
                <Layout>
                    <Sider
                        width={250}
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['sub1']}
                            defaultOpenKeys={['sub1']}
                            style={{
                                height: '100%',
                                borderRight: 0,
                            }}
                            items={items2}
                            onClick={handleMenuClick}
                        />
                    </Sider>
                    <Layout
                        style={{
                            padding: '0 24px 24px',
                        }}
                    >
                        <Breadcrumb
                            style={{
                                margin: '16px 0',
                            }}
                        />
                        <Content
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Tabs
                                activeKey={activeMenuItem}
                                items={tabsContent.map(tab => ({
                                    key: tab.key,
                                    children: tab.content,
                                }))}
                            />
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </div>
    );
}

export default Dashboard;
