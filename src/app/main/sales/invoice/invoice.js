import { yupResolver } from '@hookform/resolvers/yup';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Grid, Menu, MenuItem, Tab, Typography } from '@mui/material';
import DataTable from 'app/shared-components/DataTable';
import BasicDatePicker from 'app/shared-components/DatePicker';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import utils from 'src/@utils';
import Unpaid from './unPaid';
import Paid from './paid';
import PartiallyPaid from './partiallyPaid';

const { createDataGridHeader } = utils;

const schema = {};
const defaultValues = {};

const invoiceData = [
  {
    InvNo: '1',
    Date: '19-08-1999',
    BuyerName: 'Prowesstics IT Service',
    DueIn: '--',
    Amount: '1000',
    Status: 'Paid',
    Action: '',
  },
  {
    InvNo: '2',
    Date: '19-08-1999',
    BuyerName: 'BlueBase',
    DueIn: '--',
    Amount: '1000',
    Status: 'Un-Paid',
    Action: '',
  },
];

const headers = [
  createDataGridHeader('InvNo', 'Invoice No', 0, 1, 150),
  createDataGridHeader('Date', 'Date', 0, 1, 150),
  createDataGridHeader('BuyerName', 'Buyer Name', 0, 1, 150),
  createDataGridHeader('DueIn', 'Due In', 0, 1, 150),
  createDataGridHeader('Amount', 'Amount', 0, 1, 150),
  createDataGridHeader('Status', 'Status', 0, 1, 50),
  createDataGridHeader('Action', 'Action', 0, 1, 150),
];

export default function Invoice() {
  const [value, setValue] = useState('1');
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);

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
          <Grid item xs={12} lg={5.2}>
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
            lg={1.8}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '-15px',
            }}
          >
            <Button startIcon={<AddIcon />} variant="contained" className="rounded-md bg-[#1aa194]">
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
            <div className="flex gap-6 justify-end mb-6">
              <Button
                variant="contained"
                className="rounded-md"
                startIcon={<FilterAltOutlinedIcon />}
              >
                Filters
              </Button>
              <Button
                variant="contained"
                className="rounded-md"
                startIcon={<FilterListOutlinedIcon />}
              >
                Sort by
              </Button>
            </div>
            <DataTable
              className="rounded h-[270px]"
              columns={headers}
              rows={invoiceData?.map((obj, index) => ({
                ...obj,
                id: index,
                Status: (
                  <div>
                    {obj?.Status === 'Paid' ? (
                      <Button
                        sx={{
                          minHeight: '20px',
                          maxHeight: '20px',
                          fontSize: '10px',
                        }}
                        variant="contanied"
                        className="rounded-md bg-green-100 text-green-500 font-medium"
                      >
                        Paid
                      </Button>
                    ) : (
                      <div>
                        <Button
                          className="rounded-md bg-red-300"
                          // variant="contained"
                          disableElevation
                          onClick={(e) => setStatusAnchorEl(e.currentTarget)}
                          endIcon={<KeyboardArrowDownIcon />}
                          sx={{
                            minHeight: '20px',
                            maxHeight: '20px',
                            fontSize: '10px',
                          }}
                        >
                          <div>Un-Paid</div>
                        </Button>
                        <Menu
                          id="bill-type-menu"
                          anchorEl={statusAnchorEl}
                          open={!!statusAnchorEl}
                          onClose={() => setStatusAnchorEl(null)}
                          PaperProps={{ style: { width: '24ch' } }}
                        >
                          <MenuItem

                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            Paid
                          </MenuItem>
                          <MenuItem
                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            Cancelled
                          </MenuItem>
                          <MenuItem
                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            Partially Paid
                          </MenuItem>
                        </Menu>
                      </div>
                    )}
                  </div>
                ),
                Action: (
                  <>
                    <div className="flex gap-6">
                      {/* <Button variant="contained">Record Payment</Button> */}
                      <div>
                        <Button
                          className="bg-gray-500 min-h-24 max-h-24 min-w-28 max-w-28 rounded-sm w-"
                          // variant="contained"
                          disableElevation
                          onClick={(e) => setActionAnchorEl(e.currentTarget)}
                          // endIcon={<KeyboardArrowDownIcon />}
                          // sx={{
                          //   minHeight: '20px',
                          //   maxHeight: '20px',
                          //   fontSize: '10px',
                          // }}
                        >
                          <MoreVertIcon />
                        </Button>
                        <Menu
                          id="bill-type-menu"
                          anchorEl={actionAnchorEl}
                          open={!!actionAnchorEl}
                          onClose={() => setActionAnchorEl(null)}
                          PaperProps={{ style: { width: '30ch' } }}
                        >
                          <MenuItem
                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            <div className="flex gap-6">
                              <div>
                                <LocalPrintshopOutlinedIcon />
                              </div>
                              <div>Print Invoice</div>
                            </div>
                          </MenuItem>
                          <MenuItem
                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            <div className="flex gap-6">
                              <div>
                                <DriveFileRenameOutlineIcon />
                              </div>
                              <div>Edit Invoice</div>
                            </div>
                          </MenuItem>
                          <MenuItem
                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            <div className="flex gap-6">
                              <div>
                                <EmailOutlinedIcon />
                              </div>
                              <div>Send Email</div>
                            </div>
                          </MenuItem>
                          <MenuItem
                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            <div className="flex gap-6">
                              <div>
                                <EmailOutlinedIcon />
                              </div>
                              <div>Send Payment Remainder</div>
                            </div>
                          </MenuItem>
                          <MenuItem
                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            <div className="flex gap-6">
                              <div>
                                <LocalPrintshopOutlinedIcon />
                              </div>
                              <div>Duplicate PDF</div>
                            </div>
                          </MenuItem>
                          <MenuItem
                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            <div className="flex gap-6">
                              <div>
                                <LocalPrintshopOutlinedIcon />
                              </div>
                              <div>Triplicate PDF</div>
                            </div>
                          </MenuItem>
                          <MenuItem
                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            <div className="flex gap-6">
                              <div>
                                <ContentCopyOutlinedIcon />
                              </div>
                              <div>Duplicate</div>
                            </div>
                          </MenuItem>
                          <MenuItem
                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            <div className="flex gap-6">
                              <div>
                                <DeleteOutlineOutlinedIcon />
                              </div>
                              <div>Delete Invoice</div>
                            </div>
                          </MenuItem>
                          <MenuItem
                          // key={index}
                          // selected={option.ref_code === bankOption?.ref_code}
                          // onClick={() => handleBankStatementSelected(option)}
                          >
                            <div className="flex gap-6">
                              <div>
                                <CancelOutlinedIcon />
                              </div>
                              <div>Cancelled Invoice</div>
                            </div>
                          </MenuItem>
                        </Menu>
                      </div>
                      <Button
                        variant="contained"
                        className="bg-gray-500 min-h-24 max-h-24 min-w-20 max-w-20 rounded-sm"
                      >
                        <SaveAltIcon sx={{ fontSize: '20px' }} />
                      </Button>
                    </div>
                  </>
                ),
              }))}
              disableSelectionOnClick
              rowsPerPageOptions={[5, 10, 25]}
              pageSize={10}
            />
          </TabPanel>
          <TabPanel value="2">
            <Unpaid />
          </TabPanel>
          <TabPanel value="3">
            <Paid />
          </TabPanel>
          <TabPanel value="4">
            <PartiallyPaid />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
