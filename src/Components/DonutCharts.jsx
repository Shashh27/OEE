// import React, { useEffect } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';

// const DonutCharts = ({width , height , PartCount , GoodPart , BadPart}) => {
//   const chartOptions = {
//     chart: {
//       type: 'pie',
//       custom: {},
//       events: {
//     //     render() {
//     //       const chart = this,
//     //         series = chart.series[0];
//     //       let customLabel = chart.options.chart.custom.label;

//     //       // Create or update the custom label in the center
//     //       if (!customLabel) {
//     //         customLabel = chart.options.chart.custom.label =
//     //           chart.renderer.label(
//     //             'Total<br/>' +
//     //             '<strong>50</strong>' // Total value, can be dynamically calculated
//     //           )
//     //             .css({
//     //               color: '#000',
//     //               textAnchor: 'middle'
//     //             })
//     //             .add();
//     //       }

//     //       // Position the custom label in the center of the pie chart
//     //       const x = series.center[0] + chart.plotLeft,
//     //         y = series.center[1] + chart.plotTop -
//     //         (customLabel.attr('height') / 2);

//     //       customLabel.attr({
//     //         x,
//     //         y
//     //       });

//     //       // Dynamically set font size based on chart size
//     //       customLabel.css({
//     //         fontSize: `${series.center[2] / 12}px`
//     //       });
//     //     }
//        }
//     },
//     accessibility: {
//       point: {
//         valueSuffix: '%'
//       }
//     },
//     title: {
//       text: 'Part Distribution'
//     },
//     tooltip: {
//       pointFormat: '{series.name}: <b>{point.y}</b>'
//     },
//     legend: {
//       enabled: false
//     },
//     plotOptions: {
//       series: {
//         allowPointSelect: true,
//         cursor: 'pointer',
//         borderRadius: 8,
//         dataLabels: [{
//           enabled: true,
//           distance: 20,
//           format: '{point.name}: {point.y}' // Display the actual value, not percentage
//         }, {
//           enabled: true,
//           distance: -15,
//           format: '{point.y}',
//           style: {
//             fontSize: '0.9em'
//           }
//         }],
//         showInLegend: true
//       }
//     },
//     series: [{
//       name: 'Parts',
//       colorByPoint: true,
//       innerSize: '75%', // Create donut shape
//       data: [{
//         name: 'Part count',
//         y: PartCount,
//         color: '#917072'  
//       }, {
//         name: 'Good part',
//         y: GoodPart,
//         color: '#66BB6A'  
//       }, {
//         name: 'Bad part',
//         y: BadPart,
//         color: '#FF6347' 
//       }]
//     }]
//   };

//   return (
//     <div style={{width, height , border:'1px solid white' , borderRadius:'10px'}}>
//       <HighchartsReact highcharts={Highcharts} options={chartOptions} />
//     </div>
//   );
// };

// export default DonutCharts;

import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DonutCharts = ({width, height, PartCount, GoodPart, BadPart}) => {
  const [chartDimensions, setChartDimensions] = useState({
    width: width || '100%',
    height: height || '400px'
  });

  // Function to update dimensions based on screen size
  const updateDimensions = () => {
    const screenWidth = window.innerWidth;
    let newWidth, newHeight;

    if (screenWidth < 480) { // Mobile
      newWidth = '100%';
      newHeight = '300px';
    } else if (screenWidth < 768) { // Tablet
      newWidth = '100%';
      newHeight = '350px';
    } else if (screenWidth < 1024) { // Small Desktop
      newWidth = '100%';
      newHeight = '400px';
    } else { // Large Desktop
      newWidth = width || '100%';
      height = height || '400px';
    }

    setChartDimensions({ width: newWidth, height: newHeight });
  };

  // Add window resize listener
  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Responsive font sizes based on screen width
  const getFontSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) return '0.7em';
    if (screenWidth < 768) return '0.8em';
    return '0.9em';
  };

  const chartOptions = {
    chart: {
      type: 'pie',
      custom: {},
      events: {},
      reflow: true, // Enable automatic reflow on container resize
      spacing: [10, 10, 10, 10], // Responsive padding
      style: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    title: {
      text: 'Part Distribution',
      style: {
        fontSize: getFontSize()
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>',
      style: {
        fontSize: getFontSize()
      }
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
          distance: window.innerWidth < 480 ? 15 : 20, // Adjust distance for mobile
          format: '{point.name}: {point.y}',
          style: {
            fontSize: getFontSize(),
            textOutline: 'none',
            fontWeight: 'normal'
          }
        }, {
          enabled: true,
          distance: window.innerWidth < 480 ? -10 : -15, // Adjust distance for mobile
          format: '{point.y}',
          style: {
            fontSize: getFontSize(),
            textOutline: 'none'
          }
        }],
        showInLegend: true
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 480
        },
        chartOptions: {
          plotOptions: {
            series: {
              innerSize: '65%', // Slightly smaller donut hole on mobile
              dataLabels: [{
                distance: 15
              }, {
                distance: -10
              }]
            }
          }
        }
      }]
    },
    series: [{
      name: 'Parts',
      colorByPoint: true,
      innerSize: '75%',
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

  // Container styles with responsive borders
  const containerStyle = {
    width: chartDimensions.width,
    height: chartDimensions.height,

    borderRadius: '10px',
   
  
    maxWidth: '100%', // Prevent overflow
  
  };

  return (
    <div style={containerStyle}>
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions}
        containerProps={{ style: { height: '100%', width: '100%' } }}
      />
    </div>
  );
};

export default DonutCharts;