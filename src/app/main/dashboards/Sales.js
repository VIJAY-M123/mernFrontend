import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { Font, Label } from 'devextreme-react/pie-chart';

import {
  CircularGauge,
  Scale,
  RangeContainer,
  Title,
  ValueIndicator,
  Geometry,
  Margin,
  Subtitle,
} from 'devextreme-react/circular-gauge';
import { useEffect, useState } from 'react';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectAgency } from 'app/store/agencySlice';
import { selectUser } from 'app/store/userSlice';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BasicDatePicker from 'app/shared-components/DatePicker';
import LrtDashboardService from './service';

const gaugeChart = [
  {
    startValue: 0,
    endValue: 1000,
    value: 500,
    bgColor: '#e0e0e0',
    title: 'Sales Revenue',
    subtitle: '500K',
  },
  {
    startValue: 0,
    endValue: 1000,
    value: 400,
    bgColor: '#3300FF',
    title: 'Actual Revenue',
    subtitle: '400K',
  },
  {
    startValue: 0,
    endValue: 1000,
    value: 300,
    bgColor: '#FF0099',
    title: 'Product Revenue',
    subtitle: '300K',
  },
  {
    startValue: 0,
    endValue: 1000,
    value: 200,
    bgColor: '#CC00FF',
    title: 'Target Revenue',
    subtitle: '200K',
  },
];

const defaultValues = {
  fromDate: null,
  toDate: null,
};

const schema = yup.object().shape({
  fromDate: yup
    .date()
    .nullable()
    .required('You must Select from Date')
    .typeError('You must enter a valid date')
    .max(new Date(), 'Future dates are not allowed'),
  toDate: yup
    .date()
    .nullable()
    .required('You must select to date')
    .typeError('You must enter a valid date')
    .test((value, ctx) => {
      const { fromDate } = ctx.parent;
      if (value && fromDate > value) {
        return ctx.createError({ message: 'End Date must be greater than Start Date' });
      }
      return true;
    }),
});

function Sales() {
  const dispatch = useDispatch();
  const agency = useSelector(selectAgency);
  const user = useSelector(selectUser);

  const [saleSummary, setSalesSummary] = useState([]);

  const { handleSubmit, formState, control, setValue, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const customizeText = ({ valueText }) => {
    return `${valueText}`;
  };

  useEffect(() => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    setValue('fromDate', firstDayOfMonth);

    const currentDate1 = new Date();
    const lastDayOfMonth = new Date(currentDate1.getFullYear(), currentDate1.getMonth() + 1, 0);
    setValue('toDate', lastDayOfMonth);

    const fetchData = async () => {
      try {
        const data = {
          cp_id: agency?.cp_id,
          user_id: user.data.user_id,
          from_date: getValues('fromDate'),
          to_date: getValues('toDate'),
        };
        dispatch(showLoader());
        const message = await LrtDashboardService.getSaleSummary(data);
        dispatch(hideLoader());
        setSalesSummary(message);
      } catch (error) {
        dispatch(hideLoader());
        dispatch(showMessage({ message: error, variant: 'error' }));
      }
    };

    fetchData();
  }, [agency, dispatch, setValue, getValues, user]);

  const onSubmit = async (data) => {
    try {
      const newData = {
        cp_id: agency?.cp_id,
        user_id: user.data.user_id,
        from_date: data.fromDate,
        to_date: data.toDate,
      };

      dispatch(showLoader());

      const [salesData] = await Promise.all([LrtDashboardService.getSaleSummary(newData)]);

      // console.log('BookingResponse', BookingData);
      dispatch(hideLoader());

      setSalesSummary(salesData);
    } catch (error) {
      dispatch(hideLoader());
      dispatch(showMessage({ message: 'Fetch Api Error', variant: 'error' }));
    }
  };
  return (
    <div className="p-24">
      {/* <Typography className="text-2xl font-bold mb-12">Sale Target</Typography> */}
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Typography className="text-2xl">Sales Target</Typography>
          </Grid>
          <Grid item xs={12} sm={2} md={2} lg={2}>
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
          <Grid item xs={12} sm={2} md={2} lg={2}>
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
          <Grid item xs={12} sm={2} md={2} lg={2} className="flex justify-center mt-5">
            <Button
              className="bg-cyan-400 text-white hover:bg-black"
              type="submit"
              variant="contained"
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={2} className="mt-12">
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {saleSummary.map((item, index) => (
              <Grid item xs={12} md={4} lg={4} xl={3} key={index}>
                <Card className="h-[300px]">
                  <CardContent>
                    <CircularGauge id="triangleNeedle" value={item.currentValue}>
                      <ValueIndicator
                        type="triangleNeedle"
                        color="#000"
                        width={18}
                        spindleSize={20}
                        spindleGapSize={15}
                      />
                      <Scale
                        startValue={item.startValue}
                        endValue={item.endValue}
                        // tickInterval={200}
                      >
                        <Label customizeText={customizeText} />
                      </Scale>
                      <RangeContainer backgroundColor={item.bgColor} width={15} />
                      <Geometry startAngle={180} endAngle={0} />
                      <Title text={item.title} verticalAlignment="bottom">
                        <Font color="#000000" size={20} family="bold" />
                        <Margin top={20} />
                        <Subtitle text={item.subtitle} verticalAlignment="bottom">
                          <Font color="#000000" size={20} weight="bold" family="sans-serif" />
                          <Margin top={20} />
                        </Subtitle>
                      </Title>
                      {/* <Subtitle text="Gold Production (in Kilograms)" verticalAlignment="bottom" /> */}
                    </CircularGauge>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Sales;
