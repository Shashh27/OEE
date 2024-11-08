import React from 'react';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    BarChartOutlined,
    ScheduleOutlined,
    LineChartOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const { Header, Content } = Layout;

export default function Dashboard() {

    const navigate = useNavigate();
    const { machineId } = useParams();

    return (
            <Header style={{ background: '#f0f2f5', position: 'relative', zIndex: 1, padding: 0 }}> {/* Remove default padding */}
                <div style={{ maxWidth: '2000px', margin: '0 auto', width: '100%' }}>
                    <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px', borderBottom: 'none' }}>
                        <Menu.Item key="1" onClick={()=>{navigate(`/${machineId}/home`)}} icon={<HomeOutlined />}>Home</Menu.Item>
                        <Menu.Item key="2" onClick={()=>{navigate(`/${machineId}/analytics`)}} icon={<BarChartOutlined />}>Analytics</Menu.Item>
                        <Menu.Item key="3" onClick={()=>{navigate(`/${machineId}/weekly`)}} icon={<ScheduleOutlined />}>Weekly</Menu.Item>
                        <Menu.Item key="4" onClick={()=>{navigate(`/${machineId}/monthly`)}} icon={<LineChartOutlined />}>Monthly</Menu.Item>
                        <Menu.Item key="5" onClick={()=>{navigate(`/${machineId}/report`)}} icon={<FileTextOutlined />}>Report</Menu.Item>
                    </Menu>
                </div>
            </Header>
    );
}
