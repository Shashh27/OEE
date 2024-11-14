// import { Layout } from "antd";
// import Dashboard from "./Dashboard";
// import { machines } from './MainPage';
// const { Content } = Layout;
// import { useParams } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import PieCharts from "../Components/PieCharts";
// import BarCharts from "../Components/BarCharts";
// import DonutCharts from "../Components/DonutCharts";
// import { ClockCircleOutlined , DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined , SyncOutlined , SettingOutlined } from '@ant-design/icons';

// const socket = io('http://192.168.137.190:5000');


// export default function Home(){
//     const { machineId } = useParams();
//     const [shiftData , setShiftData] = useState('');

//     const currentMachine = machines.find(machine => machine.id === machineId);

//     useEffect(() => {
//       socket.on('newData', (latestData) => {
//         setShiftData(latestData);
//       });
  
//       // Cleanup on unmount
//       return () => {
//         socket.off('newData');
//       };
//     }, []);

//     return (
//         <>
//         <Dashboard />
//         <Layout >
//         <Content style={{ minHeight: '92vh' }}>           
//         <div style={{marginLeft:'25px'}}>
//             <div className="flex">
//             <div className="mt-5">
//                 <img src={currentMachine.image} alt={currentMachine.title} className="ml-10" style={{width: '300px', height: '300px' ,  borderRadius: '10px'}}/>
//             </div>

//             <div className="grid grid-cols-4 gap-2">

//             <div style={{ 
//                 border: '2px solid white', 
//                 borderRadius: '8px',
//                 width:'310px',
//                 height:'50px',
//                 backgroundColor:'white',
//                 paddingTop:'5px',
//                 paddingLeft:'20px',
//                 marginTop:'20px',
//                 marginLeft:'10px'
//                 }}>
//                <ClockCircleOutlined style={{ fontSize: '20px', color: '#66BB6A ', marginRight: '8px' }} />
//                <b>Run Time :</b>
//                <span style={{ color: '#66BB6A ', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.ProductionTime ? shiftData.ProductionTime : 0} minutes</span>
//             </div>

//             <div style={{ 
//                 border: '2px solid white', 
//                 borderRadius: '8px',
//                 width:'310px',
//                 height:'50px',
//                 backgroundColor:'white',
//                 paddingTop:'5px',
//                 paddingLeft:'20px',
//                 marginTop:'20px',
//                 marginLeft:'10px'
//                 }}>
//                <ClockCircleOutlined style={{ fontSize: '20px', color: '#FFA500', marginRight: '8px' }} />
//                <b>Idle Time :</b>
//                <span style={{ color: '#FFA500', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.IdleTime ? shiftData.IdleTime : 0} minutes</span>
//             </div>

//             <div style={{ 
//                 border: '2px solid white', 
//                 borderRadius: '8px',
//                 width:'310px',
//                 height:'50px',
//                 backgroundColor:'white',
//                 paddingTop:'5px',
//                 paddingLeft:'20px',
//                 marginTop:'20px',
//                 marginLeft:'10px'
//                 }}>
//                <ClockCircleOutlined style={{ fontSize: '20px', color: '#FF6347', marginRight: '8px' }} />
//                <b>Off Time :</b>
//                <span style={{ color: '#FF6347', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.OffTime ? shiftData.OffTime : 0} minutes</span>
//             </div>
//             <div style={{ 
//                 border: '2px solid white', 
//                 borderRadius: '8px',
//                 width:'310px',
//                 height:'50px',
//                 backgroundColor:'white',
//                 marginTop:'20px',
//                 marginLeft:'10px'
//                 }}>
//                   <div className="flex">
//               <h1 style={{ fontWeight: 'bold', marginLeft:'14px' }}>Shift: {shiftData.Shift}  </h1>
//               <h5 style={{ fontWeight: 'bold' , marginLeft:'20px' }}>Start:{shiftData.StartDate} {shiftData.StartTime} </h5></div>
//               <h5 style={{ fontWeight: 'bold' , marginLeft:'88px'  }}>End: {shiftData.EndDate} {shiftData.EndTime}</h5>
//             </div>

//             <div style={{ 
//                 border: '2px solid white', 
//                 borderRadius: '8px',
//                 width:'310px',
//                 height:'50px',
//                 backgroundColor:'white',
//                 paddingTop:'5px',
//                 paddingLeft:'70px',
//                 marginTop:'1px',
//                 marginLeft:'10px'
//                 }}>
//                <DatabaseOutlined style={{ fontSize: '20px', color: '#917072 ', marginRight: '8px' }} />
//                <b>Part Count :</b>
//                <span style={{ color: '#917072 ', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.PartCount ? shiftData.PartCount : 0}</span>
//             </div>

//             <div style={{ 
//                 border: '2px solid white', 
//                 borderRadius: '8px',
//                 width:'310px',
//                 height:'50px',
//                 backgroundColor:'white',
//                 paddingTop:'5px',
//                 paddingLeft:'70px',
//                 marginTop:'1px',
//                 marginLeft:'10px'
//                 }}>
//                <CheckCircleOutlined style={{ fontSize: '20px', color: '#66BB6A', marginRight: '8px' }} />
//                <b>Good part :</b>
//                <span style={{ color: '#66BB6A', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.GoodPart ? shiftData.GoodPart : 0}</span>
//             </div>

//             <div style={{ 
//                 border: '2px solid white', 
//                 borderRadius: '8px',
//                 width:'310px',
//                 height:'50px',
//                 backgroundColor:'white',
//                 paddingTop:'5px',
//                 paddingLeft:'70px',
//                 marginTop:'1px',
//                 marginLeft:'10px'
//                 }}>
//                <CloseCircleOutlined style={{ fontSize: '20px', color: '#FF6347', marginRight: '8px' }} />
//                <b>Bad part :</b>
//                <span style={{ color: '#FF6347', fontSize: '25px', fontWeight: 'bold' }}> {shiftData.BadPart ? shiftData.BadPart : 0} </span>
//             </div>
//             <div style={{ 
//                 border: '2px solid white', 
//                 borderRadius: '8px',
//                 width:'310px',
//                 height:'50px',
//                 backgroundColor:'white',
//                 paddingTop:'5px',
//                 paddingLeft:'45px',
//                 marginTop:'1px',
//                 marginLeft:'10px'
//                 }}>
//                <SyncOutlined style={{ fontSize: '20px', color: '#66BB6A', marginRight: '8px' }} />
//                <b>Machine State :</b>
//                <span style={{ fontSize: '25px', fontWeight: 'bold' }}> {shiftData.MachineState} </span>
//             </div>

//             <div className="border-2 border-white rounded-lg w-[310px] h-[180px] bg-[#00b4d8] ml-3 flex flex-col items-center ">
//                <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">OEE</h1>
//                <h4 className="font-bold text-5xl mt-7 text-white ">{shiftData.OEE ? shiftData.OEE : 0}%</h4>
//            </div>

//            <div className=" w-[308px] h-[180px] bg-[#39bdaf] ml-3 flex flex-col items-center" style={{border:'1px solid white' , borderRadius:'10px'}}>
//                <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Availability</h1>
//                <h4 className="font-bold text-5xl mt-7 text-white ">{shiftData.Availability ? shiftData.Availability : 0}%</h4>
//            </div>

//            <div className="border-2 border-white rounded-lg w-[310px] h-[180px] bg-[#2f6fa1] ml-3 flex flex-col items-center">
//                <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Performance</h1>
//                <h4 className="font-bold text-5xl mt-7 text-white ">{shiftData.Performance ? shiftData.Performance : 0}%</h4>
//            </div>

//            <div className="border-2 border-white rounded-lg w-[310px] h-[180px] bg-[#fc8042] ml-3 flex flex-col items-center">
//                <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Quality</h1>
//                <h4 className="font-bold text-5xl mt-7 text-white ">{shiftData.Quality ? shiftData.Quality : 0}%</h4>
//            </div>   
//         </div>
//         </div>
//         <div className="flex">
//                    <div style={{marginLeft:'20px' , marginTop:'20px'}}>
//                       <PieCharts width='500px' height='210px' Run={shiftData.ProductionTime ? shiftData.ProductionTime : 0} Idle={shiftData.IdleTime ? shiftData.IdleTime : 0} Off={shiftData.OffTime ? shiftData.OffTime : 0} />
//                    </div>
//                    <div style={{marginTop:'20px', marginLeft:'20px'}}>
//                        <BarCharts width='570px' height='210px' OEE={shiftData.OEE ? shiftData.OEE : 0} Availability={shiftData.Availability ? shiftData.Availability : 0} Performance={shiftData.Performance ? shiftData.Performance : 0} Quality={shiftData.Quality ? shiftData.Quality : 0} />
//                    </div>
//                    <div style={{marginTop:'20px', marginLeft:'20px'}}>
//                        <DonutCharts width='500px' height='210px' PartCount={shiftData.PartCount ? shiftData.PartCount : 0} GoodPart={shiftData.GoodPart ? shiftData.GoodPart : 0} BadPart={shiftData.BadPart ? shiftData.BadPart : 0} />
//                    </div>
//                </div>
//         </div>
//         </Content>
//     </Layout>
//       </>
//     )
// }

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
import { ClockCircleOutlined, DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, SettingOutlined } from '@ant-design/icons';

const socket = io('http://192.168.137.190:5000');

export default function Home() {
    const { machineId } = useParams();
    const [shiftData, setShiftData] = useState('');

    const currentMachine = machines.find(machine => machine.id === machineId);

    useEffect(() => {
        socket.on('newData', (latestData) => {
            setShiftData(latestData);
        });

        return () => {
            socket.off('newData');
        };
    }, []);

    return (
        <>
            <Dashboard />
            <Layout>
                <Content className="min-h-[92vh]">
                    <div className="p-4 md:p-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Machine Image Section - Adjusted height to match cards */}
                            <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-lg p-4 h-[330px] flex items-center justify-center">
                                <img 
                                    src={currentMachine.image} 
                                    alt={currentMachine.title} 
                                    className="w-full h-auto max-w-[300px] object-contain"
                                />
                            </div>

                            {/* Stats Grid Section */}
                            <div className="w-full lg:w-3/4">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Runtime Card */}
                                    <div className="bg-white rounded-lg p-4 shadow-md">
                                        <div className="flex items-center">
                                            <ClockCircleOutlined className="text-[#66BB6A] text-xl mr-2" />
                                            <span className="font-bold">Run Time:</span>
                                        </div>
                                        <div className="text-[#66BB6A] text-2xl font-bold mt-1">
                                            {shiftData.ProductionTime ? shiftData.ProductionTime : 0} minutes
                                        </div>
                                    </div>

                                    {/* Idle Time Card */}
                                    <div className="bg-white rounded-lg p-4 shadow-md">
                                        <div className="flex items-center">
                                            <ClockCircleOutlined className="text-[#FFA500] text-xl mr-2" />
                                            <span className="font-bold">Idle Time:</span>
                                        </div>
                                        <div className="text-[#FFA500] text-2xl font-bold mt-1">
                                            {shiftData.IdleTime ? shiftData.IdleTime : 0} minutes
                                        </div>
                                    </div>

                                    {/* Off Time Card */}
                                    <div className="bg-white rounded-lg p-4 shadow-md">
                                        <div className="flex items-center">
                                            <ClockCircleOutlined className="text-[#FF6347] text-xl mr-2" />
                                            <span className="font-bold">Off Time:</span>
                                        </div>
                                        <div className="text-[#FF6347] text-2xl font-bold mt-1">
                                            {shiftData.OffTime ? shiftData.OffTime : 0} minutes
                                        </div>
                                    </div>

                                    {/* Shift Info Card */}
                                    <div className="bg-white rounded-lg p-4 shadow-md">
                                        <div className="flex flex-col">
                                            <div className="font-bold">Shift: {shiftData.Shift}</div>
                                            <div className="text-sm">Start: {shiftData.StartDate} {shiftData.StartTime}</div>
                                            <div className="text-sm">End: {shiftData.EndDate} {shiftData.EndTime}</div>
                                        </div>
                                    </div>

                                    {/* Part Count Card */}
                                    <div className="bg-white rounded-lg p-4 shadow-md">
                                        <div className="flex items-center">
                                            <DatabaseOutlined className="text-[#917072] text-xl mr-2" />
                                            <span className="font-bold">Part Count:</span>
                                        </div>
                                        <div className="text-[#917072] text-2xl font-bold mt-1">
                                            {shiftData.PartCount ? shiftData.PartCount : 0}
                                        </div>
                                    </div>

                                    {/* Good Part Card */}
                                    <div className="bg-white rounded-lg p-4 shadow-md">
                                        <div className="flex items-center">
                                            <CheckCircleOutlined className="text-[#66BB6A] text-xl mr-2" />
                                            <span className="font-bold">Good Part:</span>
                                        </div>
                                        <div className="text-[#66BB6A] text-2xl font-bold mt-1">
                                            {shiftData.GoodPart ? shiftData.GoodPart : 0}
                                        </div>
                                    </div>

                                    {/* Bad Part Card */}
                                    <div className="bg-white rounded-lg p-4 shadow-md">
                                        <div className="flex items-center">
                                            <CloseCircleOutlined className="text-[#FF6347] text-xl mr-2" />
                                            <span className="font-bold">Bad Part:</span>
                                        </div>
                                        <div className="text-[#FF6347] text-2xl font-bold mt-1">
                                            {shiftData.BadPart ? shiftData.BadPart : 0}
                                        </div>
                                    </div>

                                    {/* Machine State Card */}
                                    <div className="bg-white rounded-lg p-4 shadow-md">
                                        <div className="flex items-center">
                                            <SyncOutlined className="text-[#66BB6A] text-xl mr-2" />
                                            <span className="font-bold">Machine State:</span>
                                        </div>
                                        <div className="text-[#66BB6A] text-2xl font-bold mt-1">
                                            RUN
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                    {/* OEE Card */}
                                    <div className="bg-[#00b4d8] rounded-lg p-4 text-white">
                                        <h1 className="text-lg font-bold">OEE</h1>
                                        <h4 className="text-4xl font-bold mt-4">
                                            {shiftData.OEE ? shiftData.OEE : 0}%
                                        </h4>
                                    </div>

                                    {/* Availability Card */}
                                    <div className="bg-[#39bdaf] rounded-lg p-4 text-white">
                                        <h1 className="text-lg font-bold">Availability</h1>
                                        <h4 className="text-4xl font-bold mt-4">
                                            {shiftData.Availability ? shiftData.Availability : 0}%
                                        </h4>
                                    </div>

                                    {/* Performance Card */}
                                    <div className="bg-[#2f6fa1] rounded-lg p-4 text-white">
                                        <h1 className="text-lg font-bold">Performance</h1>
                                        <h4 className="text-4xl font-bold mt-4">
                                            {shiftData.Performance ? shiftData.Performance : 0}%
                                        </h4>
                                    </div>

                                    {/* Quality Card */}
                                    <div className="bg-[#fc8042] rounded-lg p-4 text-white">
                                        <h1 className="text-lg font-bold">Quality</h1>
                                        <h4 className="text-4xl font-bold mt-4">
                                            {shiftData.Quality ? shiftData.Quality : 0}%
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            <div className="w-full">
                                <PieCharts 
                                    width="100%" 
                                    height="250px"
                                    Run={shiftData.ProductionTime ? shiftData.ProductionTime : 0}
                                    Idle={shiftData.IdleTime ? shiftData.IdleTime : 0}
                                    Off={shiftData.OffTime ? shiftData.OffTime : 0}
                                />
                            </div>
                            <div className="w-full">
                                <BarCharts 
                                    width="100%" 
                                    height="400px"
                                    OEE={shiftData.OEE ? shiftData.OEE : 0}
                                    Availability={shiftData.Availability ? shiftData.Availability : 0}
                                    Performance={shiftData.Performance ? shiftData.Performance : 0}
                                    Quality={shiftData.Quality ? shiftData.Quality : 0}
                                />
                            </div>
                            <div className="w-full">
                                <DonutCharts 
                                    width="100%" 
                                    height="210px"
                                    PartCount={shiftData.PartCount ? shiftData.PartCount : 0}
                                    GoodPart={shiftData.GoodPart ? shiftData.GoodPart : 0}
                                    BadPart={shiftData.BadPart ? shiftData.BadPart : 0}
                                />
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
        </>
    );
}
