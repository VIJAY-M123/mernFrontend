import ReactApexChart from 'react-apexcharts';

function Stacked({ Series, Categories }) {
  console.log('Series Stacked', Series);

  const series = Series;
  //   const series = [
  //     {
  //       name: 'PRODUCT A',
  //       data: [44, 55, 41, 67, 22, 43, 21, 49],
  //     },
  //     {
  //       name: 'PRODUCT B',
  //       data: [13, 23, 20, 8, 13, 27, 33, 12],
  //     },
  //     {
  //       name: 'PRODUCT C',
  //       data: [11, 17, 15, 15, 21, 14, 15, 13],
  //     },
  //   ];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: '100%',
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    xaxis: {
      categories: Categories,
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'right',
      offsetX: 0,
      offsetY: 50,
    },
  };
  return (
    <div>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
}

export default Stacked;
