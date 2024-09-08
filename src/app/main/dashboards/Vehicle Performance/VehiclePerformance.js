import { Button, Card, CardContent, Grid } from '@mui/material';
import utils from 'src/@utils';
import DataTable from 'app/shared-components/DataTable';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Controller, useForm } from 'react-hook-form';
import BasicDatePicker from 'app/shared-components/DatePicker';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { manual } from 'prismjs';
import ComboBox from 'app/shared-components/ComboBox';
import { useDispatch, useSelector } from 'react-redux';
import { selectAgency } from 'app/store/agencySlice';
import { selectUser } from 'app/store/userSlice';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { showMessage } from 'app/store/fuse/messageSlice';
import DashboardService from '../service';
import { selectFilterData, setfilterData } from '../store/dashboardSlice';

const { createDataGridHeader, fixArrayDates, getDate } = utils;

const defaultValues = {
  fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  vehicleNumber: null,
  vehicleType: null,
};

const schema = yup.object().shape({
  fromDate: yup
    .date()
    .nullable()
    .required('You must select the from date')
    .typeError('You must enter a valid date')
    .max(new Date(), 'Future dates are not allowed'),
  toDate: yup
    .date()
    .nullable()
    .required('You must select the to date')
    .typeError('You must enter a valid date')
    .test((value, ctx) => {
      const { fromDate } = ctx.parent;
      if (value && fromDate > value) {
        return ctx.createError({ message: 'End Date must be greater than Start Date' });
      }
      return true;
    }),
  vehicleNumber: yup.object().nullable(),
  vehicleType: yup.object().nullable(),
});

function VehiclePerformance() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const agency = useSelector(selectAgency);
  const user = useSelector(selectUser);
  const filterData = useSelector(selectFilterData);

  const [anchorEl, setAnchorEl] = useState(null);
  const [vehiclePerformance, setvehiclePerformance] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState({});

  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;

  const { handleSubmit, control, formState, setError, reset, getValues, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const fetchData = useCallback(
    (d) => {
      const data = { ...d };
      data.cp_id = agency?.cp_id;
      data.user_id = user.data.user_id;

      DashboardService.getVehiclePerformance(data)
        .then((res) => {
          setvehiclePerformance(res);
          if (res.length === 0) {
            dispatch(showMessage({ message: 'No data to display', variant: 'info' }));
            // return;
          }
        })
        .catch((err) => console.log(err));
    },
    [agency?.cp_id, dispatch, user.data.user_id]
  );

  useEffect(() => {
    if (filterData) {
      fetchData(filterData);
      reset({
        fromDate: filterData.fromDate,
        toDate: filterData.toDate,
        vehicleNumber: filterData.vehicleNumber?.TRK_GM_ID && {
          TRK_NUMBER: filterData.vehicleNumber?.TRK_NUMBER,
          TRK_ID: filterData.vehicleNumber?.TRK_GM_ID,
        },
        vehicleType: filterData.vehicleType?.gm_id && {
          gm_name_code: filterData.vehicleType?.gm_name_code,
          gm_id: filterData.vehicleType?.gm_id,
        },
      });
    } else {
      const data = {
        cp_id: agency?.cp_id,
        user_id: user.data.user_id,
        fromDate: getValues('fromDate'),
        toDate: getValues('toDate'),
      };
      DashboardService.getVehiclePerformance(data)
        .then((res) => {
          setvehiclePerformance(res);
          if (res.length === 0) {
            dispatch(showMessage({ message: 'No data to display', variant: 'info' }));
            // return;
          }
        })
        .catch((err) => console.log(err));
    }
  }, [agency?.cp_id, dispatch, fetchData, filterData, getValues, reset, user.data.user_id]);

  const onClick = (index) => {
    navigate('/dashboard/vehicle-dashboard', {
      state: { id: index.row, fromDates: getValues('fromDate'), toDates: getValues('toDate') },
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleVehicleTypeChange = (s) => {
    console.log(s);
    setVehicleNumber({
      trk_gm_id: s?.gm_id || 0,
      trk_status: 'A',
      // trk_cp_id: agency?.cp_id,
    });
    if (!s) {
      setValue('vehicleNumber', null);
      setVehicleNumber({});
    }
  };

  const handleTruckNumberInputChange = (data) => {
    const newData = {
      trk_gm_id: getValues('vehicleType')?.gm_id,
      trk_status: 'A',
      trk_cp_id: agency?.cp_id,
    };
    setVehicleNumber(newData);
  };

  const onSubmit = (data) => {
    if (data.fromDate && !data.toDate) {
      setError('toDate', { type: manual, message: 'You must select to date' });
    }
    dispatch(setfilterData(data));

    fetchData(data);
    handleClose();
  };

  return (
    <div className="p-24">
      <div className="mb-12 flex justify-between">
        <div>
          <h1>Dashboard</h1>
        </div>
        <div>
          <Button
            id="bill-type-button"
            aria-controls={open ? 'bill-type-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="contained"
            disableElevation
            onClick={handleClick}
            endIcon={<FilterAltIcon />}
          >
            Filter
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 7.5,
                width: 'auto',
              },
            }}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem>
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="fromDate"
                  control={control}
                  render={({ field }) => (
                    <BasicDatePicker
                      field={field}
                      disableFuture
                      className="mb-12 w-full"
                      label="From Date"
                      required
                      error={!!errors.fromDate}
                      helperText={errors.fromDate?.message}
                      // value={selectedFromDate}
                      // onChange={(date) => {
                      //   setSelectedFromDate(date);
                      //   field.onChange(date);
                      // }}
                    />
                  )}
                />
                <Controller
                  name="toDate"
                  control={control}
                  render={({ field }) => (
                    <BasicDatePicker
                      field={field}
                      // disableFuture
                      className="mb-12 w-full"
                      label="To Date"
                      required
                      error={!!errors.toDate}
                      helperText={errors.toDate?.message}
                      // value={selectedToDate}
                      // onChange={(date) => {
                      //   setSelectedToDate(date);
                      //   field.onChange(date);
                      // }}
                    />
                  )}
                />
                <Controller
                  name="vehicleType"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      className="mb-12 w-full"
                      label="Vehicle Type"
                      url={jwtServiceConfig.listGeneralMaster}
                      data={{ GM_REFERENCE_CODE: 'TRUCK_SIZE_TYPE', GM_STATUS: 'A' }}
                      error={!!errors.vehicleType}
                      helperText={errors.vehicleType?.message}
                      displayExpr="gm_name_code"
                      valueExpr="gm_id"
                      handleChange={(v) => handleVehicleTypeChange(v)}
                    />
                  )}
                />
                <Controller
                  name="vehicleNumber"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      className="mb-12 w-full"
                      label="Vehicle Number"
                      type="autocomplete"
                      url={jwtServiceConfig.getTruckMaster}
                      data={vehicleNumber}
                      error={!!errors.vehicleNumber}
                      helperText={errors.vehicleNumber?.message}
                      displayExpr="TRK_NUMBER"
                      valueExpr="TRK_ID"
                      // handleChange={(v) => handleVehicleNumberNameChange(v)}
                      onInputChange={(v) => handleTruckNumberInputChange(v)}
                    />
                  )}
                />
                <Button
                  className="bg-cyan-400 text-white hover:bg-black"
                  type="submit"
                  variant="contained"
                >
                  Apply
                </Button>
              </form>
            </MenuItem>
          </Menu>
        </div>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card
            component={motion.div}
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, bounceDamping: 0 }}
          >
            <CardContent>
              <DataTable
                className="rounded h-[500px]"
                columns={
                  vehiclePerformance && vehiclePerformance.length > 0
                    ? Object.keys(vehiclePerformance[0]).map((key) =>
                        createDataGridHeader(key, key, 1, 0, 150)
                      )
                    : [] // Provide a default empty array if vehiclePerformance is undefined or empty
                }
                pageSize={10}
                exportCsv
                fileName={`${'Dashboard'}${getDate()}`}
                onRowClick={(e) => onClick(e)}
                rowsPerPageOptions={[5, 10, 25]}
                rows={
                  vehiclePerformance === null
                    ? []
                    : vehiclePerformance?.map((item, index) => ({
                        id: index,
                        ...item,
                      }))
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default VehiclePerformance;
