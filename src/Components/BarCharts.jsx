import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BarCharts = ({width , height , OEE , Availability , Performance , Quality }) => {

    const parseValue = (value) => {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      };

  const data = [
    { name: 'OEE', value: parseValue(OEE) },
    { name: 'Availability', value: parseValue(Availability) },
    { name: 'Performance', value: parseValue(Performance) },
    { name: 'Quality', value: parseValue(Quality) },
  ];

  const colors = ['#00b4d8', '#39bdaf', '#2f6fa1', '#fc8042'];

  const chartOptions = {
    chart: {
      type: 'column', // Changed to 'column' for vertical bars
    },
    title: {
      text: 'OEE Analytics',
    },
    xAxis: {
      categories: data.map((item) => item.name), // Categories set to the names of metrics
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Percentage (%)',
        align: 'high',
      },
      labels: {
        overflow: 'justify',
      },
    },
    tooltip: {
      valueSuffix: ' %',
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    legend: {
      enabled: false, // Disable legend for single series
    },
    series: [
      {
        name: 'Percentage',
        data: data.map((item, index) => ({
          y: item.value,
          color: colors[index],
        })),
      },
    ],
  };

  return (
    <div style={{width, height, border:'1px solid white' , borderRadius:'10px'}}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  ); 
};

export default BarCharts;