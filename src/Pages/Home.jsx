import { Layout } from "antd";
import Dashboard from "./Dashboard";
import { machines } from './MainPage';
const { Content } = Layout;
import { useParams } from 'react-router-dom';
import { ClockCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

import io from 'socket.io-client';

import { Doughnut, Bar } from "react-chartjs-2";

import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from "chart.js";

// Register required components for Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);


const socket = io('http://localhost:5000');


export default function Home(){
    const { machineId } = useParams();

    const currentMachine = machines.find(machine => machine.id === machineId);

    const [data, setData] = useState(null);

    useEffect(() => {
      socket.on('newData', (latestData) => {
        setData(latestData);
      });
  
      // Cleanup on unmount
      return () => {
        socket.off('newData');
      };
    }, []);

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
    
      // Data for Bar chart
      const barData = {
        labels: ['OEE', 'Availability', 'Performance', 'Quality'],
        datasets: [
          {
            label: 'Metrics',
            data: [64, 78, 84, 91], // Sample data
            backgroundColor: ['#66BB6A', '#F57C00', '#FFA000', '#0288D1'],
            borderColor: '#1E88E5',
            borderWidth: 1,
          },
        ],
      };

    return (
        <>
        <Dashboard />
        <Layout style={{ minHeight: '100vh' }}>
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

           <div className="border-2 border-white rounded-lg w-[310px] h-[208px] bg-[#F57C00] ml-3 ">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Availability</h1>
               <h4 className="font-bold text-5xl ml-28 mt-7 text-white ">78%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[310px] h-[208px] bg-[#FFA000] ml-3 ">
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
           <div style={{width:'450px' , height:'400px'}}>
        <h3 className="text-center font-semibold text-lg">Machine Operation</h3>
        <Doughnut data={doughnutData} />
      </div>

      {/* Bar Chart */}
      <div className="w-1/2">
        <h3 className="text-center font-semibold text-lg">OEE & Performance</h3>
        <Bar data={barData} options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'OEE and Performance Metrics',
            },
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
          },
        }} />
      </div>
            </div>

        </div>
        </Content>
    </Layout>
      </>
    )
}