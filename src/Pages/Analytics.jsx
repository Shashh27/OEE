import { Layout } from "antd";
import Dashboard from "./Dashboard";
const { Content } = Layout;
import { ClockCircleOutlined , DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { DatePicker , Button } from "antd";
import PieCharts from "../Components/PieCharts";
import BarCharts from "../Components/BarCharts";
import DonutCharts from "../Components/DonutCharts";
import { useState , useEffect } from "react";
import axios from 'axios';



export default function Analytics(){

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [data, setData] = useState('');


        const fetchData = async () => {
          try {
            const response = await axios.get('http://192.168.137.190:3000/analytics', {
              params: {
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
              }
            });
            setData(response.data);
            console.log(response.data);
            console.log("Data:",data);
          } catch (err) {
              console.log(err);
        } 
        };

        useEffect(() => {
            if (data) {
              console.log("Updated Data:", data);
            }
          }, [data]);
    
        
    return(
    <>
    <Dashboard/>
         <Layout>
         <Content style={{ minHeight: '92vh' }}>           
                 <div style={{marginLeft:'20px'}}>
                <div className="flex grid-cols-2">
            <div>
                <div style={{width:'1100px' , height:'50px' , border:'1px solid white' , marginTop:'10px' , marginLeft:'50px' , borderRadius:'10px' , backgroundColor:'white'}}>
                    <h1 style={{paddingLeft:'480px' , paddingTop:'5px' , fontSize:'27px'}}>Analytics</h1>
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
               <span style={{ color: '#917072 ', fontSize: '25px', fontWeight: 'bold' }}> {data.PartCount ? data.PartCount : 0} </span>      
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
              <h4 className="font-bold text-5xl text-white mt-7">{data.OEE ? data.OEE : 0}%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[264px] h-[208px] bg-[#39bdaf] ml-3 flex flex-col items-center ">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Availability</h1>
               <h4 className="font-bold text-5xl text-white mt-7">{data.Availability ? data.Availability : 0}%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[264px] h-[208px] bg-[#2f6fa1] ml-3 flex flex-col items-center">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Performance</h1>
               <h4 className="font-bold text-5xl mt-7 text-white ">{data.Performance ? data.Performance : 0}%</h4>
           </div>

           <div className="border-2 border-white rounded-lg w-[270px] h-[208px] bg-[#fc8042] ml-3 flex flex-col items-center">
               <h1 className="font-bold self-start text-lg ml-4 mt-3 text-white">Quality</h1>   
               <h4 className="font-bold text-5xl mt-7 text-white ">{data.Quality ? data.Quality : 0}%</h4>
           </div>   
            </div>               
            </div>
            <div>
            <div style={{width:'460px' , height:'70px' , border:'1px solid white' , backgroundColor:'white', marginLeft:'25px' , marginTop:'10px' , borderRadius:'10px'}}>
                 <DatePicker placeholder="Select Start date " onChange={(date) => setStartDate(date)} style={{marginLeft:'20px' , marginTop:'15px' , width:'160px'}} />
                 <DatePicker placeholder="Select End date "   onChange={(date) => setEndDate(date)} style={{marginLeft:'10px' , marginTop:'15px' , width:'160px'}} />
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
              <div className="flex">
                 <div style={{marginLeft:'30px' , marginTop:'20px'}}>
                      <PieCharts width='500px' height='210px' Run={data.ProductionTime ? data.ProductionTime : 0} Idle={data.IdleTime ? data.IdleTime : 0} Off={data.OffTime ? data.OffTime : 0} />
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