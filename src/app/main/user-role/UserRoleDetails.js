import { Delete, ManageAccounts, NavigateNext } from '@mui/icons-material';
import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import utils from 'src/@utils';
import * as yup from 'yup';
import AlertDialog from 'app/shared-components/AlertDialog';
import ComboBox from 'app/shared-components/ComboBox';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import DataTable from 'app/shared-components/DataTable';
import { setAlert } from 'app/store/viewerSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectAgency } from 'app/store/agencySlice';
import { selectUser } from 'app/store/userSlice';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import ProcessAccess from './widgets/ProcessAccess';
import userRoleService from './service';

const { createDataGridHeader } = utils;

const schema = yup.object().shape({
  roleCode: yup.string().trim().required('You must enter Role Code'),
  roleDescription: yup.string().trim().required('You must enter Role Description'),
  notes: yup.string().trim(),
  programName: yup.object().nullable(),
});

const defaultValues = {
  roleCode: '',
  roleDescription: '',
  notes: '',
  programName: null,
};

const headers = [
  createDataGridHeader('action', 'Actions', 0, 1, 150),
  createDataGridHeader('UPA_PG_NAME', 'Program Name', 0, 1, 150),
  createDataGridHeader('UPA_CREATE', 'Create', 0, 1, 150),
  createDataGridHeader('UPA_DELETE', 'Delete', 0, 1, 150),
  createDataGridHeader('UPA_UPDATE', 'Update', 0, 1, 150),
  createDataGridHeader('UPA_VIEW', 'View', 0, 1, 150),
];

const UserRoleDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const agency = useSelector(selectAgency);
  const user = useSelector(selectUser);

  const [roleDetails, setRoleDetails] = useState([]);
  const [programDetails, setProgramDetails] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [processDetails, setProcessDetails] = useState([]);
  const [open, setOpen] = useState(false);

  const { control, getValues, setValue, setError, handleSubmit, reset, formState } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  useEffect(() => {
    if (id) {
      userRoleService.getSelectedUserRole({ UR_ID: id }).then((res) => {
        const { UR_CODE, UR_DESC, UR_NOTES, UPC_XML, UPA_XML } = res.at(0);
        reset({
          ...defaultValues,
          roleCode: UR_CODE || '',
          roleDescription: UR_DESC || '',
          notes: UR_NOTES || '',
        });
        setProgramDetails(UPA_XML || []);
        setProcessDetails(UPC_XML || []);
        setRoleDetails(res.at(0));
      });
    } else {
      reset(defaultValues);
      setProgramDetails([]);
      setProcessDetails([]);
    }
  }, [id, reset]);

  const handleAddProgram = () => {
    if (!getValues('programName')) {
      setError('programName', { type: 'manual', message: 'Please Select Program Name' });
      return;
    }
    const newData = {
      UPA_PG_ID: getValues('programName')?.PG_ID,
      UPA_PG_NAME: getValues('programName')?.PG_NAME,
      UPA_PG_FORM_ID: getValues('programName')?.PG_FORM_ID,
      UPA_CREATE: true,
      UPA_UPDATE: true,
      UPA_DELETE: true,
      UPA_VIEW: true,
    };
    const newRows = [...programDetails];

    const type = programDetails.map((i) => i.UPA_PG_ID);

    if (type.includes(newData.UPA_PG_ID)) {
      dispatch(showMessage({ message: 'Same Program Cannot beallowed ', variant: 'error' }));
      setValue('programName', null);
      return;
    }
    newRows.push(newData);

    setProgramDetails(newRows);
    setValue('programName', null);
  };

  const handleProgramData = (data, params) => {
    const index = programDetails.indexOf(data);

    const newRows = [...programDetails];
    newRows[index] = { ...data, [params]: !data[params] };

    setProgramDetails(newRows);
  };

  const handleDeleteProgram = (index) => {
    dispatch(
      setAlert({
        state: true,
        title: 'Action required',
        content: `Are you sure to delete this ${programDetails[index]?.UPA_PG_NAME}?`,
        handleAgree: () => {
          dispatch(setAlert({ state: false }));
          const newProgram = [...programDetails];
          newProgram.splice(index, 1);
          setProgramDetails(newProgram);
        },
      })
    );
  };

  const handleOpen = (data) => {
    setSelectedProgramId(data.UPA_PG_FORM_ID);
    setOpen(true);
  };

  const onSubmit = (data) => {
    if (!programDetails.length) {
      dispatch(showMessage({ message: 'You must add Program Details', variant: 'error' }));
      return;
    }

    data.cp_id = agency?.cp_id;
    data.user_id = user.data.user_id;
    data.programDetails = programDetails;
    data.processDetails = processDetails;

    dispatch(showLoader());

    if (id) {
      data.id = id;
      userRoleService
        .putUserRoleManagement(data)
        .then((message) => {
          dispatch(hideLoader());
          dispatch(showMessage({ message, variant: 'success' }));
          navigate('/masters/user-role');
        })
        .catch((err) => {
          dispatch(hideLoader());
          dispatch(showMessage({ message: err, variant: 'error' }));
        });
    } else {
      userRoleService
        .postUserRoleManagement(data)
        .then((message) => {
          dispatch(hideLoader());
          dispatch(showMessage({ message, variant: 'success' }));
          navigate('/masters/user-role');
        })
        .catch((err) => {
          dispatch(hideLoader());
          dispatch(showMessage({ message: err, variant: 'error' }));
        });
    }
  };

  return (
    <div className="p-24">
      <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 sm:mb-24 mb-16">
        <motion.span
          className="flex items-end"
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
        >
          <Typography
            component={Link}
            to="/masters/user-role"
            className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
            role="button"
          >
            User Role Management
          </Typography>
          <Breadcrumbs
            aria-label="breadcrumb"
            className="mx-12"
            separator={<NavigateNext fontSize="small" />}
          >
            <div />
            <Typography>{id ? 'Details' : 'New'}</Typography>
          </Breadcrumbs>
        </motion.span>
        {id && (
          <Typography
            component={motion.span}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
            delay={500}
            className="text-14 font-medium mx-2 pt-8"
            color="text.secondary"
          >
            {roleDetails.UR_CODE}
          </Typography>
        )}
      </div>

      <form name="userRoleDetailsForm" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Card
          component={motion.div}
          initial={{ x: 500 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, bounceDamping: 0 }}
          className="mb-24 rounded-lg  h-full"
        >
          <CardContent>
            <Typography className="mb-12" variant="h6">
              User Role Details
            </Typography>
            <hr className="mb-12" />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="roleCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Role Code"
                      required
                      fullWidth
                      error={!!errors.roleCode}
                      helperText={errors.roleCode?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="roleDescription"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Role Description"
                      fullWidth
                      required
                      error={!!errors.roleDescription}
                      helperText={errors.roleDescription?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes"
                      fullWidth
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="programName"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      label="Program Name"
                      error={!!errors.programName}
                      helperText={errors.programName?.message}
                      data={{}}
                      type="autocomplete"
                      url={jwtServiceConfig.getProgramMasterList}
                      valueExpr="PG_ID"
                      displayExpr="PG_NAME"
                    />
                  )}
                />
              </Grid>
              <Grid item md={4}>
                <div className="flex items-center justify-center">
                  <Button
                    className="rounded mb-12"
                    variant="contained"
                    color="primary"
                    onClick={handleAddProgram}
                  >
                    Add
                  </Button>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Typography variant="h6" className="font-bold mb-12">
          Program Details
        </Typography>

        <DataTable
          className="rounded mb-12"
          columns={headers}
          rows={programDetails.map((data, index) => ({
            id: index,
            ...data,
            UPA_CREATE: (
              <Checkbox
                checked={data.UPA_CREATE}
                onChange={() => handleProgramData(data, 'UPA_CREATE')}
              />
            ),
            UPA_UPDATE: (
              <Checkbox
                checked={data.UPA_UPDATE}
                onChange={() => handleProgramData(data, 'UPA_UPDATE')}
              />
            ),
            UPA_VIEW: (
              <Checkbox
                checked={data.UPA_VIEW}
                onChange={() => handleProgramData(data, 'UPA_VIEW')}
              />
            ),
            UPA_DELETE: (
              <Checkbox
                checked={data.UPA_DELETE}
                onChange={() => handleProgramData(data, 'UPA_DELETE')}
              />
            ),
            action: (
              <>
                <IconButton color="primary" onClick={() => handleOpen(data)}>
                  <ManageAccounts />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteProgram(index)}>
                  <Delete />
                </IconButton>
              </>
            ),
          }))}
          pageSize={5}
          disableSelectionOnClick
          rowsPerPageOptions={[5, 10, 25]}
        />

        <div className="mt-10 flex justify-end gap-10">
          {!id && (
            <Button
              variant="contained"
              className="rounded"
              color="error"
              onClick={() => {
                reset(defaultValues);
                setProcessDetails([]);
                setProgramDetails([]);
              }}
            >
              Clear
            </Button>
          )}
          <Button variant="contained" className="rounded" color="primary" type="submit">
            {id ? 'Update' : 'Submit'}
          </Button>
        </div>
      </form>
      <ProcessAccess
        open={open}
        setOpen={setOpen}
        selectedProgramId={selectedProgramId}
        processDetails={processDetails}
        setProcessDetails={setProcessDetails}
      />
      <AlertDialog />
    </div>
  );
};

export default UserRoleDetails;
