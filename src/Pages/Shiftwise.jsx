import { Button, Layout } from "antd";
import Dashboard from "./Dashboard";
const { Content } = Layout;
import { DatePicker , Select } from "antd";
import { ClockCircleOutlined , DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState , useRef} from 'react';
import MachineStateTimelineChart from "../Components/MachineStateTimelineChart";
import PieCharts from "../Components/PieCharts";
import BarCharts from "../Components/BarCharts";
import DonutCharts from "../Components/DonutCharts";
import axios from "axios";

// const socket = io('http://localhost:5000');


export default function Shiftwise(){

      const [data , setData] = useState('');
      const [date , setDate] = useState('');
      const [shift , setShift] = useState('');

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

     const fetchData = async()=>{
            try {
              const response = await axios.get('http://192.168.137.190:3000/shiftwise' , {
                params: {
                  date: date.format('YYYY-MM-DD'),
                  shift: shift
                }
              });
              setData(response.data);
              console.log(response.data);
              console.log(data);
            } catch (error) {
                 console.log(err);
            }
     }

     useEffect(() => {
      if (data) {
        console.log("Updated Data:", data);
      }
    }, [data]);


    return(
    <>
        <div className="fixed top-0 left-0 w-full z-50 bg-white">
           <Dashboard />
        </div>   
        <Layout className="mt-16">
        <Content style={{ minHeight: '120vh' }}>
          <div style={{marginLeft:'20px'}}>
          <div className="flex grid-cols-2">
            <div>
                <div style={{width:'1100px' , height:'50px' , border:'1px solid white' , marginTop:'10px' , marginLeft:'50px' , borderRadius:'10px' , backgroundColor:'white'}}>
                    <h1 style={{paddingLeft:'430px' , paddingTop:'5px' , fontSize:'27px'}}>Shiftwise Analytics</h1>
                </div> 
            <div className="flex grid-cols-3 ml-3">
                <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'350px',
                height:'60px',
                backgroundColor:'white',
                paddingLeft:'90px',
                paddingTop:'10px',
                marginTop:'10px',
                marginLeft:'40px'
                }}>
                     <DatabaseOutlined style={{ fontSize: '20px', color: '#917072 ', marginRight: '8px' }} />
               <b>Part Count :</b>
               <span style={{ color: '#917072 ', fontSize: '25px', fontWeight: 'bold' }}> {data.PartCount ? data.PartCount : 0}</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'350px',
                height:'60px',
                backgroundColor:'white',
                paddingLeft:'90px',
                paddingTop:'10px',
                marginTop:'10px',
                marginLeft:'20px'
                }}>
                
                <CheckCircleOutlined style={{ fontSize: '20px', color: '#66BB6A', marginRight: '8px' }} />
               <b>Good part :</b>
               <span style={{ color: '#66BB6A', fontSize: '25px', fontWeight: 'bold' }}> {data.GoodPart ? data.GoodPart : 0}</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'356px',
                height:'60px',
                backgroundColor:'white',
                paddingLeft:'90px',
                paddingTop:'10px',
                marginTop:'10px',
                marginLeft:'18px'
                }}>
              
              <CloseCircleOutlined style={{ fontSize: '20px', color: '#FF6347', marginRight: '8px' }} />
               <b>Bad part :</b>
               <span style={{ color: '#FF6347', fontSize: '25px', fontWeight: 'bold' }}> {data.BadPart ? data.BadPart : 0} </span>
            </div>
                </div>

            <div className="flex grid-cols-4 mt-3 ml-9">
            <div className="border-2 border-white rounded-lg w-[264px] h-[208px] bg-[#00b4d8] ml-3 flex flex-col items-center">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">OEE</h1>
               <h4 className="font-bold text-5xl mt-7 text-white ">{data.OEE ? data.OEE : 0}%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[264px] h-[208px] bg-[#39bdaf] ml-3 flex flex-col items-center">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Availability</h1>
               <h4 className="font-bold text-5xl mt-7 text-white ">{data.Availability ? data.Availability : 0}%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[264px] h-[208px] bg-[#2f6fa1] ml-3 flex flex-col items-center ">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Performance</h1>
               <h4 className="font-bold text-5xl mt-7 text-white ">{data.Performance ? data.Performance : 0}%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[270px] h-[208px] bg-[#fc8042] ml-3 flex flex-col items-center ">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Quality</h1>   
               <h4 className="font-bold text-5xl mt-7 text-white ">{data.Quality ? data.Quality : 0}%</h4>
           </div>   
            </div>               
            </div>
            <div>
            <div style={{width:'460px' , height:'70px' , border:'1px solid white' , backgroundColor:'white', marginLeft:'25px' , marginTop:'10px' , borderRadius:'10px'}}>
                 <DatePicker placeholder="Select Start date " onChange={(date)=> setDate(date)} style={{marginLeft:'20px' , marginTop:'15px' , width:'160px'}} />
                 <Select placeholder="Select Shift" style={{marginLeft:'20px' , marginTop:'17px' , width:'140px'}} onChange={(shift)=> setShift(shift)} >
                        <Option value="1">Shift 1</Option>
                        <Option value="2">Shift 2</Option>
                    </Select>                  
                 <Button type="primary" onClick={fetchData} style={{marginLeft:'20px' , marginTop:'15px'}}> Submit</Button>
            </div>
            <div >
            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'460px',
                height:'77px',
                backgroundColor:'white',
                paddingLeft:'120px',
                paddingTop:'20px',
                marginTop:'10px',
                marginLeft:'25px'
                }}>
              <ClockCircleOutlined style={{ fontSize: '20px', color: '#66BB6A ', marginRight: '8px' }} />
               <b>Run Time :</b>
               <span style={{ color: '#66BB6A ', fontSize: '25px', fontWeight: 'bold' }}> {data.ProductionTime ? data.ProductionTime : 0 } minutes</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'460px',
                height:'77px',
                backgroundColor:'white',
                paddingLeft:'120px',
                paddingTop:'20px',
                marginTop:'10px',
                marginLeft:'25px'
                }}>
              <ClockCircleOutlined style={{ fontSize: '20px', color: '#FFA500', marginRight: '8px' }} />
               <b>Idle Time :</b>
               <span style={{ color: '#FFA500', fontSize: '25px', fontWeight: 'bold' }}> {data.IdleTime ? data.IdleTime : 0} minutes</span>
            </div>

            <div style={{ 
                border: '2px solid white', 
                borderRadius: '8px',
                width:'460px',
                height:'80px',
                backgroundColor:'white',
                paddingLeft:'120px',
                paddingTop:'20px',
                marginTop:'10px',
                marginLeft:'25px'
                }}>
              <ClockCircleOutlined style={{ fontSize: '20px', color: '#FF6347', marginRight: '8px' }} />
               <b>Off Time :</b>
               <span style={{ color: '#FF6347', fontSize: '25px', fontWeight: 'bold' }}> {data.OffTime ? data.OffTime : 0} minutes</span>
            </div>
            </div>
            </div>
            </div>
         <div style={{width:'1585px' , height:'200px' , border:'1px solid white' , marginLeft:'50px' , backgroundColor:'white' , borderRadius:'10px' , marginTop:'20px' , overflowX: 'auto', whiteSpace: 'nowrap'}}>
             <MachineStateTimelineChart data={data.MachineState} />
          </div>
          <div className="flex">
                   <div style={{marginLeft:'30px' , marginTop:'20px'}}>
                      <PieCharts width='500px' height='210px' Run={data.ProductionTime ? data.ProductionTime : 0} Idle={data.IdleTime ? data.IdleTime : 0} Off={data.OffTime ? data.OffTime : 0}/>
                   </div>
                   <div style={{marginTop:'20px', marginLeft:'20px'}}>
                       <BarCharts width='547px' height='210px' OEE={data.OEE ? data.OEE : 0} Availability={data.Availability ? data.Availability : 0} Performance={data.Performance ? data.Performance : 0} Quality={data.Quality ? data.Quality : 0} />
                   </div>
                   <div style={{marginTop:'20px', marginLeft:'20px'}}>
                       <DonutCharts width='500px' height='210px' PartCount={data.PartCount ? data.PartCount : 0} GoodPart={data.GoodPart ? data.GoodPart : 0} BadPart={data.BadPart ? data.BadPart : 0} />
                   </div>
               </div>
        
         </div>
        </Content>
    </Layout>
    </>
   )
}