import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import QuickreplyIcon from '@mui/icons-material/Quickreply';
import DraftsIcon from '@mui/icons-material/Drafts';
import Counter from 'app/shared-components/Counter';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import MailLockIcon from '@mui/icons-material/MailLock';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import { Controller, useForm } from 'react-hook-form';
import BasicDatePicker from 'app/shared-components/DatePicker';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactApexChart from 'react-apexcharts';

const schema = {};
const defaultValues = {};

export default function EmailAnalytics() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const clickSeries = [
    {
      name: 'Click Rate',
      data: [33, 44, 55, 57, 56, 61, 30, 23, 18, 45, 46, 24],
    },
  ];
  const clickOption = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: !1,
      },
    },
    colors: ['#6026c5'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    // title:{
    // text:"Click Details",
    // style:{
    //          color:"white"
    //     }
    // },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'oct',
        'Nev',
        'Dec',
      ],
      labels: {
        style: {
          colors: 'var(--text-primary)',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Clicks',

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
            color: '#239df9',
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

  const openSeries = [
    {
      name: 'Open Rate',
      data: [33, 44, 55, 57, 56, 61, 30, 23, 18, 45, 46, 24],
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
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'oct',
        'Nev',
        'Dec',
      ],
      labels: {
        style: {
          colors: 'var(--text-primary)',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Opens',
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
            color: '#2bc7b2',
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
  return (
    <div className="">
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
                  size="small"
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
                  size="small"
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
              background: 'linear-gradient(145deg, #f1f5f9, #ffffff)',
              boxShadow: '8px 8px 7px #e0e4e8, -8px -8px 7px #ffffff',
              // padding: '16px', // Optional: padding for content inside the card
            }}
          >
            <CardContent>
              <div className="flex w-full gap-6">
                <div className="w-full">
                  <Typography>Recipients</Typography>
                  <Typography className="font-bold" sx={{ fontSize: 30 }}>
                    <Counter from={0} to={1165} />
                  </Typography>
                </div>
                <div className="flex items-center">
                  <ContactMailIcon sx={{ height: 45, width: 45 }} />
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
                  <Typography>Replies</Typography>
                  <Typography className="font-bold" sx={{ fontSize: 30 }}>
                    <Counter from={0} to={16} />
                  </Typography>
                </div>
                <div className="flex items-center">
                  <QuickreplyIcon sx={{ height: 50, width: 50, color: '#000000' }} />
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
                  <Typography>Open Rate</Typography>
                  <Typography className="font-bold" sx={{ fontSize: 30 }}>
                    <Counter from={0} to={318} />
                    {/* <span>(36.4%)</span> */}
                  </Typography>
                </div>
                <div className="flex items-center">
                  <DraftsIcon sx={{ height: 50, width: 50 }} />
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
                  <Typography>Click Rate</Typography>
                  <Typography className="font-bold" sx={{ fontSize: 30 }}>
                    <Counter from={0} to={12} />
                    {/* <span>(36.4%)</span> */}
                  </Typography>
                </div>
                <div className="flex items-center">
                  <TouchAppIcon sx={{ height: 50, width: 50 }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                          <Typography>Bounces</Typography>
                          <Typography className="font-bold" sx={{ fontSize: 30 }}>
                            <Counter from={0} to={119} />
                            {/* <span>(36.4%)</span> */}
                          </Typography>
                        </div>
                        <div className="flex items-center">
                          <MoveToInboxIcon sx={{ height: 50, width: 50 }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
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
                          <Typography>UnSubscribed</Typography>
                          <Typography className="font-bold" sx={{ fontSize: 30 }}>
                            <Counter from={0} to={42} />
                            {/* <span>(36.4%)</span> */}
                          </Typography>
                        </div>
                        <div className="flex items-center">
                          <UnsubscribeIcon sx={{ height: 50, width: 50 }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
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
                          <Typography>Block</Typography>
                          <Typography className="font-bold" sx={{ fontSize: 30 }}>
                            <Counter from={0} to={70} />
                            {/* <span>(36.4%)</span> */}
                          </Typography>
                        </div>
                        <div className="flex items-center">
                          <MailLockIcon sx={{ height: 50, width: 50 }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={9}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography>Main Campaign Report</Typography>
                    </Grid>
                    <Grid item xs={12} md={4} className="flex gap-6 justify-end">
                      <Button
                        sx={{
                          minHeight: '20px',
                          maxHeight: '20px',
                          fontSize: '10px',
                        }}
                        variant="contained"
                        className="rounded-md"
                      >
                        This Year
                      </Button>
                      <Button
                        sx={{
                          minHeight: '20px',
                          maxHeight: '20px',
                          fontSize: '10px',
                        }}
                        variant="contained"
                        className="rounded-md"
                      >
                        Last Year
                      </Button>
                    </Grid>
                  </Grid>

                  <ReactApexChart
                    options={openOption}
                    series={openSeries}
                    type="bar"
                    height={130}
                  />
                  <ReactApexChart
                    options={clickOption}
                    series={clickSeries}
                    type="bar"
                    height={130}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
