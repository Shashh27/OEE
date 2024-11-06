import { Layout } from "antd";
import Dashboard from "./Dashboard";
import { machines } from './MainPage';
const { Content } = Layout;
import { useParams } from 'react-router-dom';
import { ClockCircleOutlined } from '@ant-design/icons';


export default function Home(){
    const { machineId } = useParams();


    const currentMachine = machines.find(machine => machine.id === machineId);

    return (
        <>
        <Dashboard />
        <Layout style={{ minHeight: '100vh' }}>
        <Content>
            <div className="flex">
            <div className="mt-5">
                <img src={currentMachine.image} alt={currentMachine.title} className="ml-10" style={{width: '300px', height: '300px' ,  borderRadius: '10px'}}/>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'80px',
                backgroundColor:'white',
                padding:'20px',
                marginTop:'20px',
                marginLeft:'10px'
                }}>
               <ClockCircleOutlined style={{ fontSize: '20px', color: '#66BB6A ', marginRight: '8px' }} />
               <b>Run Time :</b>
               <span style={{ color: '#66BB6A ', fontSize: '25px', fontWeight: 'bold' }}> 366 minutes</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'80px',
                backgroundColor:'white',
                padding:'20px',
                marginTop:'20px',
                marginLeft:'10px'
                }}>
               <ClockCircleOutlined style={{ fontSize: '20px', color: '#FFA500', marginRight: '8px' }} />
               <b>Idle Time :</b>
               <span style={{ color: '#FFA500', fontSize: '25px', fontWeight: 'bold' }}> 145 minutes</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'80px',
                backgroundColor:'white',
                padding:'20px',
                marginTop:'20px',
                marginLeft:'10px'
                }}>
               <ClockCircleOutlined style={{ fontSize: '20px', color: '#FF6347', marginRight: '8px' }} />
               <b>Off Time :</b>
               <span style={{ color: '#FF6347', fontSize: '25px', fontWeight: 'bold' }}> 36 minutes</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'80px',
                backgroundColor:'white',
                padding:'10px',
                paddingLeft:'60px',
                marginTop:'20px',
                marginLeft:'10px'
                }}>
              <h1 style={{ marginLeft: '45px', fontWeight: 'bold' }}>Shift: 1</h1>
              <h4 style={{ fontWeight: 'bold' }}>Start: 07-11-2024 09:00:00</h4>
              <h4 style={{ fontWeight: 'bold' }}>End: 07-11-2024 17:00:00</h4>
            </div>

            </div>
        </Content>
    </Layout>
      </>
    )
}