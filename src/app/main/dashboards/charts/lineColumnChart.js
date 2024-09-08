import ReactApexChart from 'react-apexcharts';

// const series = [
//   {
//     name: 'Website Blog',
//     type: 'column',
//     data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
//   },
//   {
//     name: 'Social Media',
//     type: 'line',
//     data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
//   },
// ];

function LineColumnChart({
  Series,
  ChartHeight,
  Labels,
  YAxisTitle,
  OppositeYAxisTitle,
  ChartTitle,
}) {
  const options = {
    chart: {
      height: ChartHeight,
      type: 'line',
      toolbar: {
        show: !1,
      },
    },
    stroke: {
      width: [0, 4],
    },
    title: {
      text: ChartTitle,
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: Labels,
    xaxis: {
      type: 'datetime',
    },
    yaxis: [
      {
        title: {
          text: YAxisTitle,
        },
      },
      {
        opposite: true,
        title: {
          text: OppositeYAxisTitle,
        },
      },
    ],
  };
  return (
    <div>
      <ReactApexChart options={options} series={Series} type="line" height={350} />
    </div>
  );
}

export default LineColumnChart;
