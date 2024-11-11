import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PieCharts = ({width , height , Run , Idle , Off}) => {
    const chartOptions = {
        chart: {
          type: 'pie',
        },
        title: {
          text: 'Machine Time Distribution',
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>',
        },
        accessibility: {
          point: {
            valueSuffix: '%',
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y} ',
            },
          },
        },
        series: [
          {
            name: 'Time',
            colorByPoint: true,
            data: [
              { name: 'Run Time', y: Run, color: '#66BB6A' },
              { name: 'Idle Time', y: Idle, color: '#FFA500' },
              { name: 'Off Time', y: Off, color: '#FF6347' },
            ],
          },
        ],
      };
    

  return(
    <div style={{width, height, border:'1px solid white' , borderRadius:'10px' , marginLeft:'20px'}}>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default PieCharts;