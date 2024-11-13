import React from 'react';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    BarChartOutlined,
    ScheduleOutlined,
    LineChartOutlined,
    FileTextOutlined,
    ToolOutlined,
    RobotOutlined, DatabaseOutlined, ApiOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import logo from '../assets/cmti_logo.jpg'

const { Header, Content } = Layout;

export default function Dashboard() {

    const navigate = useNavigate();
    const { machineId } = useParams();

    const selectedKey = location.pathname.split('/')[2] || 'home';


    return (
            <Header style={{ background: '#f0f2f5', position: 'relative', zIndex: 1, padding: 0 }}> {/* Remove default padding */}
                <div style={{ maxWidth: '2000px', margin: '0 auto', width: '100%' }}>
                    <Menu theme="light" mode="horizontal" selectedKeys={[selectedKey]} style={{ lineHeight: '64px', borderBottom: 'none' }}>
                        <Menu.Item key="machine" onClick={()=>{navigate(`/`)}} icon={<DatabaseOutlined />}>Machines</Menu.Item>
                        <Menu.Item key="home" onClick={()=>{navigate(`/${machineId}/home`)}} icon={<HomeOutlined />}>Home</Menu.Item>
                        <Menu.Item key="shiftwise" onClick={()=>{navigate(`/${machineId}/shiftwise`)}} icon={<BarChartOutlined />}>Shiftwise</Menu.Item>
                        <Menu.Item key="analytics" onClick={()=>{navigate(`/${machineId}/analytics`)}} icon={<ScheduleOutlined />}>Analytics</Menu.Item>
                        <Menu.Item key="report" onClick={()=>{navigate(`/${machineId}/report`)}} icon={<FileTextOutlined />}>Report</Menu.Item>
                        <Menu.Item style={{ pointerEvents: 'none' }}>
                        <img src={logo} alt="Logo" style={{ height: '30px', width:'100px', marginLeft: '1000px', marginTop: '15px', outline: 'none', border: 'none' }} />
                    </Menu.Item>
                    </Menu>

                </div>
            </Header>
    );
}