import { Layout } from "antd";
import Dashboard from "./Dashboard";
import { machines } from './MainPage';
const { Content } = Layout;
import { useParams } from 'react-router-dom';
import { ClockCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Doughnut, Bar  } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip as ChartTooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from "chart.js";
import {  XAxis as RXaxis, YAxis as RYaxis, CartesianGrid as RCartesianGrid, Tooltip as RTooltip, Legend as RLegend, LineChart as RLineChart, Line as RLine,  } from 'recharts';

// Register required components for Chart.js
ChartJS.register(Title, ChartTooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);


// Register required components for Chart.js
ChartJS.register(Title, ChartTooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const data = [
    { name: 'OEE', value: 64 },
    { name: 'Availability', value: 71 },
    { name: 'Performance', value: 84 },
    { name: 'Quality', value: 91 },
  ];
  
  const colors = ['#66BB6A', '#FFA000','#F57C00', '#0288D1'];
  

// const socket = io('http://localhost:5000');

const OperationTrendData = [
  { name: 'Nov 04', RunTime: 1096, IdleTime: 145.28, OffTime: 828.32 },
  { name: 'Nov 05', RunTime: 1064, IdleTime: 143.51, OffTime: 822.0 },
  { name: 'Nov 06', RunTime: 1007, IdleTime: 140.95, OffTime: 812.14 },
  { name: 'Nov 07', RunTime: 949, IdleTime: 148.13, OffTime: 833.0 },
];

const MachineOperationTrend = () => {
  return (
    <RLineChart width={500} height={350} data={OperationTrendData}>
      <RXaxis dataKey="name" />
      <RYaxis />
      <RCartesianGrid strokeDasharray="3 3" />
      <RTooltip />   #66BB6A', '#FFA500', '#FF6347
      <RLegend />
      <RLine type="monotone" dataKey="RunTime" stroke="#66BB6A" />
      <RLine type="monotone" dataKey="IdleTime" stroke="#FFA500" />
      <RLine type="monotone" dataKey="OffTime" stroke="#FF6347" />
    </RLineChart>
  );
};


export default function Home(){
    const { machineId } = useParams();

    const currentMachine = machines.find(machine => machine.id === machineId);

    // useEffect(() => {
    //   socket.on('newData', (latestData) => {
    //     setData(latestData);
    //   });
  
    //   // Cleanup on unmount
    //   return () => {
    //     socket.off('newData');
    //   };
    // }, []);

    const doughnutData = {
        labels: ['Run Time', 'Idle Time', 'Off Time'],
        datasets: [
          {
            data: [366, 144, 35], // Sample data
            backgroundColor: ['#66BB6A', '#FFA500', '#FF6347'],
            hoverBackgroundColor: ['#66BB6A', '#FFA500', '#FF6347'],
          },
        ],
      };

      const barData = {
        labels: data.map(item => item.name),
        datasets: [
          {
            data: data.map(item => item.value),
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1,
          },
        ],
      };
    
      const barOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'OEE Analysis',
            font: {
              size: 16,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              },
            },
          },
        },
      };
    
    return (
        <>
        <Dashboard />
        <Layout style={{ minHeight: '92vh' }}>
        <Content>
            <div>
            <div className="flex">
            <div className="mt-5">
                <img src={currentMachine.image} alt={currentMachine.title} className="ml-10" style={{width: '300px', height: '300px' ,  borderRadius: '10px'}}/>
            </div>

            <div className="grid grid-cols-4 gap-2">

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

            <div className="border-2 border-white rounded-lg w-[310px] h-[208px] bg-[#66BB6A] ml-3 ">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">OEE</h1>
               <h4 className="font-bold text-5xl ml-28 mt-7 text-white ">64%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[310px] h-[208px] bg-[#FFA000] ml-3 ">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Availability</h1>
               <h4 className="font-bold text-5xl ml-28 mt-7 text-white ">78%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[310px] h-[208px] bg-[#F57C00] ml-3 ">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Performance</h1>
               <h4 className="font-bold text-5xl ml-28 mt-7 text-white ">84%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[310px] h-[208px] bg-[#0288D1] ml-3 ">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Quality</h1>
               <h4 className="font-bold text-5xl ml-24 mt-7 text-white ">91%</h4>
           </div>   
        </div>
        </div>
           <div className="flex"> 
              <div style={{ width: '350px', height: '350px', marginLeft: '40px', marginTop: '30px', border: '1px solid white' , backgroundColor:'white' , borderRadius: '10px'}}>
                 <Doughnut data={doughnutData} style={{width:'400px', height:'350px'}} />
             </div>
             <div style={{ width:'630px', height:'350px',marginLeft: '50px', marginTop: '30px' ,border: '1px solid white' , backgroundColor:'white' , borderRadius: '10px'  }}>
                <Bar data={barData} options={barOptions} style={{width:'500px', height:'370px'}} />
              </div>
              <div style={{ width:'530px', height:'350px',marginLeft: '50px', marginTop: '30px' ,border: '1px solid white' , backgroundColor:'white' , borderRadius: '10px'  }}>
                 <MachineOperationTrend />
              </div>
      
            </div>

        </div>
        </Content>
    </Layout>
      </>
    )
}