import * as yup from 'yup';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BasicDatePicker from 'app/shared-components/DatePicker';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import ComboBox from 'app/shared-components/ComboBox';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { useState } from 'react';
import DataTable from 'app/shared-components/DataTable';
import utils from 'src/@utils';
import reportsService from './service';

const { createDataGridHeader, getDate } = utils;

const schema = yup.object().shape({
  customerName: yup.object().nullable(),
  fromDate: yup
    .date()
    .nullable()
    .required('You must Select From Date')
    .typeError('You must enter a valid date'),
  toDate: yup
    .date()
    .nullable()
    .required('You must Select To Date')
    .typeError('You must enter a valid date')
    .test((value, ctx) => {
      const { fromDate } = ctx.parent;
      if (value && fromDate > value) {
        return ctx.createError({ message: 'To Date must be greater than Start Date' });
      }
      return true;
    }),
  customerType: yup
    .object()
    .nullable()
    .test((value, ctx) => {
      const { customerName } = ctx.parent;
      if (!value && customerName) {
        return ctx.createError({ message: 'You must select Customer Type' });
      }
      return true;
    }),
});

const defaultValues = {
  customerName: null,
  fromDate: null,
  toDate: null,
  customerType: null,
};

const MisReport = () => {
  const dispatch = useDispatch();

  const [nameData, setNameData] = useState({});
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const { control, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const handleName = (d) => {
    const newData = {
      ar_name: d,
      start: 1,
      length: d?.length,
    };
    setNameData(newData);
  };

  const onSubmit = ({ customerName, fromDate, toDate, customerType }) => {
    const data = {
      rpt_report_code: 'LOR004_REP',
      dt_type1: 'I',
      var1: '@LR_FROM_AR_ID',
      int1: customerName?.ar_id,
      dt_type2: 'D',
      var2: '@LR_FROM_DATE',
      date_2: fromDate.toDateString(),
      dt_type3: 'D',
      var3: '@LR_TO_DATE',
      date_3: toDate.toDateString(),
      dt_type4: 'V',
      var4: '@LR_AR_TYPE',
      Str4: customerType?.ref_code,
    };

    dispatch(showLoader());
    reportsService
      .getGridReport(data)
      .then((res) => {
        dispatch(hideLoader());
        setRows(res.map((e, id) => ({ id, ...e })));

        if (res.length === 0) {
          dispatch(showMessage({ message: 'No data to display', variant: 'info' }));
          return;
        }

        setColumns(
          Object.keys(res.at(0)).map((c) =>
            createDataGridHeader(c, c, 0, 1, Math.max(c.length * 14, 50))
          )
        );
      })
      .catch((message) => {
        console.log(message);
        setRows([]);
        dispatch(hideLoader());
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
      });
  };

  return (
    <Box className="p-24">
      <Typography variant="h5" className="font-bold">
        MIS Report
      </Typography>
      <Divider className="my-12" />
      <Card className="rounded-lg mb-24">
        <CardContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="customerName"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      className="mb-12"
                      label="Customer Name"
                      type="autocomplete"
                      error={!!errors.customerName}
                      helperText={errors.customerName?.message}
                      url={jwtServiceConfig.listCustomer}
                      data={nameData}
                      onInputChange={(d) => handleName(d)}
                      displayExpr="ar_name"
                      valueExpr="ar_id"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="fromDate"
                  control={control}
                  render={({ field }) => (
                    <BasicDatePicker
                      field={field}
                      required
                      className="xs:mb-12"
                      label="From Date"
                      error={!!errors.fromDate}
                      helperText={errors.fromDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="toDate"
                  control={control}
                  render={({ field }) => (
                    <BasicDatePicker
                      field={field}
                      required
                      className="xs:mb-12"
                      label="To Date"
                      error={!!errors.toDate}
                      helperText={errors.toDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="customerType"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Customer Type"
                      error={!!errors.customerType}
                      helperText={errors.customerType?.message}
                      url={jwtServiceConfig.refCode}
                      data={{ PROGRAM: 'LR0001', FIELD: 'BILL_TO' }}
                      displayExpr="ref_name"
                      valueExpr="ref_code"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="flex items-center justify-center">
                  <Button
                    variant="contained"
                    color="primary"
                    className="rounded mt-6"
                    type="submit"
                  >
                    submit
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      {rows.length > 0 && (
        <DataTable
          className="rounded"
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          disableSelectionOnClick
          rows={rows}
          exportCsv
          fileName={`MIS${getDate()}`}
        />
      )}
    </Box>
  );
};

export default MisReport;
