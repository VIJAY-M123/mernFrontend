import * as yup from 'yup';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BasicDatePicker from 'app/shared-components/DatePicker';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useState } from 'react';
import utils from 'src/@utils';
import DataTable from 'app/shared-components/DataTable';
import ComboBox from 'app/shared-components/ComboBox';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import reportsService from './service';

const { createDataGridHeader, getDate } = utils;

const schema = yup.object().shape({
  agency: yup.object().nullable(),
  fromDate: yup.date().nullable().typeError('You must enter a valid date'),
  toDate: yup
    .date()
    .nullable()
    .typeError('You must enter a valid date')
    .test((value, ctx) => {
      const { fromDate } = ctx.parent;
      if (value && fromDate > value) {
        return ctx.createError({ message: 'To Date must be greater than Start Date' });
      }
      return true;
    }),
  lrNumber: yup.object().nullable(),
});

const defaultValues = {
  agency: null,
  fromDate: null,
  toDate: null,
  lrNumber: null,
};

const LoadRequest = () => {
  const dispatch = useDispatch();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [numberData, setNumberData] = useState({});

  const { control, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const handleNumberInput = (d) => {
    setNumberData({
      lr_number: d,
      start: 1,
      length: d?.length,
    });
  };

  const onSubmit = ({ agency, fromDate, toDate, lrNumber }) => {
    const data = {
      rpt_report_code: 'LOR003_REP',
      dt_type1: 'I',
      var1: '@LR_CP_ID',
      int1: agency?.CP_ID,
      dt_type2: 'D',
      var2: '@LR_FROM_DATE',
      date_2: fromDate?.toDateString(),
      dt_type3: 'D',
      var3: '@LR_TO_DATE',
      date_3: toDate?.toDateString(),
      dt_type4: 'V',
      var4: '@LR_ID',
      Str4: lrNumber?.LR_ID,
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
        Load Request
      </Typography>
      <Divider className="my-12" />
      <Card className="rounded-lg mb-24">
        <CardContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="agency"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      className="mb-12"
                      label="Agency"
                      error={!!errors.agency}
                      helperText={errors.agency?.message}
                      url={jwtServiceConfig.getCompany}
                      data={{}}
                      displayExpr="CP_NAME"
                      valueExpr="CP_ID"
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
                  name="lrNumber"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      type="autocomplete"
                      label="LR Number"
                      url={jwtServiceConfig.getLRNumber}
                      data={numberData}
                      error={!!errors.lrNumber}
                      helperText={errors.lrNumber?.message}
                      displayExpr="LR_NUMBER"
                      valueExpr="LR_ID"
                      onInputChange={(v) => handleNumberInput(v)}
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
          fileName={`LoadRequest${getDate()}`}
        />
      )}
    </Box>
  );
};

export default LoadRequest;
