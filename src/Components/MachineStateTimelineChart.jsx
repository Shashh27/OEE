import React from 'react';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import xrange from 'highcharts/modules/xrange';

highchartsMore(Highcharts);
xrange(Highcharts);

const MachineStateTimelineChart = ({ data }) => {
  const chartContainer = React.useRef(null);

  React.useEffect(() => {
    if (!chartContainer.current) {
      console.error('Chart container is not mounted.');
      return;
    }

    const seriesData = data.map(item => ({
      x: convertEpochToGMT(item.startTime, 5.5),
      x2: convertEpochToGMT(item.endTime, 5.5),
      y: 0,
      color: item.state === 'OFF' ? '#FF6347' : item.state === 'PRODUCTION' ? '#66BB6A' : item.state === 'IDLE' ? '#808080' : '#C0C0C0',
      name: item.state
    }));

    const minTime = Math.min(...seriesData.map(point => point.x));

    Highcharts.chart(chartContainer.current, {
      chart: {
        type: 'xrange',
        zoomType: 'x',
        height: 200, // Reduced height
        width: 1550 // Reduced width
      },
      title: {
        text: 'Machine State Timeline'
      },
      xAxis: {
        type: 'datetime',
        min: minTime
      },
      yAxis: {
        title: {
          text: 'Machines'
        },
        categories: ['Machine 1'],
        reversed: true
      },
      series: [{
        name: 'State',
        borderColor: 'gray',
        pointWidth: 120,
        data: seriesData,
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        }
      }],
      tooltip: {
        formatter: function() {
          return Highcharts.dateFormat('%Y-%m-%d %H:%M', this.point.x) + ' - ' +
                 Highcharts.dateFormat('%Y-%m-%d %H:%M', this.point.x2) + '<br/>' +
                 'State: ' + this.point.name;
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          }
        }
      }
    });
  }, [data]);

  const convertEpochToGMT = (epoch, offset) => {
    const offsetMillis = offset * 60 * 60 * 1000;
    return new Date(epoch * 1000 + offsetMillis).getTime();
  };

  return (
    <div ref={chartContainer} className="chart-container"></div>
  );
};

export default MachineStateTimelineChart;