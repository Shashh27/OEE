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
import { ClockCircleOutlined, DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';


export default function Home() {
    const { machineId } = useParams();

    const socket = io('http://192.168.137.161:5000' ,{ query: { id: machineId } });


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
                                            <SyncOutlined className=" text-xl mr-2" />
                                            <span className="font-bold">Machine State:</span>
                                        </div>
                                        <div className={`text-2xl font-bold mt-1 ${ shiftData.MachineState === 'PRODUCTION' ? 'text-green-500' : shiftData.MachineState === 'IDLE' ? 'text-yellow-500' : shiftData.MachineState === 'OFF'  ? 'text-red-500'  : '' }`} >
                                        {shiftData.MachineState}
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
                                    width="95%" 
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