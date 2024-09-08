import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import Counter from 'app/shared-components/Counter';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Controller, useForm } from 'react-hook-form';
import BasicDatePicker from 'app/shared-components/DatePicker';
import { yupResolver } from '@hookform/resolvers/yup';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import ReactApexChart from 'react-apexcharts';
import TerminalIcon from '@mui/icons-material/Terminal';
import PinchIcon from '@mui/icons-material/Pinch';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';

const schema = {};
const defaultValues = {};

export default function MassEmailPerformanceReport() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const bounceSeries = [
    {
      name: 'Hard Bounce',
      type: 'column',
      data: [40, 50, 41, 67, 22, 41, 20, 35, 75, 32, 25, 16],
    },
    {
      name: 'Soft bounce',
      type: 'line',
      data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
    },
  ];
  const bounceOption = {
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
    //   text: 'Bounce Categories',
    //   style: {
    //     color: 'var(--text-primary)',
    //   },
    // },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        colors: 'var(--text-primary)',
      },
    },
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nev', 'Dec'],
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
          text: 'Hard Bounce Count',
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
      {
        opposite: true,
        title: {
          text: 'Soff bounce count',
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
                  <Typography>Hard bounce count Rates</Typography>
                  <Typography className="font-bold" sx={{ fontSize: 30 }}>
                    <Counter from={0} to={1165} />
                  </Typography>
                </div>
                <div className="flex items-center">
                  <DeveloperBoardIcon sx={{ height: 45, width: 45 }} />
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
                    <Counter from={0} to={30} />
                  </Typography>
                </div>
                <div className="flex items-center">
                  <TouchAppIcon sx={{ height: 50, width: 50 }} />
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
                  <Typography>Forwarding Rate</Typography>
                  <Typography className="font-bold" sx={{ fontSize: 30 }}>
                    <Counter from={0} to={20} />
                    {/* <span>(36.4%)</span> */}
                  </Typography>
                </div>
                <div className="flex items-center">
                  <ForwardToInboxIcon sx={{ height: 50, width: 50 }} />
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
                  <Typography>Forward count Rate</Typography>
                  <Typography className="font-bold" sx={{ fontSize: 30 }}>
                    <Counter from={0} to={40} />
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
                          <Typography>Soft Bounce Count Rate</Typography>
                          <Typography className="font-bold" sx={{ fontSize: 30 }}>
                            <Counter from={0} to={10} />
                            {/* <span>(36.4%)</span> */}
                          </Typography>
                        </div>
                        <div className="flex items-center">
                          <TerminalIcon sx={{ height: 50, width: 50 }} />
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
                          <Typography>Unique Click Count Rate</Typography>
                          <Typography className="font-bold" sx={{ fontSize: 30 }}>
                            <Counter from={0} to={40} />
                            {/* <span>(36.4%)</span> */}
                          </Typography>
                        </div>
                        <div className="flex items-center">
                          <PinchIcon sx={{ height: 50, width: 50 }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={9}>
              <Card
                sx={{
                  background: 'linear-gradient(145deg, #d9dde0, #ffffff)',
                  boxShadow: '8px 8px 7px #e0e4e8, -8px -8px 7px #ffffff',
                  // padding: '16px', // Optional: padding for content inside the card
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography>Bounced Categories</Typography>
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
                    options={bounceOption}
                    series={bounceSeries}
                    type="line"
                    height={295}
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
