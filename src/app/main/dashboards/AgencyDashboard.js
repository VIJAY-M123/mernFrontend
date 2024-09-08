import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, Typography } from '@mui/material';
import DataTable from 'app/shared-components/DataTable';
import utils from 'src/@utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectAgency } from 'app/store/agencySlice';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectUser } from 'app/store/userSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import BasicDatePicker from 'app/shared-components/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import withReducer from 'app/store/withReducer';
import DashboardService from './service';
import PreviewModal from './previewModal';
import reducer from './store';

const { createDataGridHeader } = utils;

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

const defaultValues = {
  fromDate: null,
  toDate: null,
};

const AgencyDashboard = () => {
  const dispatch = useDispatch();
  const agency = useSelector(selectAgency);
  const user = useSelector(selectUser);
  const [agencyDetails, setAgencyDetails] = useState([]);
  const [getAllSummary, setAllSummary] = useState([]);
  const [open, setOpen] = useState(false);
  const [clickedItems, setClickedItem] = useState([]);
  const [gridSummary, setGridSummary] = useState([]);

  const { control, setValue, formState, handleSubmit, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

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
        const message = await DashboardService.getAgencyDashboard(data);
        // console.log('Messgae', message);
        dispatch(hideLoader());
        // Update the state with the fetched data
        setAgencyDetails(message);
      } catch (error) {
        dispatch(hideLoader());
        dispatch(showMessage({ message: error, variant: 'error' }));
      }
    };

    fetchData();
  }, [agency, dispatch, setValue, getValues, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          cp_id: agency?.cp_id,
          user_id: user.data.user_id,
          from_date: getValues('fromDate'),
          to_date: getValues('toDate'),
        };
        dispatch(showLoader());
        const message = await DashboardService.getAgencySummary(data);
        dispatch(hideLoader());
        setAllSummary(message);
      } catch (error) {
        dispatch(hideLoader());
        dispatch(showMessage({ message: error, variant: 'error' }));
      }
    };

    fetchData();
  }, [agency, dispatch, getValues, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          cp_id: agency?.cp_id,
          user_id: user.data.user_id,
          from_date: getValues('fromDate'),
          to_date: getValues('toDate'),
        };
        dispatch(showLoader());
        const message = await DashboardService.getAgencyGridSummary(data);
        dispatch(hideLoader());
        setGridSummary(message);
      } catch (error) {
        dispatch(hideLoader());
        dispatch(showMessage({ message: error, variant: 'error' }));
      }
    };

    fetchData();
  }, [agency, dispatch, getValues, user]);

  const onSubmit = async (data) => {
    try {
      const newData = {
        cp_id: agency?.cp_id,
        user_id: user.data.user_id,
        from_date: data.fromDate,
        to_date: data.toDate,
      };
      dispatch(showLoader());
      const [dashboardData, allSummary, allGridSummary] = await Promise.all([
        DashboardService.getAgencyDashboard(newData),
        DashboardService.getAgencySummary(newData),
        DashboardService.getAgencyGridSummary(newData),
      ]);
      dispatch(hideLoader());

      // const datewise = fixArrayDates(
      //   dateData.map((e, index) => ({ id: index, ...e })),
      //   'dd/MM/yyyy'
      // );
      // const pods = fixArrayDates(
      //   podData.map((e, index) => ({
      //     id: index,
      //     ...e,
      //   })),
      //   'dd/MM/yyyy'
      // );

      setAgencyDetails(dashboardData);
      setAllSummary(allSummary);
      setGridSummary(allGridSummary);
    } catch (error) {
      dispatch(hideLoader());
      dispatch(showMessage({ message: 'Fetch Api error', variant: 'error' }));
    }
  };

  const Handle = (index) => {
    setOpen(true);
    setClickedItem(index);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="p-24">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <Typography className="text-2xl">Agency Dashboard</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={5} lg={2}>
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
          <Grid item xs={12} sm={6} md={5} lg={2}>
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
          <Grid item xs={12} sm={6} md={2} lg={2} className="flex justify-center mt-5">
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
      <Grid container spacing={2} className="mt-24">
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {getAllSummary.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} lg={6} xl={3} key={index}>
                <Card
                  className={`${
                    item.CardClassName === null ? 'h-[158px] bg-white' : item.CardClassName
                  }`}
                  sx={{
                    overflow: 'visible',
                    // height: item.height,
                    '@media (max-width: 600px)': {
                      marginBottom: '20px',
                    },
                    // '@media (min-width: 600px)': {
                    //   marginBottom: '20px',
                    // },
                    '@media (max-width: 1300px)': {
                      marginBottom: '20px',
                    },
                    ...(getAllSummary.length > 4 && {
                      '@media (min-width: 1300px)': {
                        marginBottom: '20px',
                      },
                    }),
                  }}
                  component={motion.div}
                  initial={{ x: -500 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.3, bounceDamping: 0 }}
                >
                  <CardContent>
                    <div className="flex justify-between relative mb-8 ">
                      <Typography className="text-xl">{item.Header}</Typography>
                      <div className="absolute right-0 top-0 mt-[-35px]">
                        <FuseSvgIcon
                          className="shadow-lg shadow-gray-500/20 p-5 rounded-md"
                          size={40}
                          sx={{
                            color: item.IconColor,
                            backgroundColor: item.IconBgColor,
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                            },
                          }}
                        >
                          {item.Icon}
                        </FuseSvgIcon>
                      </div>
                    </div>
                    <hr />
                    <div className="max-h-[90px] overflow-y-scroll">
                      {item.subtitle.map((obj, ids) => (
                        <div className="flex justify-between mt-8" key={ids}>
                          <div>{obj.Title !== null ? obj.Title : 0}</div>
                          <div>{obj.Value !== null ? obj.Value : 0}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {agencyDetails.map((obj, id) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={id}>
                <Card
                  component={motion.div}
                  initial={{ x: 500 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.3, bounceDamping: 0 }}
                >
                  <CardContent>
                    <Grid className="flex justify-end">
                      <FuseSvgIcon
                        className="text-48 p-3 rounded-md"
                        size={40}
                        sx={{
                          color: '#FFF',
                          backgroundColor: obj.COLOR,
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                          },
                        }}
                      >
                        {obj.ICON}
                      </FuseSvgIcon>
                    </Grid>
                    <Grid>
                      <Typography className="font-bold" sx={{ fontSize: '30px' }}>
                        {obj.TOTAL}
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography sx={{ fontSize: '14px' }}>{obj.FIELD}</Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {gridSummary.map((items, indexs) => (
              <Grid item xs={12} sm={6} md={12} lg={4} key={indexs}>
                <Card
                  component={motion.div}
                  initial={{ x: -500 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.3, bounceDamping: 0 }}
                  sx={{ maxHeight: '350px' }}
                >
                  <CardContent>
                    <div className="flex mb-12 justify-between">
                      <div className="flex">
                        <FuseSvgIcon size={30} style={{ color: items.iconColor }}>
                          {items.icon}
                        </FuseSvgIcon>
                        <div className="ml-12 flex items-center">
                          <Typography className="text-xl">{items.title}</Typography>
                        </div>
                      </div>
                      <FuseSvgIcon
                        className="rounded-md hover:bg-gray-300"
                        size={30}
                        style={{ color: '#00000' }}
                        onClick={() => Handle(indexs)}
                      >
                        material-twotone:preview
                      </FuseSvgIcon>
                    </div>
                    <hr className="mb-12" />
                    <DataTable
                      className="rounded h-[270px]"
                      columns={items.headers.map((obj) =>
                        createDataGridHeader(
                          obj.field,
                          obj.headerName,
                          obj.width,
                          obj.flex,
                          obj.minWidth
                        )
                      )}
                      pageSize={10}
                      rowsPerPageOptions={[5, 10, 25]}
                      rows={
                        items.tableBody === null
                          ? []
                          : items.tableBody.map((item, index) => ({
                              id: index,
                              ...item,
                            }))
                      }
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <PreviewModal
        open={open}
        gridSummary={gridSummary}
        clickedItem={clickedItems}
        handleClose={handleClose}
      />
    </div>
  );
};
export default withReducer('dashboard', reducer)(AgencyDashboard);
