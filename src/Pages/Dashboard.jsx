import React from 'react';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    BarChartOutlined,
    CalendarOutlined,
    ScheduleOutlined,
    LineChartOutlined,
    FileTextOutlined,
} from '@ant-design/icons';

const { Header, Content } = Layout;

export default function Dashboard() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#f0f2f5', position: 'relative', zIndex: 1, padding: 0 }}> {/* Remove default padding */}
                <div style={{ maxWidth: '2000px', margin: '0 auto', width: '100%' }}>
                    <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px', borderBottom: 'none' }}>
                        <Menu.Item key="1" icon={<HomeOutlined />}>Home</Menu.Item>
                        <Menu.Item key="2" icon={<BarChartOutlined />}>Analytics</Menu.Item>
                        <Menu.Item key="3" icon={<CalendarOutlined />}>Daily</Menu.Item>
                        <Menu.Item key="4" icon={<ScheduleOutlined />}>Weekly</Menu.Item>
                        <Menu.Item key="5" icon={<LineChartOutlined />}>Monthly</Menu.Item>
                        <Menu.Item key="6" icon={<FileTextOutlined />}>Report</Menu.Item>
                    </Menu>
                </div>
            </Header>
            <Content>
                <div>

                </div>
            </Content>
        </Layout>
    );
}
