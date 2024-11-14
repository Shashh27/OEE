import { Layout } from "antd";
import Dashboard from "./Dashboard";
import { machines } from './MainPage';
const { Content } = Layout;
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import PieCharts from "../Components/PieCharts";
import BarCharts from "../Components/BarCharts";
import DonutCharts from "../Components/DonutCharts";
import { ClockCircleOutlined , DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined , SyncOutlined , SettingOutlined } from '@ant-design/icons';

const socket = io('http://192.168.137.190:5000');


export default function Home(){
    const { machineId } = useParams();
    const [shiftData , setShiftData] = useState('');

    const currentMachine = machines.find(machine => machine.id === machineId);

    useEffect(() => {
      socket.on('newData', (latestData) => {
        setShiftData(latestData);
      });
  
      // Cleanup on unmount
      return () => {
        socket.off('newData');
      };
    }, []);

    return (
        <>
        <Dashboard />
        <Layout >
        <Content style={{ minHeight: '92vh' }}>           
        <div style={{marginLeft:'25px'}}>
            <div className="flex">
            <div className="mt-5">
                <img src={currentMachine.image} alt={currentMachine.title} className="ml-10" style={{width: '300px', height: '300px' ,  borderRadius: '10px'}}/>
            </div>

            <div className="grid grid-cols-4 gap-2">

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'50px',
                backgroundColor:'white',
                paddingTop:'5px',
                paddingLeft:'20px',
                marginTop:'20px',
                marginLeft:'10px'
                }}>
               <ClockCircleOutlined style={{ fontSize: '20px', color: '#66BB6A ', marginRight: '8px' }} />
               <b>Run Time :</b>
               <span style={{ color: '#66BB6A ', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.ProductionTime ? shiftData.ProductionTime : 0} minutes</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'50px',
                backgroundColor:'white',
                paddingTop:'5px',
                paddingLeft:'20px',
                marginTop:'20px',
                marginLeft:'10px'
                }}>
               <ClockCircleOutlined style={{ fontSize: '20px', color: '#FFA500', marginRight: '8px' }} />
               <b>Idle Time :</b>
               <span style={{ color: '#FFA500', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.IdleTime ? shiftData.IdleTime : 0} minutes</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'50px',
                backgroundColor:'white',
                paddingTop:'5px',
                paddingLeft:'20px',
                marginTop:'20px',
                marginLeft:'10px'
                }}>
               <ClockCircleOutlined style={{ fontSize: '20px', color: '#FF6347', marginRight: '8px' }} />
               <b>Off Time :</b>
               <span style={{ color: '#FF6347', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.OffTime ? shiftData.OffTime : 0} minutes</span>
            </div>
            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'50px',
                backgroundColor:'white',
                marginTop:'20px',
                marginLeft:'10px'
                }}>
                  <div className="flex">
              <h1 style={{ fontWeight: 'bold', marginLeft:'14px' }}>Shift: {shiftData.Shift}  </h1>
              <h5 style={{ fontWeight: 'bold' , marginLeft:'20px' }}>Start:{shiftData.StartDate} {shiftData.StartTime} </h5></div>
              <h5 style={{ fontWeight: 'bold' , marginLeft:'88px'  }}>End: {shiftData.EndDate} {shiftData.EndTime}</h5>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'50px',
                backgroundColor:'white',
                paddingTop:'5px',
                paddingLeft:'70px',
                marginTop:'1px',
                marginLeft:'10px'
                }}>
               <DatabaseOutlined style={{ fontSize: '20px', color: '#917072 ', marginRight: '8px' }} />
               <b>Part Count :</b>
               <span style={{ color: '#917072 ', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.PartCount ? shiftData.PartCount : 0}</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'50px',
                backgroundColor:'white',
                paddingTop:'5px',
                paddingLeft:'70px',
                marginTop:'1px',
                marginLeft:'10px'
                }}>
               <CheckCircleOutlined style={{ fontSize: '20px', color: '#66BB6A', marginRight: '8px' }} />
               <b>Good part :</b>
               <span style={{ color: '#66BB6A', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.GoodPart ? shiftData.GoodPart : 0}</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'50px',
                backgroundColor:'white',
                paddingTop:'5px',
                paddingLeft:'70px',
                marginTop:'1px',
                marginLeft:'10px'
                }}>
               <CloseCircleOutlined style={{ fontSize: '20px', color: '#FF6347', marginRight: '8px' }} />
               <b>Bad part :</b>
               <span style={{ color: '#FF6347', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.BadPart ? shiftData.BadPart : 0} </span>
            </div>
            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'310px',
                height:'50px',
                backgroundColor:'white',
                paddingTop:'5px',
                paddingLeft:'45px',
                marginTop:'1px',
                marginLeft:'10px'
                }}>
               <SyncOutlined style={{ fontSize: '20px', color: '#66BB6A', marginRight: '8px' }} />
               <b>Machine State :</b>
               <span style={{ color: '#66BB6A', fontSize: '25px', fontWeight: 'bold' }}> RUN </span>
            </div>

            <div className="border-2 border-white rounded-lg w-[310px] h-[180px] bg-[#00b4d8] ml-3 flex flex-col items-center ">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">OEE</h1>
               <h4 className="font-bold text-5xl mt-7 text-white ">{shiftData.OEE ? shiftData.OEE : 0}%</h4>
           </div>

           <div className=" w-[308px] h-[180px] bg-[#39bdaf] ml-3 flex flex-col items-center" style={{border:'1px solid white' , borderRadius:'10px'}}>
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Availability</h1>
               <h4 className="font-bold text-5xl mt-7 text-white ">{shiftData.Availability ? shiftData.Availability : 0}%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[310px] h-[180px] bg-[#2f6fa1] ml-3 flex flex-col items-center">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Performance</h1>
               <h4 className="font-bold text-5xl mt-7 text-white ">{shiftData.Performance ? shiftData.Performance : 0}%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[310px] h-[180px] bg-[#fc8042] ml-3 flex flex-col items-center">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Quality</h1>
               <h4 className="font-bold text-5xl mt-7 text-white ">{shiftData.Quality ? shiftData.Quality : 0}%</h4>
           </div>   
        </div>
        </div>
        <div className="flex">
                   <div style={{marginLeft:'20px' , marginTop:'20px'}}>
                      <PieCharts width='500px' height='210px' Run={shiftData.ProductionTime ? shiftData.ProductionTime : 0} Idle={shiftData.IdleTime ? shiftData.IdleTime : 0} Off={shiftData.OffTime ? shiftData.OffTime : 0} />
                   </div>
                   <div style={{marginTop:'20px', marginLeft:'20px'}}>
                       <BarCharts width='570px' height='210px' OEE={shiftData.OEE ? shiftData.OEE : 0} Availability={shiftData.Availability ? shiftData.Availability : 0} Performance={shiftData.Performance ? shiftData.Performance : 0} Quality={shiftData.Quality ? shiftData.Quality : 0} />
                   </div>
                   <div style={{marginTop:'20px', marginLeft:'20px'}}>
                       <DonutCharts width='500px' height='210px' PartCount={shiftData.PartCount ? shiftData.PartCount : 0} GoodPart={shiftData.GoodPart ? shiftData.GoodPart : 0} BadPart={shiftData.BadPart ? shiftData.BadPart : 0} />
                   </div>
               </div>
        </div>
        </Content>
    </Layout>
      </>
    )
}