import { yupResolver } from '@hookform/resolvers/yup';
import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { selectAgency } from 'app/store/agencySlice';
import { selectUser } from 'app/store/userSlice';
import AlertDialog from 'app/shared-components/AlertDialog';
import ComboBox from 'app/shared-components/ComboBox';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { showMessage } from 'app/store/fuse/messageSlice';
import { setAlert } from 'app/store/viewerSlice';
import { Delete, NavigateNext, Visibility, VisibilityOff } from '@mui/icons-material';
import _ from 'lodash';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import utils from 'src/@utils';
import DataTable from 'app/shared-components/DataTable';
import ProjectAccess from './widgets/ProjectAccess';
import userCreationService from './service/UserCreationService';
import DropdownMenu from './widgets/DropdownMenu';

const { createDataGridHeader } = utils;

const userRolesDetailsHeaders = [
  createDataGridHeader('action', 'Action', 0, 0, 150),
  createDataGridHeader('UCP_CPC_CODE', 'Company', 0, 0, 150),
  createDataGridHeader('roles', 'Roles', 0, 1, 150),
];

const schema = yup.object().shape({
  userCode: yup.string().trim().required('You must enter User Code'),
  userName: yup.string().trim().required('You must enter User Name'),
  status: yup.object().nullable().required('You must select Status'),
  emailId: yup.string().trim(),
  password: yup.string().trim(),
  address: yup.string().trim(),
  company: yup.array(),
  role: yup.array(),
});

const defaultValues = {
  userCode: '',
  userName: '',
  status: { ref_code: 'A', ref_name: 'ACTIVE' },
  emailId: '',
  password: '',
  address: '',
  company: [],
  role: [],
};

const UserCreationDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const agency = useSelector(selectAgency);
  const user = useSelector(selectUser);

  const { id } = useParams();

  const [chipData, setChipData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [projectAccessOpen, setProjectAccessOpen] = useState(false);
  const [projectAccess, setProjectAccess] = useState([]);
  const [defaultProject, setDefaultProject] = useState({});
  const [showPassword, setShowPassword] = useState(null);
  const [userRoles, setUserRoles] = useState({});

  const { control, getValues, setValue, setError, reset, formState, clearErrors, handleSubmit } =
    useForm({
      mode: 'onChange',
      defaultValues,
      resolver: yupResolver(schema),
    });

  const { errors } = formState;

  const getAddTypes = useCallback(() => {
    userCreationService
      .getUserRoleList({ UR_FLAG: 'Y' })
      .then((res) => setChipData(res || []))
      .catch((err) =>
        dispatch(showMessage({ message: 'Something went wrong!', variant: 'error' }))
      );
  }, [dispatch]);

  useEffect(() => {
    getAddTypes();
    if (id) {
      userCreationService
        .getUserCreationDetails({ USER_ID: id })
        .then((res) => {
          res = res.at(0);
          reset({
            ...defaultValues,
            userCode: res.USER_CODE || '',
            userName: res.USER_NAME || '',
            status: res.USER_STATUS && {
              ref_code: res.USER_STATUS,
              ref_name: res.USER_STATUS_CODE,
            },
            emailId: res.USER_EMAIL || '',
            password: res.USER_EMAIL_PASS || '',
            address: res.USER_ADDRESS || '',
          });

          const roleGroups = _.groupBy(res.UUR_XML || [], 'UUR_CPC_ID');
          const newRoles =
            res.UCP_XML?.map((role) => ({
              ...role,
              UCP_ROLES: roleGroups[role.UCP_CPC_ID] || [],
            })) || [];

          setRoles(newRoles);
          setProjectAccess(res.UPRJ_XML || []);
          setDefaultProject({
            UPA_PROJ_ID: res.DEFAULT_PROJECT,
            UPA_PROJ_CODE: res.DEFAULT_PROJECT_NAME,
          });
        })
        .catch(() => {
          dispatch(showMessage({ message: 'Something Went Wrong!', variant: 'error' }));
          navigate('/user-creation');
        });
    }
  }, [dispatch, getAddTypes, id, navigate, reset]);

  useEffect(() => {
    const firstError = Object.keys(errors).reduce((field, a) => {
      return errors[field] ? field : a;
    }, null);

    const element = document.getElementsByName(firstError)[0];
    element?.focus();
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [errors]);

  const addRoles = () => {
    const fields = [
      { field: 'company', message: 'You must select Company' },
      { field: 'role', message: 'You must select Role' },
    ];

    const add = fields.map((f) => f.field);
    const values = add.map((a) => getValues(a));

    const valid = fields
      .map(({ field, message }) => {
        const value = getValues(field);
        if (!value.length) {
          setError(field, { type: 'manual', message });
          return false;
        }
        return true;
      })
      .every((e) => e);

    if (!valid) return;

    const newRoles = [...roles];

    values[0].forEach((val) => {
      const index = newRoles.map((r) => r.UCP_CPC_ID).indexOf(val.CP_ID);

      if (index === -1) {
        const newRole = {
          UCP_CPC_ID: val.CP_ID,
          UCP_CPC_CODE: val.CP_CODE,
          UCP_ROLES: values[1].map(
            (role) =>
              ({
                UUR_CPC_ID: val.CP_ID,
                UUR_UR_ID: role.UR_ID,
                UUR_UR_CODE: role.UR_CODE,
              } || [])
          ),
        };
        newRoles.push(newRole);
        return;
      }

      const curRow = newRoles[index];
      const curRoles = curRow?.UCP_ROLES;

      values[1].forEach((role) => {
        // add new roles only
        if (!curRoles.filter((r) => r.UUR_UR_ID === role.UR_ID).length) {
          curRoles.push({
            UUR_CPC_ID: curRow.UCP_CPC_ID,
            UUR_UR_ID: role.UR_ID,
            UUR_UR_CODE: role.UR_CODE,
          });
        }
      });
    });

    setRoles(newRoles);

    add.forEach((a) => {
      clearErrors(a);
      setValue(a, defaultValues[a]);
    });
  };

  const handleDeleteRoleDetails = (data, i) => {
    dispatch(
      setAlert({
        state: true,
        title: 'Action required',
        content: `Are you sure to delete this ${data?.UCP_CPC_NAME}?`,
        handleAgree: () => {
          dispatch(setAlert({ state: false }));
          const newRoles = [...roles];
          newRoles.splice(i, 1);
          setRoles(newRoles);
        },
      })
    );
  };

  const handleDeleteRole = (roleId, company) => {
    const newRows = [...roles];
    const index = roles.indexOf(company);
    console.log(index, roles, company);
    // delete role for selected agency
    // else delete role for all the agency
    if (index !== -1) {
      const row = newRows[index];
      row.UCP_ROLES = row?.UCP_ROLES.filter((r) => r.UUR_UR_ID !== roleId);
    } else {
      newRows.forEach((row) => {
        const newRoles = row.UCP_ROLES.filter((r) => r.UUR_UR_ID !== roleId);
        row.UCP_ROLES = newRoles;
      });
    }
    setRoles(newRows);
    dispatch(setAlert({ state: false }));
  };

  const handleDeleteChip = (roleId, company) => {
    dispatch(
      setAlert({
        state: true,
        title: 'Action required',
        content: 'Do you want to delete for all Agency?',
        actions: (
          <>
            <Button className="rounded-md" onClick={() => handleDeleteRole(roleId, company)}>
              No
            </Button>
            <Button className="rounded-md" onClick={() => handleDeleteRole(roleId)}>
              Yes
            </Button>
          </>
        ),
      })
    );
  };

  const handleRoleAdd = (index, selectedRoles) => {
    const newRoles = _.cloneDeep(roles);
    const currRole = newRoles[index];
    currRole?.UCP_ROLES?.push(
      ...selectedRoles.map((r) => ({
        UUR_CPC_ID: currRole.UCP_CPC_ID,
        UUR_UR_ID: r,
        UUR_UR_CODE: chipData.filter((c) => c.UR_ID === r)[0].UR_CODE,
      }))
    );
    setRoles(newRoles);
  };

  const handleClear = () => {
    reset();
    setRoles([]);
    setDefaultProject({});
    setProjectAccess([]);
  };

  const onSubmit = (data) => {
    data.user_id = user.data.user_id;
    data.cp_id = agency?.cp_id;
    data.roles = roles;
    data.defaultProject = defaultProject;
    data.projectAccess = projectAccess;

    dispatch(showLoader());
    if (id) {
      data.USER_ID = id;
      userCreationService
        .putUserCreation(data)
        .then((message) => {
          dispatch(showMessage({ message, variant: 'success' }));
          dispatch(hideLoader());
          reset();
          navigate('/user-creation');
        })
        .catch((err) => {
          dispatch(hideLoader());
          dispatch(showMessage({ message: err, variant: 'error' }));
        });
      return;
    }
    userCreationService
      .postUserCreation(data)
      .then((message) => {
        dispatch(showMessage({ message, variant: 'success' }));
        dispatch(hideLoader());
        reset();
        navigate('/user-creation');
      })
      .catch((err) => {
        dispatch(hideLoader());
        dispatch(showMessage({ message: err, variant: 'error' }));
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
            to="/user-creation/"
            className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
            role="button"
          >
            User Creation
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
            {roles.USER_CODE}
          </Typography>
        )}
        <div className="flex item-center gap-4 mb-4 rounded">
          <Button
            variant="contained"
            className="rounded"
            color="primary"
            onClick={() => setProjectAccessOpen(true)}
          >
            Project Access
          </Button>
        </div>
      </div>

      <form name="programDetailsForm" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Card
          component={motion.div}
          initial={{ x: 500 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, bounceDamping: 0 }}
          className="mb-24 rounded-lg  h-full"
        >
          <CardContent>
            <Typography variant="h6">User Details</Typography>
            <hr className="my-14" />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="userCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="User Code"
                      required
                      fullWidth
                      error={!!errors.userCode}
                      helperText={errors.userCode?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="userName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="User Name"
                      required
                      fullWidth
                      error={!!errors.userName}
                      helperText={errors.userName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      className="mb-12 w-full"
                      label="Status"
                      required
                      error={!!errors.status}
                      helperText={errors.status?.message}
                      url={jwtServiceConfig.refCode}
                      data={{ PROGRAM: 'UAM002', FIELD: 'STATUS' }}
                      displayExpr="ref_name"
                      valueExpr="ref_code"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="emailId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Id"
                      fullWidth
                      error={!!errors.emailId}
                      helperText={errors.emailId?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-16"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((show) => !show)}>
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      error={!!errors.password}
                      helperText={errors?.password?.message}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address"
                      multiline
                      fullWidth
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card
          component={motion.div}
          initial={{ x: 500 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, bounceDamping: 0 }}
          className="mb-16 rounded-lg"
        >
          <CardContent>
            <Typography variant="h6">Role Details</Typography>
            <hr className="my-14" />
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      className="mb-12 w-full"
                      label="Company"
                      multiple
                      required
                      error={!!errors.company}
                      helperText={errors.company?.message}
                      url={jwtServiceConfig.getCompany}
                      displayExpr="CP_CODE"
                      valueExpr="CP_ID"
                      autoProps={{ disableCloseOnSelect: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      className="mb-12 w-full"
                      label="Role"
                      type="autocomplete"
                      multiple
                      required
                      error={!!errors.role}
                      helperText={errors.role?.message}
                      url={jwtServiceConfig.getUserRoleList}
                      data={userRoles}
                      displayExpr="UR_CODE"
                      valueExpr="UR_ID"
                      onInputChange={(d) => {
                        setUserRoles({ UR_CODE: d, START: 1, LENGTH: d?.length });
                      }}
                      autoProps={{ disableCloseOnSelect: true }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <div className="mt-6 flex justify-center space-x-5">
                  <Button
                    variant="contained"
                    className="rounded"
                    color="success"
                    onClick={addRoles}
                  >
                    Add
                  </Button>
                </div>
              </Grid>
              <DataTable
                className="rounded mb-12 p-12"
                columns={userRolesDetailsHeaders}
                rows={roles.map((data, index) => ({
                  id: index,
                  ...data,
                  roles: (
                    <div className="overflow-x-auto md:w-[calc(120vh-100px)] sm:w-[calc(70vh-100px)]">
                      {data?.UCP_ROLES?.map((d) => (
                        <Chip
                          className="mx-8 mb-4"
                          key={d.UUR_UR_ID}
                          variant="contained"
                          color="secondary"
                          label={d.UUR_UR_CODE}
                          onDelete={() => handleDeleteChip(d.UUR_UR_ID, data)}
                        />
                      ))}

                      <DropdownMenu
                        data={data.UCP_CPC_ID}
                        handleRole={(selectedRoles) => handleRoleAdd(index, selectedRoles)}
                        renderChips={chipData.filter(
                          (c) => !data?.UCP_ROLES?.map((r) => r.UUR_UR_ID).includes(c.UR_ID)
                        )}
                      />
                    </div>
                  ),
                  action: (
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ height: '15px', width: '15px', fontSize: '20px', marginRight: 2 }}
                      onClick={() => handleDeleteRoleDetails(data, index)}
                    >
                      <Delete />
                    </IconButton>
                  ),
                }))}
                disableSelectionOnClick
                rowsPerPageOptions={[5, 10, 25]}
                pageSize={5}
              />
            </Grid>
          </CardContent>
        </Card>
        <div className="mt-10 flex justify-end gap-10">
          {!id && (
            <Button
              variant="contained"
              className="rounded"
              color="error"
              onClick={() => handleClear()}
            >
              Clear
            </Button>
          )}
          <Button variant="contained" className="rounded" color="primary" type="submit">
            {id ? 'Update' : 'Submit'}
          </Button>
        </div>
      </form>
      <AlertDialog />
      <ProjectAccess
        setProjectAccess={setProjectAccess}
        projectAccess={projectAccess}
        setProjectAccessOpen={setProjectAccessOpen}
        projectAccessOpen={projectAccessOpen}
        defaultProject={defaultProject}
        setDefaultProject={setDefaultProject}
      />
    </div>
  );
};

export default UserCreationDetails;
