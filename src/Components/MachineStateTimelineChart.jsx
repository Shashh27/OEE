// // import React from 'react';
// // import Highcharts from 'highcharts';
// // import highchartsMore from 'highcharts/highcharts-more';
// // import xrange from 'highcharts/modules/xrange';

// // highchartsMore(Highcharts);
// // xrange(Highcharts);

// // const MachineStateTimelineChart = ({ data }) => {
// //   const chartContainer = React.useRef(null);

// //   const parseTimeToMs = (timeStr) => {
// //     if (!timeStr) return null;
// //     const [hours, minutes, seconds] = timeStr.split(':').map(Number);
// //     return (hours * 3600 + minutes * 60 + seconds) * 1000; // Convert to milliseconds
// //   };

// //   const getStateColor = (state) => {
// //     switch (state) {
// //       case 'OFF':
// //         return '#FF6347';
// //       case 'PRODUCTION':
// //         return '#66BB6A';
// //       case 'IDLE':
// //         return '#FFA500';
// //       default:
// //         return '#C0C0C0';
// //     }
// //   };

// //   React.useEffect(() => {
// //     if (!chartContainer.current || !data || !Array.isArray(data)) {
// //       return;
// //     }

// //     const seriesData = data.map(item => {
// //       const startTime = parseTimeToMs(item.startTime);
// //       const endTime = parseTimeToMs(item.endTime);
      
// //       if (startTime === null || endTime === null) {
// //         console.warn('Invalid time format in data:', item);
// //         return null;
// //       }

// //       return {
// //         x: startTime,
// //         x2: endTime,
// //         y: 0,
// //         color: getStateColor(item.state),
// //         name: item.state
// //       };
// //     }).filter(Boolean); // Remove any null entries

// //     if (seriesData.length === 0) {
// //       console.warn('No valid data points to display');
// //       return;
// //     }

// //     const minTime = Math.min(...seriesData.map(point => point.x));
// //     const maxTime = Math.max(...seriesData.map(point => point.x2));

// //     try {
// //       Highcharts.chart(chartContainer.current, {
// //         chart: {
// //           type: 'xrange',
// //           zoomType: 'x',
// //           height: 180,
// //           backgroundColor: 'white',
// //           style: {
// //             fontFamily: 'Arial, sans-serif'
// //           }
// //         },
// //         title: {
// //           text: 'Machine State Timeline',
// //           style: {
// //             fontSize: '16px',
// //             fontWeight: 'bold'
// //           }
// //         },
// //         xAxis: {
// //           type: 'datetime',
// //           min: minTime,
// //           max: maxTime,
// //           labels: {
// //             format: '{value:%H:%M:%S}',
// //             style: {
// //               fontSize: '12px'
// //             }
// //           }
// //         },
// //         yAxis: {
// //           title: {
// //             text: ''
// //           },
// //           categories: ['Machine Status'],
// //           reversed: true,
// //           labels: {
// //             style: {
// //               fontSize: '12px'
// //             }
// //           }
// //         },
// //         series: [{
// //           name: 'State',
// //           borderColor: 'gray',
// //           pointWidth: 30,
// //           data: seriesData,
// //           dataLabels: {
// //             enabled: true,
// //             format: '{point.name}',
// //             style: {
// //               fontSize: '0px',
// //               textOutline: ''
// //             }
// //           }
// //         }],
// //         tooltip: {
// //           formatter: function() {
// //             return `<b>${this.point.name}</b><br/>` +
// //                    `Start: ${Highcharts.dateFormat('%H:%M:%S', this.point.x)}<br/>` +
// //                    `End: ${Highcharts.dateFormat('%H:%M:%S', this.point.x2)}`;
// //           }
// //         },
// //         legend: {
// //           enabled: false
// //         },
// //         credits: {
// //           enabled: false
// //         }
// //       });
// //     } catch (error) {
// //       console.error('Error creating chart:', error);
// //     }
// //   }, [data]);

// //   if (!data || !Array.isArray(data) || data.length === 0) {
// //     return (
// //       <div ref={chartContainer} className="chart-container">
// //         <div style={{ 
// //           height: '180px', 
// //           display: 'flex', 
// //           alignItems: 'center', 
// //           justifyContent: 'center',
// //           backgroundColor: 'white',
// //           color: '#666',
// //           fontSize: '14px'
// //         }}>
// //           No timeline data available
// //         </div>
// //       </div>
// //     );
// //   }

// //   return <div ref={chartContainer} className="chart-container" />;
// // };

// // export default MachineStateTimelineChart;
// import React from 'react';
// import Highcharts from 'highcharts';
// import highchartsMore from 'highcharts/highcharts-more';
// import xrange from 'highcharts/modules/xrange';

// highchartsMore(Highcharts);
// xrange(Highcharts);

// const MachineStateTimelineChart = ({ data }) => {
//   const chartContainer = React.useRef(null);

//   const parseTimeToMs = (timeStr) => {
//     if (!timeStr) return null;
//     const [hours, minutes, seconds] = timeStr.split(':').map(Number);
//     return (hours * 3600 + minutes * 60 + seconds) * 1000; // Convert to milliseconds
//   };

//   const getStateColor = (state) => {
//     switch (state) {
//       case 'OFF':
//         return '#FF6347';
//       case 'PRODUCTION':
//         return '#66BB6A';
//       case 'IDLE':
//         return '#FFA500';
//       default:
//         return '#C0C0C0';
//     }
//   };

//   React.useEffect(() => {
//     if (!chartContainer.current || !data || !Array.isArray(data)) {
//       return;
//     }

//     const seriesData = data.map(item => {
//       const startTime = parseTimeToMs(item.startTime);
//       const endTime = parseTimeToMs(item.endTime);
      
//       if (startTime === null || endTime === null) {
//         console.warn('Invalid time format in data:', item);
//         return null;
//       }

//       return {
//         x: startTime,
//         x2: endTime,
//         y: 0,
//         color: getStateColor(item.state),
//         name: item.state
//       };
//     }).filter(Boolean); // Remove any null entries

//     if (seriesData.length === 0) {
//       console.warn('No valid data points to display');
//       return;
//     }

//     const minTime = Math.min(...seriesData.map(point => point.x));
//     const maxTime = Math.max(...seriesData.map(point => point.x2));

//     try {
//       Highcharts.chart(chartContainer.current, {
//         chart: {
//           type: 'xrange',
//           zoomType: 'x',
//           height: 180,
//           backgroundColor: 'white',
//           style: {
//             fontFamily: 'Arial, sans-serif'
//           }
//         },
//         title: {
//           text: 'Machine State Timeline',
//           style: {
//             fontSize: '16px',
//             fontWeight: 'bold'
//           }
//         },
//         xAxis: {
//           type: 'datetime',
//           min: minTime,
//           max: maxTime,
//           labels: {
//             format: '{value:%H:%M:%S}',
//             style: {
//               fontSize: '12px'
//             }
//           }
//         },
//         yAxis: {
//           title: {
//             text: ''
//           },
//           categories: ['Machine Status'],
//           reversed: true,
//           labels: {
//             style: {
//               fontSize: '12px'
//             }
//           }
//         },
//         series: [{
//           name: 'State',
//           borderColor: 'gray',
//           pointWidth: 30,
//           data: seriesData,
//           dataLabels: {
//             enabled: true,
//             format: '{point.name}',
//             style: {
//               fontSize: '0px',
//               textOutline: ''
//             }
//           }
//         }],
//         tooltip: {
//           formatter: function() {
//             return `<b>${this.point.name}</b><br/>` +
//                    `Start: ${Highcharts.dateFormat('%H:%M:%S', this.point.x)}<br/>` +
//                    `End: ${Highcharts.dateFormat('%H:%M:%S', this.point.x2)}`;
//           }
//         },
//         legend: {
//           enabled: false
//         },
//         credits: {
//           enabled: false
//         }
//       });
//     } catch (error) {
//       console.error('Error creating chart:', error);
//     }
//   }, [data]);

//   if (!data || !Array.isArray(data) || data.length === 0) {
//     return (
//       <div ref={chartContainer} className="chart-container">
//         <div style={{ 
//           height: '180px', 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'center',
//           backgroundColor: 'white',
//           color: '#666',
//           fontSize: '14px'
//         }}>
//           No timeline data available
//         </div>
//       </div>
//     );
//   }

//   return <div ref={chartContainer} className="chart-container" />;
// };

// export default MachineStateTimelineChart;


import React from 'react';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import xrange from 'highcharts/modules/xrange';

highchartsMore(Highcharts);
xrange(Highcharts);

const MachineStateTimelineChart = ({ data }) => {
  const chartContainer = React.useRef(null);

  const parseTimeToMs = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000; // Convert to milliseconds
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'OFF':
        return '#FF6347';
      case 'PRODUCTION':
        return '#66BB6A';
      case 'IDLE':
        return '#FFA500';
      default:
        return '#C0C0C0';
    }
  };

  React.useEffect(() => {
    if (!chartContainer.current || !data || !Array.isArray(data)) {
      return;
    }

    const seriesData = data.map(item => {
      const startTime = parseTimeToMs(item.startTime);
      const endTime = parseTimeToMs(item.endTime);
      
      if (startTime === null || endTime === null) {
        console.warn('Invalid time format in data:', item);
        return null;
      }

      return {
        x: startTime,
        x2: endTime,
        y: 0,
        color: getStateColor(item.state),
        name: item.state
      };
    }).filter(Boolean); // Remove any null entries

    if (seriesData.length === 0) {
      console.warn('No valid data points to display');
      return;
    }

    const minTime = Math.min(...seriesData.map(point => point.x));
    const maxTime = Math.max(...seriesData.map(point => point.x2));

    try {
      Highcharts.chart(chartContainer.current, {
        chart: {
          type: 'xrange',
          zoomType: 'x',
          height: 180,
          backgroundColor: 'white',
          style: {
            fontFamily: 'Arial, sans-serif'
          }
        },
        title: {
          text: 'Machine State Timeline',
          style: {
            fontSize: '16px',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'datetime',
          min: minTime,
          max: maxTime,
          labels: {
            format: '{value:%H:%M:%S}',
            style: {
              fontSize: '12px'
            }
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          categories: ['Machine Status'],
          reversed: true,
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        },
        series: [{
          name: 'State',
          borderColor: 'gray',
          pointWidth: 30,
          data: seriesData,
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
              fontSize: '0px',
              textOutline: ''
            }
          }
        }],
        tooltip: {
          formatter: function() {
            return `<b>${this.point.name}</b><br/>` +
                   `Start: ${Highcharts.dateFormat('%H:%M:%S', this.point.x)}<br/>` +
                   `End: ${Highcharts.dateFormat('%H:%M:%S', this.point.x2)}`;
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        }
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, [data]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div ref={chartContainer} className="chart-container">
        <div style={{ 
          height: '180px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'white',
          color: '#666',
          fontSize: '14px'
        }}>
          No timeline data available
        </div>
      </div>
    );
  }

  return <div ref={chartContainer} className="chart-container" />;
};

export default MachineStateTimelineChart;