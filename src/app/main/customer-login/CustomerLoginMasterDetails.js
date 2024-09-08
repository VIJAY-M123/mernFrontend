import { Add, Delete, Edit, NavigateNext } from '@mui/icons-material';
import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ComboBox from 'app/shared-components/ComboBox';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import DataTable from 'app/shared-components/DataTable';
import utils from 'src/@utils';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { setAlert } from 'app/store/viewerSlice';
import AlertDialog from 'app/shared-components/AlertDialog';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';

import { selectUser } from 'app/store/userSlice';
import { selectAgency } from 'app/store/agencySlice';
import customerLoginService from './service';

const { createDataGridHeader } = utils;

const partyHeaders = [
  createDataGridHeader('CS_PARTY_CODE', 'Party Type', 0, 1, 150),
  createDataGridHeader('CS_SHIPPER_CODE', 'Party Name', 0, 1, 150),
  createDataGridHeader('CS_NOTES', 'Notes', 0, 1, 150),
  createDataGridHeader('action', 'Action', 0, 1, 150),
];

const schemaObj = yup.object().shape({
  userCode: yup.string().trim().required('You must enter User Code'),
  userName: yup.string().trim().required('You must enter User Name'),
  userPass: yup.string().trim(),
  customer: yup.object().nullable().required('You must select Customer'),
  bookingParty: yup.object().nullable(),
  status: yup.object().nullable().required('You must select Status'),
  role: yup.object().nullable(),
  depot: yup.object().nullable(),
  onlineBooking: yup.object().nullable(),
  driverDetails: yup.object().nullable(),
  vendor: yup.object().nullable(),
  agency: yup.object().nullable(),
  notes: yup.string().trim(),
  partyType: yup.object().nullable(),
  partyName: yup.object().nullable(),
  partyNotes: yup.string().trim(),
});

const defaultValues = {
  userCode: '',
  userName: '',
  userPass: '',
  customer: null,
  bookingParty: null,
  status: { ref_code: 'A', ref_name: 'ACTIVE' },
  role: null,
  depot: null,
  onlineBooking: null,
  driverDetails: null,
  vendor: null,
  agency: null,
  notes: '',

  partyType: null,
  partyName: null,
  partyNotes: '',
};

const CustomerLoginMasterDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const agency = useSelector(selectAgency);
  const user = useSelector(selectUser);

  const [driverName, setDriverName] = useState({ drv_cp_id: agency?.cp_id });
  const [shipperDetails, setShipperDetails] = useState({ state: null, data: [] });

  const [customer, setCustomer] = useState({});
  const [bookingParty, setBookingParty] = useState({});
  const [party, setParty] = useState({});

  const { control, getValues, formState, handleSubmit, setError, setValue, clearErrors, reset } =
    useForm({
      mode: 'onChange',
      defaultValues,
      resolver: yupResolver(schemaObj),
    });

  const { errors } = formState;

  useEffect(() => {
    if (id) {
      dispatch(showLoader());
      customerLoginService
        .getSelectedCustomerLoginDetails({ CL_ID: +id })
        .then((res) => {
          dispatch(hideLoader());
          res = res.at(0);
          reset({
            ...defaultValues,
            userCode: res.CL_USER_CODE || '',
            userName: res.CL_USER_NAME || '',
            userPass: res.CL_USER_PASS || '',
            customer: res.CL_AR_ID && {
              ar_id: res.CL_AR_ID,
              ar_name: res.CL_AR_CODE,
            },
            bookingParty: res.CL_BP_ID && {
              ar_id: res.CL_BP_ID,
              ar_name: res.CL_BP_CODE,
            },
            status: res.CL_STATUS && {
              ref_code: res.CL_STATUS,
              ref_name: res.CL_STATUS_CODE,
            },
            role: res.CL_USER_ROLE && {
              gm_id: res.CL_USER_ROLE,
              gm_name: res.CL_USER_ROLE_CODE,
            },
            depot: res.CL_DP_ID && {
              DP_ID: res.CL_DP_ID,
              DP_NAME: res.CL_DP_CODE,
            },
            onlineBooking: res.CL_ONLINE_BKG && {
              ref_code: res.CL_ONLINE_BKG,
              ref_name: res.CL_ONLINE_BKG_CODE,
            },
            driverDetails: res.CL_DRV_ID && {
              DRV_ID: res.CL_DRV_ID,
              DRV_NAME: res.CL_DRV_CODE,
            },
            vendor: res.CL_AP_ID && {
              AP_ID: res.CL_AP_ID,
              AP_NAME: res.CL_AP_CODE,
            },
            agency: res.CL_CP_ID && {
              CP_ID: res.CL_CP_ID,
              CP_CODE: res.CL_CP_CODE,
            },
            notes: res.CL_NOTES || '',
          });
          setShipperDetails({ state: null, data: res.CUS_XML || [] });

          if (!user.data.super_user === 'Y' && res.CL_CP_ID !== agency?.cp_id) {
            dispatch(
              showMessage({ message: 'Data not available for selected Agency', variant: 'error' })
            );
            navigate('/masters/customer-login');
          }
        })
        .catch((message) => {
          dispatch(hideLoader());
          dispatch(showMessage({ message, variant: 'error' }));
        });
    } else {
      reset(defaultValues);
      setShipperDetails({ state: null, data: [] });
      setDriverName({ drv_cp_id: agency?.cp_id });
    }
  }, [agency, dispatch, id, navigate, reset, user.data.super_user]);

  // error navigate and agency set
  useEffect(() => {
    const firstError = Object.keys(errors).reduce((field, a) => {
      return errors[field] ? field : a;
    }, null);

    const element = document.getElementsByName(firstError)[0];

    element?.focus();
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [errors, getValues, setValue]);

  const handleDriverInputChange = (v) => {
    setDriverName({
      drv_cp_id: agency?.cp_id,
      drv_name: v,
      start: 1,
      length: v?.length,
    });
  };

  const handleShipperDetails = () => {
    const { partyName, partyType, partyNotes } = getValues();
    const fields = [
      { field: 'partyType', message: 'select Party Type' },
      { field: 'partyName', message: 'select Party Name' },
      { field: 'partyNotes', message: 'enter Notes' },
    ];

    const valid = fields
      .slice(0, 2)
      .map(({ field, message }) => {
        const value = getValues(field);
        if (!value) {
          setError(field, { type: 'manual', message: `You must ${message}` });
          return false;
        }
        return true;
      })
      .every((e) => e);

    if (!valid) return;

    const newData = {
      CS_PARTY: partyType?.ref_code,
      CS_PARTY_CODE: partyType?.ref_name,
      CS_SHIPPER_ID: partyName?.ar_id,
      CS_SHIPPER_CODE: partyName?.ar_name,
      CS_NOTES: partyNotes,
    };
    const newRows = [...shipperDetails.data];

    const index = shipperDetails.data.indexOf(shipperDetails.state);

    if (index >= 0) {
      const oldRow = newRows[index];
      newRows[index] = { ...oldRow, ...newData };
    } else {
      newRows.push(newData);
    }
    setShipperDetails({ state: null, data: newRows });

    fields.forEach((f) => {
      setValue(f.field, defaultValues[f.field]);
      clearErrors(f.field);
    });
  };

  const handleEditShipperDetails = (data) => {
    setShipperDetails((c) => ({ ...c, state: data }));
    setValue(
      'partyType',
      data.CS_PARTY && {
        ref_code: data.CS_PARTY,
        ref_name: data.CS_PARTY_CODE,
      }
    );
    setValue(
      'partyName',
      data.CS_SHIPPER_ID && {
        ar_id: data.CS_SHIPPER_ID,
        ar_name: data.CS_SHIPPER_CODE,
      }
    );
    setValue('partyNotes', data.CS_NOTES);
  };

  const handleDeleteShipperDetails = (data, index) => {
    if (shipperDetails.data.indexOf(shipperDetails.state) === index) {
      dispatch(showMessage({ message: "You can't delete in edit mode", variant: 'error' }));
      return;
    }
    dispatch(
      setAlert({
        state: true,
        title: 'Action required',
        content: 'Are you sure to delete this row?',
        handleAgree() {
          dispatch(setAlert({ state: false }));
          const newData = shipperDetails.data.filter((d, i) => i !== index);
          setShipperDetails((prev) => ({ ...prev, data: newData }));
        },
      })
    );
  };

  const onSubmit = (data) => {
    data.cp_id = agency?.cp_id;
    data.user_id = user.data.user_id;
    data.shipperDetails = shipperDetails.data;

    dispatch(showLoader());
    if (!location.pathname?.match(/copy|new/i)) {
      data.CL_ID = id;
      customerLoginService
        .putCustomerLogin(data)
        .then((message) => {
          dispatch(hideLoader());
          dispatch(showMessage({ message, variant: 'success' }));
          navigate(-1);
        })
        .catch((message) => {
          dispatch(hideLoader());
          dispatch(showMessage({ message, variant: 'error' }));
        });
      return;
    }

    customerLoginService
      .postCustomerLogin(data)
      .then((message) => {
        dispatch(hideLoader());
        dispatch(showMessage({ message, variant: 'success' }));
        navigate(-1);
      })
      .catch((message) => {
        dispatch(hideLoader());
        dispatch(showMessage({ message, variant: 'error' }));
      });
  };

  return (
    <div className="p-24">
      <div className="flex items-center justify-between sm:items-start space-y-8 sm:space-y-0 sm:mb-24 mb-16">
        <motion.span
          className="flex items-end"
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
        >
          <Typography
            component={Link}
            to="/masters/customer-login"
            className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
            role="button"
          >
            Customer Login Master
          </Typography>

          <Breadcrumbs
            aria-label="breadcrumb"
            className="mx-12"
            separator={<NavigateNext fontSize="small" />}
          >
            <div />
            <Typography>{id ? 'View' : 'New'}</Typography>
          </Breadcrumbs>
        </motion.span>
      </div>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-12">
          <CardContent>
            <Typography className="mb-12" variant="h6">
              Customer Details
            </Typography>
            <hr className="mb-12" />
            <Grid container spacing={2}>
              <Grid item md={3}>
                <Controller
                  name="userCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="User Code"
                      className="mb-12"
                      fullWidth
                      required
                      error={!!errors.userCode}
                      helperText={errors.userCode?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="userName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="User Name"
                      className="mb-12"
                      fullWidth
                      required
                      error={!!errors.userName}
                      helperText={errors.userName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="userPass"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="User Pass"
                      className="mb-12"
                      fullWidth
                      error={!!errors.userPass}
                      helperText={errors.userPass?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="customer"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Customer"
                      className="mb-12 w-full"
                      url={jwtServiceConfig.listCustomer}
                      data={customer}
                      required
                      type="autocomplete"
                      error={!!errors.customer}
                      helperText={errors.customer?.message}
                      valueExpr="ar_id"
                      displayExpr="ar_name"
                      onInputChange={(d) => {
                        setCustomer({
                          // cp_id: user.data.super_user === 'Y' ? null : agency?.cp_id,
                          ar_name: d || null,
                          START: 1,
                          LENGTH: d?.length,
                        });
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="bookingParty"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Booking Party"
                      className="mb-12 w-full"
                      url={jwtServiceConfig.listCustomer}
                      data={bookingParty}
                      type="autocomplete"
                      error={!!errors.bookingParty}
                      helperText={errors.bookingParty?.message}
                      valueExpr="ar_id"
                      displayExpr="ar_name"
                      onInputChange={(d) =>
                        setBookingParty({
                          // cp_id: user.data.super_user === 'Y' ? null : agency?.cp_id,
                          ar_name: d || null,
                          START: 1,
                          LENGTH: d?.length,
                        })
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Status"
                      className="mb-12 w-full"
                      required
                      url={jwtServiceConfig.refCode}
                      data={{ FIELD: 'STATUS', PROGRAM: 'CSD001' }}
                      error={!!errors.status}
                      helperText={errors.status?.message}
                      valueExpr="ref_code"
                      displayExpr="ref_name"
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Role"
                      className="mb-12 w-full"
                      url={jwtServiceConfig.listGeneralMaster}
                      data={{ GM_REFERENCE_CODE: 'CL_USER_ROLE' }}
                      error={!!errors.role}
                      helperText={errors.role?.message}
                      valueExpr="gm_id"
                      displayExpr="gm_name"
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="depot"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Depot"
                      className="mb-12 w-full"
                      url={jwtServiceConfig.getDepot}
                      data={{}}
                      error={!!errors.depot}
                      helperText={errors.depot?.message}
                      valueExpr="DP_ID"
                      displayExpr="DP_NAME"
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="onlineBooking"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Online Booking"
                      className="mb-12 w-full"
                      url={jwtServiceConfig.refCode}
                      data={{ FIELD: 'ONLINE_BKG', PROGRAM: 'CSD001' }}
                      error={!!errors.onlineBooking}
                      helperText={errors.onlineBooking?.message}
                      valueExpr="ref_code"
                      displayExpr="ref_name"
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="driverDetails"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Driver Name"
                      className="mb-12 w-full"
                      type="autocomplete"
                      url={jwtServiceConfig.getDriverMaster}
                      data={driverName}
                      error={!!errors.driverDetails}
                      helperText={errors.driverDetails?.message}
                      reload
                      valueExpr="DRV_ID"
                      displayExpr="DRV_NAME"
                      onInputChange={(v) => handleDriverInputChange(v)}
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="vendor"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Vendor"
                      className="mb-12 w-full"
                      url={jwtServiceConfig.getVendor}
                      data={{}}
                      error={!!errors.vendor}
                      helperText={errors.vendor?.message}
                      valueExpr="AP_ID"
                      displayExpr="AP_NAME"
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="agency"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Agency"
                      className="mb-12 w-full"
                      url={jwtServiceConfig.getCompany}
                      data={{}}
                      error={!!errors.agency}
                      helperText={errors.agency?.message}
                      valueExpr="CP_ID"
                      displayExpr="CP_CODE"
                    />
                  )}
                />
              </Grid>
              <Grid item md={6}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes"
                      multiline
                      rows={2}
                      className="mb-12"
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardContent>
            <Typography variant="h6" className="mb-12">
              Customer Shipper Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <Controller
                  name="partyType"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Party Type"
                      className="mb-12 w-full"
                      url={jwtServiceConfig.refCode}
                      data={{ PROGRAM: 'CSD001', FIELD: 'PARTY' }}
                      error={!!errors.partyType}
                      helperText={errors.partyType?.message}
                      valueExpr="ref_code"
                      displayExpr="ref_name"
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="partyName"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Party Name"
                      className="mb-12 w-full"
                      type="autocomplete"
                      url={jwtServiceConfig.listCustomer}
                      data={party}
                      error={!!errors.partyName}
                      helperText={errors.partyName?.message}
                      valueExpr="ar_id"
                      displayExpr="ar_name"
                      onInputChange={(d) =>
                        setParty({
                          ar_name: d || null,
                          START: 1,
                          LENGTH: d?.length,
                        })
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="partyNotes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes"
                      className="mb-12"
                      fullWidth
                      error={!!errors.partyNotes}
                      helperText={errors.partyNotes?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <div className="flex flex-end items-center justify-center">
                  <Button
                    className="rounded mb-12"
                    variant="contained"
                    onClick={handleShipperDetails}
                    startIcon={!shipperDetails.state && <Add />}
                    color="primary"
                  >
                    {shipperDetails.state ? 'Update' : 'Add'}
                  </Button>
                </div>
              </Grid>
            </Grid>
            <DataTable
              className="mb-12"
              columns={partyHeaders}
              rowsPerPageOptions={[5, 10, 25]}
              rows={shipperDetails.data.map((data, index) => ({
                ...data,
                id: index,
                action: (
                  <>
                    <IconButton color="primary" onClick={() => handleEditShipperDetails(data)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteShipperDetails(data, index)}
                    >
                      <Delete />
                    </IconButton>
                  </>
                ),
              }))}
              disableSelectionOnClick
              pageSize={10}
            />
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end gap-6">
          {!id && (
            <Button
              variant="contained"
              className="rounded"
              color="error"
              onClick={() => {
                reset();
                setShipperDetails({ state: null, data: [] });
              }}
            >
              Clear
            </Button>
          )}
          <Button variant="contained" className="rounded" color="primary" type="submit">
            Submit
          </Button>
        </div>
        <AlertDialog />
      </form>
    </div>
  );
};
export default CustomerLoginMasterDetails;
