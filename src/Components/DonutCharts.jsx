import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DonutCharts = ({width , height , PartCount , GoodPart , BadPart}) => {
  const chartOptions = {
    chart: {
      type: 'pie',
      custom: {},
      events: {
    //     render() {
    //       const chart = this,
    //         series = chart.series[0];
    //       let customLabel = chart.options.chart.custom.label;

    //       // Create or update the custom label in the center
    //       if (!customLabel) {
    //         customLabel = chart.options.chart.custom.label =
    //           chart.renderer.label(
    //             'Total<br/>' +
    //             '<strong>50</strong>' // Total value, can be dynamically calculated
    //           )
    //             .css({
    //               color: '#000',
    //               textAnchor: 'middle'
    //             })
    //             .add();
    //       }

    //       // Position the custom label in the center of the pie chart
    //       const x = series.center[0] + chart.plotLeft,
    //         y = series.center[1] + chart.plotTop -
    //         (customLabel.attr('height') / 2);

    //       customLabel.attr({
    //         x,
    //         y
    //       });

    //       // Dynamically set font size based on chart size
    //       customLabel.css({
    //         fontSize: `${series.center[2] / 12}px`
    //       });
    //     }
       }
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    title: {
      text: 'Part Distribution'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        borderRadius: 8,
        dataLabels: [{
          enabled: true,
          distance: 20,
          format: '{point.name}: {point.y}' // Display the actual value, not percentage
        }, {
          enabled: true,
          distance: -15,
          format: '{point.y}',
          style: {
            fontSize: '0.9em'
          }
        }],
        showInLegend: true
      }
    },
    series: [{
      name: 'Parts',
      colorByPoint: true,
      innerSize: '75%', // Create donut shape
      data: [{
        name: 'Part count',
        y: PartCount,
        color: '#917072'  
      }, {
        name: 'Good part',
        y: GoodPart,
        color: '#66BB6A'  
      }, {
        name: 'Bad part',
        y: BadPart,
        color: '#FF6347' 
      }]
    }]
  };

  return (
    <div style={{width, height , border:'1px solid white' , borderRadius:'10px'}}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default DonutCharts;