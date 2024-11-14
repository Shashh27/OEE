// import { Button, Layout } from "antd";
// import Dashboard from "./Dashboard";
// const { Content } = Layout;
// import { DatePicker , Select } from "antd";
// import { ClockCircleOutlined , DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
// import React, { useEffect, useState , useRef} from 'react';
// import MachineStateTimelineChart from "../Components/MachineStateTimelineChart";
// import PieCharts from "../Components/PieCharts";
// import BarCharts from "../Components/BarCharts";
// import DonutCharts from "../Components/DonutCharts";
// import axios from "axios";

// // const socket = io('http://localhost:5000');


// export default function Shiftwise(){

//       const [data , setData] = useState('');
//       const [date , setDate] = useState('');
//       const [shift , setShift] = useState('');

//       const dummyData = [
//         { startTime: 1621209600, endTime: 1621213200, state: 'IDLE' },
//         { startTime: 1621213200, endTime: 1621216800, state: 'PRODUCTION' },
//         { startTime: 1621216800, endTime: 1621220400, state: 'IDLE' },
//         { startTime: 1621220400, endTime: 1621224000, state: 'OFF' },
//         { startTime: 1621224000, endTime: 1621227600, state: 'IDLE' },
//         { startTime: 1621227600, endTime: 1621231200, state: 'PRODUCTION' },
//         { startTime: 1621231200, endTime: 1621234800, state: 'IDLE' },
//         { startTime: 1621234800, endTime: 1621238400, state: 'OFF' }
//       ];

//      const fetchData = async()=>{
//             try {
//               const response = await axios.get('http://192.168.137.190:3000/shiftwise' , {
//                 params: {
//                   date: date.format('YYYY-MM-DD'),
//                   shift: shift
//                 }
//               });
//               setData(response.data);
//               console.log(response.data);
//               console.log(data);
//             } catch (error) {
//                  console.log(err);
//             }
//      }

//      useEffect(() => {
//       if (data) {
//         console.log("Updated Data:", data);
//       }
//     }, [data]);


//     return (
//       <>
//         <div className="fixed top-0 left-0 w-full z-50 bg-white">
//           <Dashboard />
//         </div>
  
//         <Layout className="mt-16">
//           <Content className="min-h-screen p-4">
//             <div className="max-w-[1800px] mx-auto">
//               {/* Header */}
//               <div className="w-full bg-white rounded-lg p-4 mb-4">
//                 <h1 className="text-2xl md:text-3xl text-center font-bold">Shiftwise Analytics</h1>
//               </div>
  
//               {/* Main Content Grid */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                 {/* Left Column */}
//                 <div className="lg:col-span-2 space-y-4">
//                   {/* Part Count Stats */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-white rounded-lg p-4 text-center">
//                       <DatabaseOutlined className="text-xl text-[#917072] mr-2" />
//                       <div className="font-bold">Part Count</div>
//                       <div className="text-2xl text-[#917072] font-bold">{data.PartCount || 0}</div>
//                     </div>
  
//                     <div className="bg-white rounded-lg p-4 text-center">
//                       <CheckCircleOutlined className="text-xl text-[#66BB6A] mr-2" />
//                       <div className="font-bold">Good Part</div>
//                       <div className="text-2xl text-[#66BB6A] font-bold">{data.GoodPart || 0}</div>
//                     </div>
  
//                     <div className="bg-white rounded-lg p-4 text-center">
//                       <CloseCircleOutlined className="text-xl text-[#FF6347] mr-2" />
//                       <div className="font-bold">Bad Part</div>
//                       <div className="text-2xl text-[#FF6347] font-bold">{data.BadPart || 0}</div>
//                     </div>
//                   </div>
  
//                   {/* Performance Metrics */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div className="bg-[#00b4d8] rounded-lg p-4 text-white text-center h-40">
//                       <div className="text-lg font-bold">OEE</div>
//                       <div className="text-4xl font-bold mt-4">{data.OEE || 0}%</div>
//                     </div>
  
//                     <div className="bg-[#39bdaf] rounded-lg p-4 text-white text-center">
//                       <div className="text-lg font-bold">Availability</div>
//                       <div className="text-4xl font-bold mt-4">{data.Availability || 0}%</div>
//                     </div>
  
//                     <div className="bg-[#2f6fa1] rounded-lg p-4 text-white text-center">
//                       <div className="text-lg font-bold">Performance</div>
//                       <div className="text-4xl font-bold mt-4">{data.Performance || 0}%</div>
//                     </div>
  
//                     <div className="bg-[#fc8042] rounded-lg p-4 text-white text-center">
//                       <div className="text-lg font-bold">Quality</div>
//                       <div className="text-4xl font-bold mt-4">{data.Quality || 0}%</div>
//                     </div>
//                   </div>
//                 </div>
  
//                 {/* Right Column */}
//                 <div className="space-y-4">
//                   {/* Date and Shift Selection */}
//                   <div className="bg-white rounded-lg p-4">
//                     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                       <DatePicker
//                         placeholder="Select Start date"
//                         onChange={(date) => setDate(date)}
//                         className="w-full sm:w-40"
//                       />
//                       <Select
//                         placeholder="Select Shift"
//                         onChange={(shift) => setShift(shift)}
//                         className="w-full sm:w-40"
//                       >
//                         <Option value="1">Shift 1</Option>
//                         <Option value="2">Shift 2</Option>
//                       </Select>
//                       <Button type="primary" onClick={fetchData}>
//                         Submit
//                       </Button>
//                     </div>
//                   </div>
  
//                   {/* Time Statistics */}
//                   <div className="space-y-4">
//                     <div className="bg-white rounded-lg p-4 text-center">
//                       <ClockCircleOutlined className="text-xl text-[#66BB6A]" />
//                       <div className="font-bold">Run Time</div>
//                       <div className="text-2xl text-[#66BB6A] font-bold">
//                         {data.ProductionTime || 0} minutes
//                       </div>
//                     </div>
  
//                     <div className="bg-white rounded-lg p-4 text-center">
//                       <ClockCircleOutlined className="text-xl text-[#FFA500]" />
//                       <div className="font-bold">Idle Time</div>
//                       <div className="text-2xl text-[#FFA500] font-bold">
//                         {data.IdleTime || 0} minutes
//                       </div>
//                     </div>
  
//                     <div className="bg-white rounded-lg p-4 text-center">
//                       <ClockCircleOutlined className="text-xl text-[#FF6347]" />
//                       <div className="font-bold">Off Time</div>
//                       <div className="text-2xl text-[#FF6347] font-bold">
//                         {data.OffTime || 0} minutes
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
  
//               {/* Timeline Chart */}
//               <div className="bg-white rounded-lg p-4 mt-4 overflow-x-auto">
//                 <MachineStateTimelineChart data={data.MachineState} />
//               </div>
  
//               {/* Bottom Charts */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//                 <div className="bg-white rounded-lg p-4">
//                   <PieCharts
//                     width="100%"
//                     height="210px"
//                     Run={data.ProductionTime || 0}
//                     Idle={data.IdleTime || 0}
//                     Off={data.OffTime || 0}
//                   />
//                 </div>
  
//                 <div className="bg-white rounded-lg p-4">
//                   <BarCharts
//                     width="100%"
//                     height="210px"
//                     OEE={data.OEE || 0}
//                     Availability={data.Availability || 0}
//                     Performance={data.Performance || 0}
//                     Quality={data.Quality || 0}
//                   />
//                 </div>
  
//                 <div className="bg-white rounded-lg p-4">
//                   <DonutCharts
//                     width="100%"
//                     height="210px"
//                     PartCount={data.PartCount || 0}
//                     GoodPart={data.GoodPart || 0}
//                     BadPart={data.BadPart || 0}
//                   />
//                 </div>
//               </div>
//             </div>
//           </Content>
//         </Layout>
//       </>
//     );
//   }

import React, { useEffect, useState } from 'react';
import { Button, Layout, DatePicker, Select } from "antd";
import { ClockCircleOutlined, DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Dashboard from "./Dashboard";
import MachineStateTimelineChart from "../Components/MachineStateTimelineChart";
import PieCharts from "../Components/PieCharts";
import BarCharts from "../Components/BarCharts";
import DonutCharts from "../Components/DonutCharts";
const { Content } = Layout;
const { Option } = Select;
import axios from 'axios';

export default function Shiftwise() {
  const [data, setData] = useState('');
  const [date, setDate] = useState('');
  const [shift, setShift] = useState('');

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

  const fetchData = async () => {
    try {
      
        const response = await axios.get('http://192.168.137.190:3000/shiftwise' , {
        params: {
          date: date.format('YYYY-MM-DD'),
          shift: shift
        }
      });
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <Dashboard />
      </div>

      <Layout className="mt-16">
        <Content className="min-h-screen">
          <div className="p-4 md:p-6">
            {/* Title Section */}
            <div className="bg-white rounded-lg p-4 mb-6 w-full">
              <h1 className="text-2xl md:text-3xl text-center font-bold">Shiftwise Analytics</h1>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Left Section - 3 columns */}
              <div className="lg:col-span-3 space-y-4 ">
                {/* Part Count Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center h-28 ">
                    <DatabaseOutlined className="text-xl text-[#917072] mr-2" />
                    <div>
                      <span className="font-bold">Part Count:</span>
                      <span className="text-[#917072] text-xl md:text-2xl font-bold ml-2">
                        {data.PartCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 flex items-center justify-center h-28">
                    <CheckCircleOutlined className="text-xl text-[#66BB6A] mr-2" />
                    <div>
                      <span className="font-bold">Good Part:</span>
                      <span className="text-[#66BB6A] text-xl md:text-2xl font-bold ml-2">
                        {data.GoodPart || 0}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 flex items-center justify-center h-28 ">
                    <CloseCircleOutlined className="text-xl text-[#FF6347] mr-2" />
                    <div>
                      <span className="font-bold">Bad Part:</span>
                      <span className="text-[#FF6347] text-xl md:text-2xl font-bold ml-2">
                        {data.BadPart || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* OEE Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
  <div className="bg-[#00b4d8] rounded-lg p-3 text-white h-48">
    <h2 className="text-lg font-bold">OEE</h2>
    <p className="text-4xl font-bold mt-4">{data.OEE || 0}%</p>
  </div>

  <div className="bg-[#39bdaf] rounded-lg p-4 text-white h-48">
    <h2 className="text-lg font-bold">Availability</h2>
    <p className="text-4xl font-bold mt-4">{data.Availability || 0}%</p>
  </div>

  <div className="bg-[#2f6fa1] rounded-lg p-4 text-white h-48">
    <h2 className="text-lg font-bold">Performance</h2>
    <p className="text-4xl font-bold mt-4">{data.Performance || 0}%</p>
  </div>

  <div className="bg-[#fc8042] rounded-lg p-4 text-white h-48">
    <h2 className="text-lg font-bold">Quality</h2>
    <p className="text-4xl font-bold mt-4">{data.Quality || 0}%</p>
  </div>
</div>
</div>

              {/* Right Section - 1 column */}
              <div className="lg:col-span-1 space-y-4">
  {/* Controls */}
  <div className="bg-white rounded-lg p-2 flex flex-col gap-2 ">
    <div className="grid grid-cols-2 gap-4">
      <DatePicker
        placeholder="Select Start date"
        onChange={(date) => setDate(date)}
        className="w-full"
      />
      <Select
        placeholder="Select Shift"
        onChange={(shift) => setShift(shift)}
        className="w-full"
      >
        <Option value="1">Shift 1</Option>
        <Option value="2">Shift 2</Option>
      </Select>
    </div>
    <Button type="primary" onClick={fetchData} className="w-full">
      Submit
    </Button>
  </div>


                {/* Time Statistics */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center">
                      <ClockCircleOutlined className="text-[#66BB6A] text-xl mr-2" />
                      <div>
                        <span className="font-bold">Run Time:</span>
                        <span className="text-[#66BB6A] text-xl font-bold ml-2">
                          {data.ProductionTime || 0} minutes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center">
                      <ClockCircleOutlined className="text-[#FFA500] text-xl mr-2" />
                      <div>
                        <span className="font-bold">Idle Time:</span>
                        <span className="text-[#FFA500] text-xl font-bold ml-2">
                          {data.IdleTime || 0} minutes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center">
                      <ClockCircleOutlined className="text-[#FF6347] text-xl mr-2" />
                      <div>
                        <span className="font-bold">Off Time:</span>
                        <span className="text-[#FF6347] text-xl font-bold ml-2">
                          {data.OffTime || 0} minutes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Chart */}
            <div className="bg-white rounded-lg p-4 mt-6 w-full">
              <div className="w-full h-48 md:h-64">
                <MachineStateTimelineChart data={data.MachineState} />
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4">
                <PieCharts
                  width="100%"
                  height="210px"
                  Run={data.ProductionTime || 0}
                  Idle={data.IdleTime || 0}
                  Off={data.OffTime || 0}
                />
              </div>
              <div className="bg-white rounded-lg p-4">
                <BarCharts
                  width="100%"
                  height="400px"
                  OEE={data.OEE || 0}
                  Availability={data.Availability || 0}
                  Performance={data.Performance || 0}
                  Quality={data.Quality || 0}
                />
              </div>
              <div className="bg-white rounded-lg p-4">
                <DonutCharts
                  width="100%"
                  height="210px"
                  PartCount={data.PartCount || 0}
                  GoodPart={data.GoodPart || 0}
                  BadPart={data.BadPart || 0}
                />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </>
  );
}