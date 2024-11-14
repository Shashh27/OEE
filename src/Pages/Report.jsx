import React, { useState } from 'react';
import Dashboard from "./Dashboard";

import { 
    DatePicker, 
    Button, 
    Table, 
    Card, 
    Space, 
    message 
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';

function ProductionReport() {
    // State declarations
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    // Add pagination state
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    });

    // Table columns configuration remains the same
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Production Time',
            dataIndex: 'productionTime',
            key: 'productionTime',
        },
        {
            title: 'Idle Time',
            dataIndex: 'idleTime',
            key: 'idleTime',
        },
        {
            title: 'Off Time',
            dataIndex: 'offTime',
            key: 'offTime',
        },
        {
            title: 'Good Parts',
            dataIndex: 'goodParts',
            key: 'goodParts',
            sorter: (a, b) => a.goodParts - b.goodParts,
        },
        {
            title: 'Bad Parts',
            dataIndex: 'badParts',
            key: 'badParts',
            sorter: (a, b) => a.badParts - b.badParts,
        },
        {
            title: 'Part Count',
            dataIndex: 'partCount',
            key: 'partCount',
            sorter: (a, b) => a.partCount - b.partCount,
        },
        {
            title: 'Availability (%)',
            dataIndex: 'availability',
            key: 'availability',
            render: (value) => value.toFixed(1),
            sorter: (a, b) => a.availability - b.availability,
        },
        {
            title: 'Performance (%)',
            dataIndex: 'performance',
            key: 'performance',
            render: (value) => value.toFixed(1),
            sorter: (a, b) => a.performance - b.performance,
        },
        {
            title: 'Quality (%)',
            dataIndex: 'quality',
            key: 'quality',
            render: (value) => value.toFixed(1),
            sorter: (a, b) => a.quality - b.quality,
        },
        {
            title: 'OEE (%)',
            dataIndex: 'oee',
            key: 'oee',
            render: (value) => value.toFixed(1),
            sorter: (a, b) => a.oee - b.oee,
        },
    ];

    // Handle date changes
    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    // Add pagination change handler
    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(prev => ({
            ...prev,
            ...newPagination,
        }));
    };

    // Simplified fetch report data function
 // Simplified fetch report data function
const fetchReportData = async () => {
    if (!startDate || !endDate) {
        message.warning('Please select both start and end dates');
        return;
    }

    if (endDate.isBefore(startDate)) {
        message.warning('End date cannot be before start date');
        return;
    }

    setLoading(true);
    try {
        const response = await axios.get('http://192.168.137.190:3000/analytics', {
            params: {
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            }
        });
        
        // Transform the single object into an array with one item
        const formattedData = [{
            date: startDate.format('YYYY-MM-DD'),
            productionTime: response.data.ProductionTime,
            idleTime: response.data.IdleTime,
            offTime: response.data.OffTime,
            goodParts: response.data.GoodPart,
            badParts: response.data.BadPart,
            partCount: response.data.PartCount,
            availability: parseFloat(response.data.Availability),
            performance: parseFloat(response.data.Performance),
            quality: parseFloat(response.data.Quality),
            oee: parseFloat(response.data.OEE),
            key: 0
        }];
        
        setReportData(formattedData);
        // Update pagination total
        setPagination(prev => ({
            ...prev,
            total: formattedData.length,
            current: 1, // Reset to first page when new data is loaded
        }));
        console.log('Response data:', response.data);
        console.log('Table data:', formattedData);
    } catch (err) {
        console.log(err);
        message.error('Failed to fetch data');
    } finally {
        setLoading(false);
    }
};

    // Handle Excel/CSV download
    const downloadExcel = () => {
        // Add UTF-8 BOM for Excel to properly detect encoding
        const BOM = "\uFEFF";
        
        // Define headers
        const headers = [
            'Date',
            'Production Time',
            'Idle Time',
            'Off Time',
            'Good Parts',
            'Bad Parts',
            'Part Count',
            'Availability (%)',
            'Performance (%)',
            'Quality (%)',
            'OEE (%)'
        ];

        // Create CSV content with proper formatting
        const csvContent = BOM + [
            headers.join(','),
            ...reportData.map(row => [
                `="${row.date}"`,
                row.productionTime,
                row.idleTime,
                row.offTime,
                row.goodParts,
                row.badParts,
                row.partCount,
                row.availability.toFixed(1),
                row.performance.toFixed(1),
                row.quality.toFixed(1),
                row.oee.toFixed(1)
            ].join(','))
        ].join('\n');

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'production_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
<>
         <Dashboard/>
         
        <Card title="Production Report" className='card bg-gray-200' style={{ margin: '24px' }} >
             
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Date Selection and Buttons */}
                <Space>
                    <DatePicker
                        placeholder="Start Date"
                        onChange={handleStartDateChange}
                        value={startDate}
                        disabledDate={(current) => endDate && current > endDate}
                        style={{ width: '150px' }}
                    />
                    <DatePicker
                        placeholder="End Date"
                        onChange={handleEndDateChange}
                        value={endDate}
                        disabledDate={(current) => startDate && current < startDate}
                        style={{ width: '150px' }}
                    />
                    <Button 
                        type="primary"
                        onClick={fetchReportData}
                        loading={loading}
                    >
                        Generate Report
                    </Button>
                    {reportData.length > 0 && (
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={downloadExcel}
                        >
                            Download Excel
                        </Button>
                    )}
                </Space>

                {/* Data Table */}
                <Table
                    columns={columns}
                    dataSource={reportData}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: 'max-content' }}
                />
            </Space>
        </Card>
        </>
    );
}

export default ProductionReport;