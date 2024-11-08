import { Button, Layout } from "antd";
import Dashboard from "./Dashboard";
const { Content } = Layout;
import { DatePicker , Select } from "antd";
import { ClockCircleOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import xrange from 'highcharts/modules/xrange';

highchartsMore(Highcharts);
xrange(Highcharts);
import React, { useEffect, useState , useRef} from 'react';
import MachineStateTimelineChart from "../Components/MachineStateTimelineChart";

export default function Analytics(){
   

  
      const dummyData = [
        { startTime: 1621209600, endTime: 1621213200, state: 'IDLE' },
        { startTime: 1621213200, endTime: 1621216800, state: 'PRODUCTION' },
        { startTime: 1621216800, endTime: 1621220400, state: 'IDLE' },
        { startTime: 1621220400, endTime: 1621224000, state: 'OFF' },
        { startTime: 1621224000, endTime: 1621227600, state: 'IDLE' },
        { startTime: 1621227600, endTime: 1621231200, state: 'PRODUCTION' },
        { startTime: 1621231200, endTime: 1621234800, state: 'IDLE' },
        { startTime: 1621234800, endTime: 1621238400, state: 'OFF' }
      ];
  
      
    return(
    <>
    <Dashboard/>
    <Layout>
        <Content>
            <div className="flex">
            <div>        
                <div style={{ width:'1100px' , height:'70px' , backgroundColor:'white' , marginTop:'10px' , marginLeft:'20px' , borderRadius:'10px'}}>
                <h2 style={{color:'black' , fontSize:'27px' , paddingLeft:'450px' , paddingTop:'20px' }}>Shiftwise Analytics</h2>
                </div> 

                <div className="flex grid-cols-4 gap-2 mt-3 ml-2">
                   <div className="border-2 border-white rounded-lg w-[260px] h-[208px] bg-[#66BB6A] ml-3 ">
                       <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">OEE</h1>
                       <h4 className="font-bold text-5xl ml-20 mt-7 text-white ">64%</h4>
                  </div>

                  <div className="border-2 border-white rounded-lg w-[260px] h-[208px] bg-[#FFA000] ml-3 ">
                      <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Availability</h1>
                      <h4 className="font-bold text-5xl ml-20 mt-7 text-white ">78%</h4>
                 </div>

                 <div className="border-2 border-white rounded-lg w-[260px] h-[208px] bg-[#F57C00] ml-3 ">
                      <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Performance</h1>
                      <h4 className="font-bold text-5xl ml-20 mt-7 text-white ">84%</h4>
                 </div>

                 <div className="border-2 border-white rounded-lg w-[260px] h-[208px] bg-[#0288D1] ml-3 ">
                      <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Quality</h1>
                      <h4 className="font-bold text-5xl ml-20 mt-7 text-white ">91%</h4>
                 </div>   
                </div>       
            </div>
           
           <div className="block">
            <div style={{width:'550px' , height:'70px' , border:'1px solid white' , backgroundColor:'white', marginLeft:'25px' , marginTop:'10px' , borderRadius:'10px'}}>
                 <DatePicker placeholder="Select Date" style={{marginLeft:'30px' , marginTop:'15px' , width:'170px'}} />
                    <Select placeholder="Select Shift" style={{marginLeft:'30px' , marginTop:'15px' , width:'170px'}} >
                        <Option value="shift1">Shift 1</Option>
                        <Option value="shift2">Shift 2</Option>
                    </Select>
                  <Button type="primary" style={{marginLeft:'30px' , marginTop:'15px'}}> Submit</Button>
            </div>
            <div style={{ 
                border: '2px solid white', 
                borderRadius: '10px',
                width:'550px',
                height:'50px',
                backgroundColor:'white',
                marginTop:'20px',
                marginLeft:'25px',
                paddingLeft:'120px'
                }}>
               <ClockCircleOutlined style={{ fontSize: '20px', color: '#66BB6A ', marginRight: '8px' }} />
               <b>Run Time :</b>
               <span style={{ color: '#66BB6A ', fontSize: '25px', fontWeight: 'bold' }}> 366 minutes</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '10px',
                width:'550px',
                height:'50px',
                backgroundColor:'white',
                marginTop:'22px',
                marginLeft:'25px',
                paddingLeft:'120px'
                }}>
               <ClockCircleOutlined style={{ fontSize: '20px', color: '#FFA500', marginRight: '8px' }} />
               <b>Idle Time :</b>
               <span style={{ color: '#FFA500', fontSize: '25px', fontWeight: 'bold' }}> 145 minutes</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '10px',
                width:'550px',
                height:'50px',
                backgroundColor:'white',
                marginTop:'22px',
                marginLeft:'25px',
                paddingLeft:'120px'
                }}>
               <ClockCircleOutlined style={{ fontSize: '20px', color: '#FF6347', marginRight: '8px' }} />
               <b>Off Time :</b>
               <span style={{ color: '#FF6347', fontSize: '25px', fontWeight: 'bold' }}> 36 minutes</span>
            </div>
            </div>
        </div>
         <div style={{width:'1675px' , height:'260px' , border:'1px solid white' , marginLeft:'20px' , backgroundColor:'white' , borderRadius:'10px' , marginTop:'20px'}}>
             <MachineStateTimelineChart data={dummyData} />
          </div>
          <div>
            <h1>hii</h1>
          </div>
        </Content>
    </Layout>
    </>
   )
}