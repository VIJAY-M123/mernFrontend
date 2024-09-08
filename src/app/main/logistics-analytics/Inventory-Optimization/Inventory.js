import { Card, CardContent, Grid, Typography } from '@mui/material';
import Counter from 'app/shared-components/Counter';
import ReactApexChart from 'react-apexcharts';

const seriesstack = [
  {
    name: 'Passenger_Weight',
    data: [44, 55, 41, 67, 22],
  },
  {
    name: 'Goods_weight',
    data: [13, 23, 20, 8, 13],
  },
  {
    name: 'Liquids_weight',
    data: [13, 23, 20, 8, 13],
  },
  {
    name: 'Empty_weight',
    data: [13, 23, 20, 8, 13],
  },
];
const optionsstack = {
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    toolbar: {
      show: !1,
    },
    zoom: {
      enabled: true,
    },
  },
  // title: {
  //   text: 'Top Converting Marketing Channels',
  //   style: {
  //     color: 'var(--text-primary)',
  //   },
  // },
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
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: '13px',
            fontWeight: 900,
          },
        },
      },
    },
  },
  xaxis: {
    type: 'year',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    labels: {
      style: {
        colors: 'var(--text-primary)',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: 'var(--text-primary)',
      },
    },
  },
  legend: {
    position: 'bottom',
    offsetY: 5,
    labels: {
      colors: 'var(--text-primary)',
    },
  },
  fill: {
    opacity: 1,
  },
};

const callCategorySeries = [
  {
    name: 'Distance',
    type: 'column',
    data: [440, 505, 414, 671, 227],
  },
  {
    name: 'Fuel_Cost',
    type: 'line',
    data: [23, 42, 35, 27, 43],
  },
];

const callCategoryOption = {
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: !1,
    },
  },
  stroke: {
    width: [0, 4],
  },
  // title: {
  //   text: 'Call Categories',
  //   style: {
  //     color: 'var(--text-primary)',
  //   },
  // },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1],
    // formatter: (val) => {
    //   return `${val / 1000}K`;
    // },
  },

  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  legend: {
    display: true,
    position: 'bottom',
    labels: {
      colors: 'var(--text-primary)',
    },
  },
  xaxis: {
    type: 'year',
    labels: {
      style: {
        colors: 'var(--text-primary)',
      },
    },
  },

  yaxis: [
    {
      title: {
        text: 'Distance',
        style: {
          color: 'var(--text-primary)',
        },
        labels: {
          style: {
            colors: 'var(--text-primary)',
          },
        },
      },
    },
    {
      opposite: true,
      title: {
        text: 'Fuel_Cost',
        style: {
          color: 'var(--text-primary)',
        },
      },
      labels: {
        style: {
          colors: 'var(--text-primary)',
        },
      },
    },
  ],
};

const openSeries = [
  {
    name: 'Accidents',
    data: [33, 44, 55, 57],
  },
];

const openOption = {
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: !1,
    },
  },
  // title:{
  //     text:"Open Details",
  //     style:{
  //         color:"white"
  //     }
  // },

  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['#2bc7b2'],
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: ['Empty', 'Liquids', 'Goods', 'Passenger'],
    labels: {
      style: {
        colors: 'var(--text-primary)',
      },
    },
  },
  yaxis: {
    title: {
      text: 'Placeholders',
      style: {
        color: 'var(--text-primary)',
      },
    },
    labels: {
      style: {
        colors: 'var(--text-primary)',
      },
    },
  },
  fill: {
    type: 'gradient',

    gradient: {
      shadeIntensity: 1,
      type: 'vertical',
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        {
          offset: 0,
          color: '#26a0fc',
          opacity: 1,
        },

        {
          offset: 100,
          color: '#fff',
          opacity: 1,
        },
      ],
    },
  },
  tooltip: {
    y: {
      formatter(val) {
        return `₹ ${val} %`;
      },
    },
  },
};

export default function Inventory() {
  return (
    <div className="p-24">
      <Grid container spacing={2}>
        <Grid item xs={12} md={2.5}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography className="w-full flex justify-center font-bold">
                    Transport Overview
                  </Typography>
                  <Typography
                    className="w-full flex justify-center font-bold"
                    sx={{ fontSize: 30 }}
                  >
                    <Counter from={0} to={200} />
                  </Typography>
                  <Typography className="w-full flex justify-center">Rides Completed</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography className="w-full flex justify-center font-bold">
                    Transport Maintenances
                  </Typography>
                  <Typography
                    className="w-full flex justify-center font-bold"
                    sx={{ fontSize: 30 }}
                  >
                    $ <Counter from={0} to={200} />
                  </Typography>
                  <Typography className="w-full flex justify-center">
                    Miantenance Expenditure
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={2.5}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography className="w-full flex justify-center font-bold">
                    Logistics Income Overview
                  </Typography>
                  <Typography
                    className="w-full flex justify-center font-bold"
                    sx={{ fontSize: 30 }}
                  >
                    $ <Counter from={0} to={8} /> K
                  </Typography>
                  <Typography className="w-full flex justify-center">Revenue</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography className="w-full flex justify-center font-bold">
                    vs Last One Month
                  </Typography>
                  <Typography
                    className="w-full flex justify-center font-bold"
                    sx={{ fontSize: 30 }}
                  >
                    <Counter from={0} to={31.9} /> %
                  </Typography>
                  <Typography className="w-full flex justify-center">Revenue</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography className="font-bold">
                Cargo Type & Corresponding Weight Metrics
              </Typography>
              <ReactApexChart options={optionsstack} series={seriesstack} type="bar" height={195} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography className="font-bold">Risk Assessment based on Cargo Types</Typography>
              <ReactApexChart options={openOption} series={openSeries} type="bar" height={280} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography className="font-bold">
                Comprehensive Metrics on Distance & Expenditure
              </Typography>
              <ReactApexChart
                options={callCategoryOption}
                series={callCategorySeries}
                type="line"
                height={275}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
