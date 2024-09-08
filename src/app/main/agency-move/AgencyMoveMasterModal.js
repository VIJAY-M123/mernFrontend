import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowDropDown, Close, Delete, Edit, FileCopy } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import {
  Accordion,
  AccordionDetails,
  Button,
  Card,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import ComboBox from 'app/shared-components/ComboBox';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import utils from 'src/@utils';
import { useEffect, useState } from 'react';
import DataTable from 'app/shared-components/DataTable';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectUser } from 'app/store/userSlice';
import { selectAgency } from 'app/store/agencySlice';
import { setAlert } from 'app/store/viewerSlice';
import AlertDialog from 'app/shared-components/AlertDialog';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import agencyMoveService from './service';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  borderRadius: 2,
  p: 2,
};

const { createDataGridHeader } = utils;

const nextMoveHeaders = [
  createDataGridHeader('action', 'Action', 0, 1, 150),
  createDataGridHeader('CPM_PRV_CM_CODE', 'Move Code', 0, 1, 150),
  createDataGridHeader('CPM_REMARKS', 'Remarks', 0, 1, 150),
];

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, .03)' : theme.palette.common.black,
  color: theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white,
  '&.Mui-expanded': {
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.common.black : 'rgba(0, 0, 0, .03)',
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    '.MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.common.black,
    },
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: theme.palette.common.white,
  },
}));

const defaultValues = {
  moveCode: '',
  moveDescription: '',
  type: null,
  status: null,

  vessel: null,
  voyage: null,
  currentPort: null,
  nextPort: null,
  currentTerminal: null,
  nextTerminal: null,
  currentDepot: null,
  nextDepot: null,
  currentLocation: null,
  nextLocation: null,
  transportMode: null,
  truckNumber: null,
  bookingNumber: null,
  blNumber: null,
  rrNumber: null,
  referenceNumber: null,
  customer: null,
  vendor: null,
  customerPoNumber: null,
  doNumber: null,
  lrNumber: null,
  beNumber: null,
  invoiceNumber: null,
  jobNumber: null,
  plant: null,
  wareHouse: null,

  moveCodeNext: null,
  remarks: '',
};

const schema = yup.object().shape({
  moveCode: yup.string().trim().required('You must enter Move Code'),
  moveDescription: yup.string().trim().required('You must enter Move Description'),
  type: yup.object().nullable().required('You must select Type'),
  status: yup.object().nullable().required('You must select Status'),

  vessel: yup.object().nullable().required('You must select Vessel'),
  voyage: yup.object().nullable().required('You must select Voyage'),
  currentPort: yup.object().nullable().required('You must select Current Port'),
  nextPort: yup.object().nullable().required('You must select Next Port'),
  currentTerminal: yup.object().nullable().required('You must select Current Terminal'),
  nextTerminal: yup.object().nullable().required('You must select Next  Terminal'),
  currentDepot: yup.object().nullable().required('You must select Current Depot'),
  nextDepot: yup.object().nullable().required('You must select Next Depot'),
  currentLocation: yup.object().nullable().required('You must select Current Location'),
  nextLocation: yup.object().nullable().required('You must select Next Location'),
  transportMode: yup.object().nullable().required('You must select Transport Mode'),
  truckNumber: yup.object().nullable().required('You must select Truck Number'),
  bookingNumber: yup.object().nullable().required('You must select Booking Number'),
  blNumber: yup.object().nullable().required('You must select BL Number'),
  rrNumber: yup.object().nullable().required('You must select Release Request Number'),
  referenceNumber: yup.object().nullable().required('You must select Reference Number'),
  customer: yup.object().nullable().required('You must select Customer'),
  vendor: yup.object().nullable().required('You must select Vendor'),
  doNumber: yup.object().nullable(),
  lrNumber: yup.object().nullable(),
  beNumber: yup.object().nullable(),
  invoiceNumber: yup.object().nullable(),
  jobNumber: yup.object().nullable(),
  plant: yup.object().nullable(),
  wareHouse: yup.object().nullable(),

  moveCodeNext: yup.object().nullable(),
  remarks: yup.string().trim(),
});

const panel1 = ['moveCode', 'moveDescription', 'type', 'status'];

const panel2 = [
  'vessel',
  'voyage',
  'currentPort',
  'nextPort',
  'currentTerminal',
  'nextTerminal',
  'currentDepot',
  'nextDepot',
  'currentLocation',
  'nextLocation',
  'transportMode',
  'truckNumber',
  'bookingNumber',
  'blNumber',
  'releaseRerquestNumber',
  'referenceNumber',
  'customer',
  'vendor',
];

const AgencyMoveMasterModal = ({
  setEditData,
  filterData,
  setCopy,
  modalOpen,
  setModalOpen,
  copy,
  handleAgencyMoveData,
  editData,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const agency = useSelector(selectAgency);

  const [expanded, setExpanded] = useState('panel1');
  const [tableData, setTableData] = useState({ state: null, rows: [] });

  const { control, formState, handleSubmit, reset, getValues, setValue, setError, clearErrors } =
    useForm({
      mode: 'onChange',
      defaultValues,
      resolver: yupResolver(schema),
    });
  const { errors } = formState;

  const validationFields = [
    { id: 'vessel', name: 'Vessel', required: true },
    { id: 'voyage', name: 'Voyage', required: true },
    { id: 'currentPort', name: 'Current Port', required: true },
    { id: 'nextPort', name: 'Next Port', required: true },
    { id: 'currentTerminal', name: 'Current Terminal', required: true },
    { id: 'nextTerminal', name: 'Next Terminal', required: true },
    { id: 'currentDepot', name: 'Current Depot', required: true },
    { id: 'nextDepot', name: 'Next Depot', required: true },
    { id: 'currentLocation', name: 'Current Location', required: true },
    { id: 'nextLocation', name: 'Next Location', required: true },
    { id: 'transportMode', name: 'Transport Mode', required: true },
    { id: 'truckNumber', name: 'Truck Number', required: true },
    { id: 'bookingNumber', name: 'Booking Number', required: true },
    { id: 'blNumber', name: 'BL Number', required: true },
    { id: 'rrNumber', name: 'Release Request Number', required: true },
    { id: 'referenceNumber', name: 'Reference Number', required: true },
    { id: 'customer', name: 'Customer', required: true },
    { id: 'vendor', name: 'Vendor', required: true },
    { id: 'customerPoNumber', name: 'Customer PO Number', required: false },
    { id: 'doNumber', name: 'DO Number', required: false },
    { id: 'lrNumber', name: 'LR Number', required: false },
    { id: 'beNumber', name: 'BE Number', required: false },
    { id: 'invoiceNumber', name: 'Invoice Number', required: false },
    { id: 'jobNumber', name: 'Job Number', required: false },
    { id: 'plant', name: 'Plant', required: false },
    { id: 'wareHouse', name: 'Ware House', required: false },
  ];

  useEffect(() => {
    const firstError = Object.keys(errors).reduce((field, a) => {
      return errors[field] ? field : a;
    }, null);

    if (!panel1.every((e) => !errors[e]?.message)) {
      setExpanded('panel1');
      return;
    }
    if (!panel2.every((e) => !errors[e]?.message)) {
      setExpanded('panel2');
      return;
    }

    const element = document.getElementsByName(firstError)[0];

    element?.focus();
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [errors]);

  useEffect(() => {
    if (editData) {
      agencyMoveService.getListAgencyMove({ CM_ID: editData }).then((res) => {
        res = res.at(0);
        try {
          reset({
            ...defaultValues,
            moveCode: res.CM_CODE || '',
            moveDescription: res.CM_DESC || '',
            type: res.CM_TYPE && {
              ref_code: res.CM_TYPE,
              ref_name: res.CM_TYPE_CODE,
            },
            status: res.CM_STATUS && {
              ref_name: res.CM_STATUS_CODE,
              ref_code: res.CM_STATUS,
            },
            vessel: res.CM_VESSEL && {
              ref_name: res.CM_VESSEL_CODE,
              ref_code: res.CM_VESSEL,
            },
            voyage: res.CM_VOYAGE && {
              ref_code: res.CM_VOYAGE,
              ref_name: res.CM_VOYAGE_CODE,
            },
            currentPort: res.CM_CUR_PORT && {
              ref_name: res.CM_CUR_PORT_CODE,
              ref_code: res.CM_CUR_PORT,
            },
            nextPort: res.CM_NXT_PORT && {
              ref_name: res.CM_NXT_PORT_CODE,
              ref_code: res.CM_NXT_PORT,
            },
            currentTerminal: res.CM_CUR_TER && {
              ref_name: res.CM_CUR_TER_CODE,
              ref_code: res.CM_CUR_TER,
            },
            nextTerminal: res.CM_NXT_TER && {
              ref_name: res.CM_NXT_TER_CODE,
              ref_code: res.CM_NXT_TER,
            },
            currentDepot: res.CM_CUR_DPT && {
              ref_name: res.CM_CUR_DPT_CODE,
              ref_code: res.CM_CUR_DPT,
            },
            nextDepot: res.CM_NXT_DPT && {
              ref_name: res.CM_NXT_DPT_CODE,
              ref_code: res.CM_NXT_DPT,
            },
            currentLocation: res.CM_CUR_LOC && {
              ref_name: res.CM_CUR_LOC_CODE,
              ref_code: res.CM_CUR_LOC,
            },
            nextLocation: res.CM_CUR_LOC && {
              ref_name: res.CM_CUR_LOC_CODE,
              ref_code: res.CM_CUR_LOC,
            },
            transportMode: res.CM_TRANS_MODE && {
              ref_name: res.CM_TRANS_MODE_CODE,
              ref_code: res.CM_TRANS_MODE,
            },
            truckNumber: res.CM_TRUCK_NUM && {
              ref_name: res.CM_TRUCK_NUM_CODE,
              ref_code: res.CM_TRUCK_NUM,
            },
            bookingNumber: res.CM_BKG_NUM && {
              ref_name: res.CM_BKG_NUM_CODE,
              ref_code: res.CM_BKG_NUM,
            },
            blNumber: res.CM_BL_NUM && {
              ref_name: res.CM_BL_NUM_CODE,
              ref_code: res.CM_BL_NUM,
            },
            rrNumber: res.CM_RREQ_NUM && {
              ref_name: res.CM_RREQ_NUM_CODE,
              ref_code: res.CM_RREQ_NUM,
            },
            referenceNumber: res.CM_REF_NUM && {
              ref_name: res.CM_REF_NUM_CODE,
              ref_code: res.CM_REF_NUM,
            },
            customer: res.CM_AR && {
              ref_name: res.CM_AR_CODE,
              ref_code: res.CM_AR,
            },
            vendor: res.CM_AP && {
              ref_name: res.CM_AP_CODE,
              ref_code: res.CM_AP,
            },
            customerPoNumber: res.CM_CUS_PO_NUM_CODE && {
              ref_name: res.CM_CUS_PO_NUM_CODE,
              ref_code: res.CM_CUS_PO_NUM,
            },
            doNumber: res.CM_DO_NUM_CODE && {
              ref_name: res.CM_DO_NUM_CODE,
              ref_code: res.CM_DO_NUM,
            },
            lrNumber: res.CM_LR_NUM_CODE && {
              ref_name: res.CM_LR_NUM_CODE,
              ref_code: res.CM_LR_NUM,
            },
            beNumber: res.CM_BE_NUM_CODE && {
              ref_name: res.CM_BE_NUM_CODE,
              ref_code: res.CM_BE_NUM,
            },
            invoiceNumber: res.CM_INV_NUM_CODE && {
              ref_name: res.CM_INV_NUM_CODE,
              ref_code: res.CM_INV_NUM,
            },
            jobNumber: res.CM_JOB_NUM_CODE && {
              ref_name: res.CM_JOB_NUM_CODE,
              ref_code: res.CM_JOB_NUM,
            },
            plant: res.CM_PLA_NAME_CODE && {
              ref_name: res.CM_PLA_NAME_CODE,
              ref_code: res.CM_PLA_NAME_ID,
            },
            wareHouse: res.CM_AP_NAME && {
              ref_name: res.CM_AP_CODE,
              ref_code: res.CM_AP_NAME,
            },
          });
          setTableData({ state: null, rows: res.DP_CM_PREV_MOVES || [] });
        } catch {
          dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
        }
      });
    } else setTableData({ state: null, rows: [] });
  }, [agency, dispatch, editData, reset]);

  const handleClose = () => {
    setModalOpen(false);
    setEditData(null);
    setCopy(null);
    reset(defaultValues);
  };

  const handleTableData = () => {
    if (!getValues('moveCodeNext')) {
      setError('moveCodeNext', { type: 'manual', message: 'You must select Move Code' });
      return;
    }

    const data = {
      CPM_PRV_CM_ID: getValues('moveCodeNext').CM_ID,
      CPM_PRV_CM_CODE: getValues('moveCodeNext').CM_CODE,
      CPM_REMARKS: getValues('remarks') || '',
    };
    const index = tableData.rows.indexOf(tableData.state);
    const newRows = [...tableData.rows];

    if (tableData.state) {
      const oldRow = newRows[index];
      newRows[index] = { ...oldRow, ...data };
    } else {
      newRows.push(data);
    }

    setTableData({ state: null, rows: newRows });

    const add = ['moveCodeNext', 'remarks'];
    add.forEach((a) => setValue(a, defaultValues[a]));
  };

  const handleClear = () => {
    setTableData({ state: null, rows: [] });
    reset(defaultValues);
    clearErrors(defaultValues);
  };

  const handleClearMove = () => {
    setValue('moveCodeNext', null);
    setValue('remarks', '');
    clearErrors('moveCodeNext');
    clearErrors('remarks');
    setTableData({ state: null, rows: tableData.rows });
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const updateMove = (state, moveCopy) => {
    setTableData((c) => ({ ...c, state: !moveCopy ? state : null }));

    setValue(
      'moveCodeNext',
      state.CPM_PRV_CM_CODE && { CM_ID: state.CPM_PRV_CM_ID, CM_CODE: state.CPM_PRV_CM_CODE }
    );
    setValue('remarks', state.CPM_REMARKS || '');
    const add = ['moveCodeNext', 'remarks'];
    add.forEach((e) => clearErrors(e));
  };

  const deleteMoveRow = (data, i) => {
    if (tableData?.state === data) {
      dispatch(showMessage({ message: "You can't delete while editing", variant: 'error' }));
      return;
    }
    dispatch(
      setAlert({
        state: true,
        title: 'Action Required',
        content: `Are you sure want to delete ${data.CPM_PRV_CM_CODE} ?`,
        handleAgree() {
          dispatch(setAlert({ state: false }));
          const deletedArray = [...tableData.rows];
          deletedArray.splice(i, 1);
          setTableData({ state: tableData.state, rows: deletedArray });
        },
      })
    );
  };

  const onSubmit = (data) => {
    if (!tableData.rows.length) {
      dispatch(
        showMessage({ message: 'You need to add Allowed Next Move Details!', variant: 'error' })
      );
      setExpanded('panel3');
      return;
    }
    data.tableData = tableData.rows || [];
    data.cp_id = agency?.cp_id;
    data.user_id = user.data.user_id;
    dispatch(showLoader());
    if (!copy && editData) {
      data.CM_ID = editData;
      agencyMoveService
        .putAgencyMove(data)
        .then((message) => {
          dispatch(showMessage({ message, variant: 'success' }));
          dispatch(hideLoader());
          handleAgencyMoveData(filterData);
          handleClose();
        })
        .catch((err) => {
          dispatch(hideLoader());
          dispatch(showMessage({ message: err, variant: 'error' }));
        });
      return;
    }
    agencyMoveService
      .postAgencyMove(data)
      .then((message) => {
        dispatch(showMessage({ message, variant: 'success' }));
        dispatch(hideLoader());
        handleAgencyMoveData(filterData);
        handleClose();
      })
      .catch((message) => {
        dispatch(hideLoader());
        dispatch(showMessage({ message, variant: 'error' }));
      });
  };

  return (
    <Modal open={modalOpen}>
      <Paper sx={style} className="overflow-scroll h-screen">
        <div className=" w-full">
          <motion.span
            className="flex items-end"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
          >
            <div className="flex justify-between items-center w-full">
              <Typography variant="h5" className="font-bold">
                {editData && !copy ? 'Edit' : 'Create'} Agency Move
              </Typography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </div>
          </motion.span>
        </div>
        <hr className="my-14" />
        <form noValidate name="agencyMoveDetailsForm" onSubmit={handleSubmit(onSubmit)}>
          <Card
            component={motion.div}
            initial={{ x: 200 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, bounceDamping: 0 }}
            className="mb-24 rounded-lg"
          >
            <Accordion
              expanded={expanded === 'panel1'}
              onChange={handleChange('panel1')}
              className="rounded"
            >
              <AccordionSummary expandIcon={<ArrowDropDown />} className="rounded">
                <Typography sx={{ fontSize: 15, fontWeight: 500 }}> Move Details</Typography>
              </AccordionSummary>
              <AccordionDetails className=" mt-12 ">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Controller
                      name="moveCode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Move Code"
                          placeholder="Move Code (Max 20 Alphanumerical)"
                          inputProps={{ maxLength: 20 }}
                          className="mb-12 w-full"
                          error={!!errors.moveCode}
                          helperText={errors.moveCode?.message}
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Controller
                      name="moveDescription"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Move Description"
                          placeholder="Move Description (Max 100 Alphanumerical)"
                          inputProps={{ maxLength: 100 }}
                          className="mb-12 w-full"
                          error={!!errors.moveDescription}
                          helperText={errors.moveDescription?.message}
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <ComboBox
                          field={field}
                          className="mb-12 w-full"
                          label="Type"
                          error={!!errors.type}
                          helperText={errors.type?.message}
                          url={jwtServiceConfig.refCode}
                          data={{ PROGRAM: 'DIM001', FIELD: 'TYPE' }}
                          valueExpr="ref_code"
                          displayExpr="ref_name"
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <ComboBox
                          field={field}
                          className="mb-12 w-full"
                          label="Status"
                          error={!!errors.status}
                          helperText={errors.status?.message}
                          url={jwtServiceConfig.refCode}
                          data={{ PROGRAM: 'DIM001', FIELD: 'STATUS' }}
                          valueExpr="ref_code"
                          displayExpr="ref_name"
                          required
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === 'panel2'}
              onChange={handleChange('panel2')}
              className="rounded"
            >
              <AccordionSummary expandIcon={<ArrowDropDown />} className="rounded">
                <Typography sx={{ fontSize: 15, fontWeight: 500 }}>Validation Details</Typography>
              </AccordionSummary>
              <AccordionDetails className=" mt-12 ">
                <Grid container spacing={2}>
                  {validationFields.map((i, id) => (
                    <Grid item xs={12} md={3} key={id}>
                      <Controller
                        name={`${i.id}`}
                        control={control}
                        render={({ field }) => (
                          <ComboBox
                            field={field}
                            className="mb-12 w-full"
                            label={`${i.name}`}
                            error={!!errors[i.id]}
                            helperText={errors[i.id]?.message}
                            url={jwtServiceConfig.refCode}
                            data={{ PROGRAM: 'DIM001', FIELD: 'VAL' }}
                            valueExpr="ref_code"
                            displayExpr="ref_name"
                            required={i.required}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === 'panel3'}
              onChange={handleChange('panel3')}
              className="rounded"
            >
              <AccordionSummary expandIcon={<ArrowDropDown />} className="rounded">
                <Typography sx={{ fontSize: 15, fontWeight: 500 }}>Allowed Next Moves</Typography>
              </AccordionSummary>
              <AccordionDetails className=" mt-12 ">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="moveCodeNext"
                      control={control}
                      render={({ field }) => (
                        <ComboBox
                          field={field}
                          label="Move Code"
                          className="mb-12 w-full"
                          error={!!errors.moveCodeNext}
                          helperText={errors.moveCodeNext?.message}
                          url={jwtServiceConfig.getNextMoveCode}
                          data={{}}
                          displayExpr="CM_CODE"
                          valueExpr="CM_ID"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Remarks"
                          placeholder="Remarks (Max 2500 Alphanumerical)"
                          inputProps={{ maxLength: 2500 }}
                          className="mb-12 w-full"
                          error={!!errors.remarks}
                          helperText={errors.remarks?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <div className="mt-6 flex justify-center space-x-5">
                      <Button
                        variant="contained"
                        className="rounded"
                        color="error"
                        onClick={handleClearMove}
                      >
                        {tableData.state ? 'Cancel' : 'Clear'}
                      </Button>
                      <Button
                        variant="contained"
                        className="rounded"
                        color="primary"
                        onClick={handleTableData}
                      >
                        {tableData.state ? 'Update' : 'Add'}
                      </Button>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <DataTable
                      className="rounded"
                      columns={nextMoveHeaders}
                      pageSize={10}
                      rowsPerPageOptions={[5, 10, 25]}
                      disableSelectionOnClick
                      rows={tableData.rows?.map((r, i) => ({
                        ...r,
                        id: i,
                        action: (
                          <>
                            <IconButton size="small" onClick={() => updateMove(r, true)}>
                              <FileCopy color="primary" fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => updateMove(r, false)}>
                              <Edit color="primary" fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => deleteMoveRow(r, i)}>
                              <Delete color="error" fontSize="small" />
                            </IconButton>
                          </>
                        ),
                      }))}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
          <div className="flex space-x-5 items-center justify-end">
            {!editData || copy ? (
              <Button
                variant="contained"
                className="mt-6 rounded"
                color="error"
                onClick={handleClear}
              >
                Clear
              </Button>
            ) : null}
            <Button variant="contained" color="primary" className="mt-6 rounded" type="submit">
              {!copy && editData ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
        <AlertDialog />
      </Paper>
    </Modal>
  );
};
export default AgencyMoveMasterModal;
