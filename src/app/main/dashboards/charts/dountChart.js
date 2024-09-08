import ReactApexChart from 'react-apexcharts';

function DountChart({ Series, Label, Width, Colors, DountSize }) {
  const series = Series;

  const options = {
    chart: {
      type: 'dount',
    },
    stroke: {
      width: 0,
    },
    colors: Colors,
    labels: Label,
    legend: {
      show: true,
      // display: true,
      position: 'bottom',
      horizontalAlign: 'left',
      offsetX: 0,
      offsetY: 0,
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
      labels: {
        colors: '#000000',
      },
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        offsetY: 10,

        donut: {
          size: DountSize,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter(val, opts) {
        return `${Math.round(val)}%`; // Round the value and display as a percentage
      },
      style: {
        colors: ['#111'], // inside label
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        borderWidth: 0,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };
  return (
    <div className="flex justify-center">
      <ReactApexChart options={options} series={series} type="donut" width={Width} />
    </div>
  );
}

export default DountChart;
