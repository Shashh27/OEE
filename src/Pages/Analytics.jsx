import { Layout } from "antd";
import Dashboard from "./Dashboard";
const { Content } = Layout;
import { ClockCircleOutlined, DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { DatePicker, Button } from "antd";
import PieCharts from "../Components/PieCharts";
import BarCharts from "../Components/BarCharts";
import DonutCharts from "../Components/DonutCharts";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";


export default function Analytics() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [data, setData] = useState('');
    const {machineId} = useParams();

    const fetchData = async () => {
        try {
            const response = await axios.get('http://192.168.137.161:3000/analytics', {
                params: {
                    id: machineId,
                    startDate: startDate.format('YYYY-MM-DD'),
                    endDate: endDate.format('YYYY-MM-DD')
                }
            });
            setData(response.data);
            console.log(response.data);
            console.log("Data:", data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (data) {
            console.log("Updated Data:", data);
        }
    }, [data]);

    return (
        <>
            <Dashboard />
            <Layout>
                <Content className="min-h-[92vh] p-4 mt-2">
                    <div className="max-w-full mx-auto">
                        {/* Header */}
                        <div className="w-full bg-white rounded-lg p-4 mb-4">
                            <h1 className="text-2xl md:text-3xl text-center font-bold">Analytics</h1>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left Column */}
                            <div className="lg:col-span-2">
                                {/* Part Statistics */}
                              {/* Part Statistics */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <div className="bg-white rounded-lg p-6 min-h-[140px] flex items-center justify-center">
        <div className="flex items-center justify-center">
            <div className="text-center">
                <div className="font-bold text-lg mb-2"><DatabaseOutlined className="text-2xl text-[#917072] mr-3" />Part Count</div>
                <div className="text-2xl text-[#917072] font-bold">
                    {data.PartCount ? data.PartCount : 0}
                </div>
            </div>
        </div>
    </div>

    <div className="bg-white rounded-lg p-6 min-h-[140px] flex items-center justify-center">
        <div className="flex items-center justify-center">
            <div className="text-center">
                <div className="font-bold text-lg mb-2"> <CheckCircleOutlined className="text-2xl text-[#66BB6A] mr-3" /> Good Part</div>
                <div className="text-2xl text-[#66BB6A] font-bold">
                    {data.GoodPart ? data.GoodPart : 0}
                </div>
            </div>
        </div>
    </div>

    <div className="bg-white rounded-lg p-6 min-h-[140px] flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="text-center">
                <div className="font-bold text-lg mb-2"><CloseCircleOutlined className="text-2xl text-[#FF6347] mr-3" />
                Bad Part</div>
                <div className="text-2xl text-[#FF6347] font-bold">
                    {data.BadPart ? data.BadPart : 0}
                </div>
            </div>
        </div>
                               </div>
                                </div>

                              {/* Performance Metrics */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
    <div className="bg-[#00b4d8] rounded-lg p-6 text-white min-h-[200px] flex flex-col justify-between">
        <h2 className="text-lg font-bold">OEE</h2>
        <div className="text-4xl font-bold text-center mb-12">
            {data.OEE ? data.OEE : 0}%
        </div>
    </div>

    <div className="bg-[#39bdaf] rounded-lg p-6 text-white min-h-[200px] flex flex-col justify-between">
        <h2 className="text-lg font-bold">Availability</h2>
        <div className="text-4xl font-bold text-center mb-12 ">
            {data.Availability ? data.Availability : 0}%
        </div>
    </div>

    <div className="bg-[#2f6fa1] rounded-lg p-6 text-white min-h-[200px] flex flex-col justify-between">
        <h2 className="text-lg font-bold">Performance</h2>
        <div className="text-4xl font-bold text-center mb-12">
            {data.Performance ? data.Performance : 0}%
        </div>
    </div>

    <div className="bg-[#fc8042] rounded-lg p-6 text-white min-h-[200px] flex flex-col justify-between">
        <h2 className="text-lg font-bold">Quality</h2>
        <div className="text-4xl font-bold text-center mb-12">
            {data.Quality ? data.Quality : 0}%
        </div>
    </div>
</div>
</div>

                            {/* Right Column */}
                            <div className="lg:col-span-1">
                                {/* Date Picker Section */}
                                <div className="bg-white rounded-lg p-4 mb-4">
                                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                        <DatePicker
                                            placeholder="Select Start date"
                                            onChange={(date) => setStartDate(date)}
                                            className="w-full sm:w-40"
                                        />
                                        <DatePicker
                                            placeholder="Select End date"
                                            onChange={(date) => setEndDate(date)}
                                            className="w-full sm:w-40"
                                        />
                                        <Button type="primary" onClick={fetchData} className="w-full sm:w-auto">
                                            Submit
                                        </Button>
                                    </div>
                                </div>

                                {/* Time Statistics */}
                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="flex items-center justify-center">
                                            <div>
                                                <div className="font-bold"><ClockCircleOutlined className="text-xl text-[#66BB6A] mr-2" />
                                                Run Time</div>
                                                <div className="text-xl text-[#66BB6A] font-bold">
                                                    {data.ProductionTime ? data.ProductionTime : 0} minutes
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-4">
                                        <div className="flex items-center justify-center">
                                            <div>
                                                <div className="font-bold"><ClockCircleOutlined className="text-xl text-[#FFA500] mr-2" />
                                                Idle Time</div>
                                                <div className="text-xl text-[#FFA500] font-bold">
                                                    {data.IdleTime ? data.IdleTime : 0} minutes
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-4">
                                        <div className="flex items-center justify-center">
                                            <div>
                                                <div className="font-bold"><ClockCircleOutlined className="text-xl text-[#FF6347] mr-2" />
                                                Off Time</div>
                                                <div className="text-xl text-[#FF6347] font-bold">
                                                    {data.OffTime ? data.OffTime : 0} minutes
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                            <div className="w-full">
                                <PieCharts
                                    width="95%"
                                    height="210px"
                                    Run={data.ProductionTime ? data.ProductionTime : 0}
                                    Idle={data.IdleTime ? data.IdleTime : 0}
                                    Off={data.OffTime ? data.OffTime : 0}
                                />
                            </div>
                            <div className="w-full">
                                <BarCharts
                                    width="100%"
                                    height="400px"
                                    OEE={data.OEE ? data.OEE : 0}
                                    Availability={data.Availability ? data.Availability : 0}
                                    Performance={data.Performance ? data.Performance : 0}
                                    Quality={data.Quality ? data.Quality : 0}
                                />
                            </div>
                            <div className="w-full">
                                <DonutCharts
                                    width="100%"
                                    height="210px"
                                    PartCount={data.PartCount ? data.PartCount : 0}
                                    GoodPart={data.GoodPart ? data.GoodPart : 0}
                                    BadPart={data.BadPart ? data.BadPart : 0}
                                />
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
        </>
    );
}