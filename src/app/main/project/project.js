import { yupResolver } from '@hookform/resolvers/yup';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Grid, Tab, Typography } from '@mui/material';
import DataTable from 'app/shared-components/DataTable';
import BasicDatePicker from 'app/shared-components/DatePicker';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import utils from 'src/@utils';

const { createDataGridHeader } = utils;

const schema = {};
const defaultValues = {};

const headers = [
  createDataGridHeader('ARC_CUR_CODE', 'Invoice No', 0, 1, 150),
  createDataGridHeader('ARC_DEFAULT_CODE', 'Date', 0, 1, 150),
  createDataGridHeader('ARC_STATUS_CODE', 'Buyer Name', 0, 1, 150),
  createDataGridHeader('ARC_NOTES', 'Due In', 0, 1, 150),
  createDataGridHeader('action1', 'Amount', 0, 1, 150),
  createDataGridHeader('action2', 'Status', 0, 1, 150),
  createDataGridHeader('action3', 'Action', 0, 1, 150),
];

export default function Project() {
  const [value, setValue] = useState('1');

  const { control, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="p-24">
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={5.5}>
            <Typography variant="h6" className="font-bold mb-12">
              Invoice
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
          <Grid
            item
            xs={12}
            lg={1}
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
          <Grid
            item
            xs={12}
            lg={1.5}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '-15px',
            }}
          >
            <Button variant="contained" className="rounded-md">
              Create Invoice
            </Button>
          </Grid>
        </Grid>
      </form>

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label={
                  <div>
                    <Typography variant="subtitle2">Total Sales(2)</Typography>
                    <Typography variant="body2">₹ 11,000</Typography>
                  </div>
                }
                value="1"
              />
              <Tab
                label={
                  <div>
                    <Typography variant="subtitle2">Unpaid(2)</Typography>
                    <Typography variant="body2">₹ 10,000</Typography>
                  </div>
                }
                value="2"
              />
              <Tab
                label={
                  <div>
                    <Typography variant="subtitle2">Paid(1)</Typography>
                    <Typography variant="body2">₹ 10,000</Typography>
                  </div>
                }
                value="3"
              />
              <Tab
                label={
                  <div>
                    <Typography variant="subtitle2"> Partially Paid(0)</Typography>
                    <Typography variant="body2">₹ 0</Typography>
                  </div>
                }
                value="4"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <DataTable
              className="rounded h-[270px]"
              columns={headers}
              rows={[]}
              disableSelectionOnClick
              rowsPerPageOptions={[5, 10, 25]}
              pageSize={10}
            />
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
          <TabPanel value="4">Item four</TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
