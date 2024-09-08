import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import Counter from 'app/shared-components/Counter';
import { Controller, useForm } from 'react-hook-form';
import BasicDatePicker from 'app/shared-components/DatePicker';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactApexChart from 'react-apexcharts';
import LanguageIcon from '@mui/icons-material/Language';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const schema = {};
const defaultValues = {};

export default function SocialMediaTrackingReport() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const seriesbar2 = [
    {
      name: 'Net Profit',
      data: [44, 55, 57, 56, 61],
    },
  ];
  const optionsbar2 = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: !1,
      },
    },
    // title: {
    //   text: 'Monthly Website Visitors',
    //   style: {
    //     color: 'var(--text-primary)',
    //   },
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
      categories: ['01-02-2023', '01-03-2023', '01-04-2023', '01-05-2023', '01-06-2023'],
      labels: {
        style: {
          colors: 'var(--text-primary)',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Number of Issues',
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
    //     fill: {
    //     type: "gradient",

    //     gradient: {
    //       shadeIntensity: 1,
    //       type: "vertical",
    //       opacityFrom: 0.7,
    //       opacityTo: 0.9,
    //       colorStops: [
    //         {
    //           offset: 0,
    //           color: "#2bc7b2",
    //           opacity: 1
    //         },

    //         {
    //           offset: 100,
    //           color: "#002151",
    //           opacity: 1
    //         }
    //       ]
    //     }
    //   },
    tooltip: {
      y: {
        formatter(val) {
          return `$ ${val} thousands`;
        },
      },
    },
  };
  const seriesstack = [
    {
      name: 'Email',
      data: [44, 55, 41, 67, 22],
    },
    {
      name: 'SEO',
      data: [13, 23, 20, 8, 13],
    },
    {
      name: 'Social Media',
      data: [11, 17, 15, 15, 21],
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
      categories: ['01-02-2023', '01-03-2023', '01-04-2023', '01-05-2023', '01-06-2023'],
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

  return (
    <div>
      <form className="mb-12">
        <Grid container spacing={2}>
          <Grid item xs={12} lg={5.2}>
            <Typography variant="h6" className="font-bold mb-12">
              Dashboard
            </Typography>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Controller
              name="fromDate"
              control={control}
              label="From Date"
              render={({ field }) => (
                <BasicDatePicker
                  field={field}
                  required
                  // disableFuture
                  className="mb-12"
                  label="From Date"
                  error={!!errors.fromDate}
                  helperText={errors.fromDate?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} lg={2}>
            <Controller
              name="toDate"
              control={control}
              label="To Date"
              render={({ field }) => (
                <BasicDatePicker
                  field={field}
                  required
                  // disableFuture
                  className="mb-12"
                  label="To Date"
                  error={!!errors.toDate}
                  helperText={errors.toDate?.message}
                />
              )}
            />
          </Grid>
          <Grid
            item
            xs={12}
            lg={2.8}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '-15px',
            }}
          >
            <Button variant="contained" className="rounded-md">
              Apply
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #d9dde0, #ffffff)',
              boxShadow: '8px 8px 7px #e0e4e8, -8px -8px 7px #ffffff',
              // padding: '16px', // Optional: padding for content inside the card
            }}
          >
            <CardContent>
              <div className="flex w-full gap-6">
                <div className="w-full">
                  <Typography>Website Visitor</Typography>
                  <Typography className="font-bold" sx={{ fontSize: 30 }}>
                    <Counter from={0} to={1000} />
                  </Typography>
                </div>
                <div className="flex items-center">
                  <LanguageIcon sx={{ height: 40, width: 40 }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #d9dde0, #ffffff)',
              boxShadow: '8px 8px 7px #e0e4e8, -8px -8px 7px #ffffff',
              // padding: '16px', // Optional: padding for content inside the card
            }}
          >
            <CardContent>
              <div className="flex w-full gap-6">
                <div className="w-full">
                  <Typography>Number of Leads</Typography>
                  <Typography className="font-bold" sx={{ fontSize: 30 }}>
                    <Counter from={0} to={31} />
                  </Typography>
                </div>
                <div className="flex items-center">
                  <LeaderboardIcon sx={{ height: 40, width: 40 }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #d9dde0, #ffffff)',
              boxShadow: '8px 8px 7px #e0e4e8, -8px -8px 7px #ffffff',
              // padding: '16px', // Optional: padding for content inside the card
            }}
          >
            <CardContent>
              <div className="flex w-full gap-6">
                <div className="w-full">
                  <Typography>Cost Per Click</Typography>
                  <Typography className="font-bold" sx={{ fontSize: 30 }}>
                    <Counter from={0} to={100} />
                    {/* <span>(36.4%)</span> */}
                  </Typography>
                </div>
                <div className="flex items-center">
                  <MonetizationOnIcon sx={{ height: 40, width: 40 }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #d9dde0, #ffffff)',
              boxShadow: '8px 8px 7px #e0e4e8, -8px -8px 7px #ffffff',
              // padding: '16px', // Optional: padding for content inside the card
            }}
          >
            <CardContent>
              <div className="flex w-full gap-6">
                <div className="w-full">
                  <Typography>Impressions</Typography>
                  <Typography className="font-bold" sx={{ fontSize: 30 }}>
                    <Counter from={0} to={1000} />
                    {/* <span>(36.4%)</span> */}
                  </Typography>
                </div>
                <div className="flex items-center">
                  <ThumbUpIcon sx={{ height: 40, width: 40 }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #d9dde0, #ffffff)',
              boxShadow: '8px 8px 7px #e0e4e8, -8px -8px 7px #ffffff',
              // padding: '16px', // Optional: padding for content inside the card
            }}
            className="flex justify-center "
          >
            <CardContent>
              <Typography className="flex justify-center">Message By Status</Typography>
              <ReactApexChart options={optionsbar2} series={seriesbar2} type="bar" height={300} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #d9dde0, #ffffff)',
              boxShadow: '8px 8px 7px #e0e4e8, -8px -8px 7px #ffffff',
              // padding: '16px', // Optional: padding for content inside the card
            }}
          >
            <CardContent>
              <Typography className="flex justify-start">Message Performance</Typography>
              <ReactApexChart options={optionsstack} series={seriesstack} type="bar" height={300} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
