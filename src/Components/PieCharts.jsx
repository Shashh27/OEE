// import React from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';

// const PieCharts = ({width , height , Run , Idle , Off}) => {
//     const chartOptions = {
//         chart: {
//           type: 'pie',
//         },
//         title: {
//           text: 'Machine Time Distribution',
//         },
//         tooltip: {
//           pointFormat: '{series.name}: <b>{point.y}</b>',
//         },
//         accessibility: {
//           point: {
//             valueSuffix: '%',
//           },
//         },
//         plotOptions: {
//           pie: {
//             allowPointSelect: true,
//             cursor: 'pointer',
//             dataLabels: {
//               enabled: true,
//               format: '<b>{point.name}</b>: {point.y} ',
//             },
//           },
//         },
//         series: [
//           {
//             name: 'Time',
//             colorByPoint: true,
//             data: [
//               { name: 'Run Time', y: Run, color: '#66BB6A' },
//               { name: 'Idle Time', y: Idle, color: '#FFA500' },
//               { name: 'Off Time', y: Off, color: '#FF6347' },
//             ],
//           },
//         ],
//       };
    

//   return(
//     <div style={{width, height, border:'1px solid white' , borderRadius:'10px' , marginLeft:'20px'}}>
//           <HighchartsReact highcharts={Highcharts} options={chartOptions} />
//     </div>
//   );
// };

// export default PieCharts;


import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PieCharts = ({width, height, Run, Idle, Off}) => {
    const [chartWidth, setChartWidth] = useState(width);
    const [chartHeight, setChartHeight] = useState(height);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            
            // Large screens (>1200px)
            if (screenWidth > 1200) {
                setChartWidth('500px');  // Fixed width for large screens
                setChartHeight('400px');
            }
            // Medium screens (992px - 1200px)
            else if (screenWidth <= 1200 && screenWidth > 992) {
                setChartWidth('300px');
                setChartHeight('300px');
            }

            // Tablets (768px - 992px)
            else if (screenWidth <= 992 && screenWidth > 768) {
                setChartWidth('300px');
                setChartHeight('250px');
            }
            // Mobile screens (<768px)
            else {
                setChartWidth('90%');
                setChartHeight('260px');
            }
        };

        // Initial call
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const chartOptions = {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            spacing: [10, 0, 10, 0]
        },
        title: {
            text: 'Machine Time Distribution',
            style: {
                fontSize: '14px',
                fontWeight: 'bold'
            },
            margin: 15
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y}',
                    style: {
                        fontSize: '12px'
                    },
                    distance: 15
                },
                size: '85%',
                center: ['50%', '50%']
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Time',
            colorByPoint: true,
            data: [
                { name: 'Run Time', y: Run, color: '#66BB6A' },
                { name: 'Idle Time', y: Idle, color: '#FFA500' },
                { name: 'Off Time', y: Off, color: '#FF6347' }
            ]
        }]
    };

    return (
        <div style={{
            width: chartWidth,
            height: chartHeight,
            border: '1px solid white',
            borderRadius: '10px',
            padding: '5px',
            boxSizing: 'border-box',
            display: 'inline-block',  // Changed to inline-block
            verticalAlign: 'top',     // Added for alignment
            margin: '10px',           // Added consistent margin
            backgroundColor: 'white',   
            marginLeft:'25'// Added for consistent background
        }}>
            <HighchartsReact 
                highcharts={Highcharts} 
                options={chartOptions}
                containerProps={{ 
                    style: { 
                        width: '100%', 
                        height: '100%'
                    } 
                }}
            />
        </div>
    );
};

export default PieCharts;