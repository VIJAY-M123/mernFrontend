import { Delete } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Divider, Grid, IconButton, Modal, Paper, Typography } from '@mui/material';
import ComboBox from 'app/shared-components/ComboBox';
import { Controller, useForm } from 'react-hook-form';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import DataTable from 'app/shared-components/DataTable';
import utils from 'src/@utils';
import { setAlert } from 'app/store/viewerSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  maxWidth: 1000,
  borderRadius: 2,
  p: 2,
};
const { createDataGridHeader } = utils;

const headers = [
  createDataGridHeader('action', 'Actions', 0, 1, 50),
  createDataGridHeader('UPA_PROJ_CODE', 'Project Access', 0, 4, 150),
];

const schema = yup.object().shape({
  allowedProjects: yup.object().nullable(),
  defaultProjects: yup.object().nullable().required('You must select Default Project'),
});

const defaultValues = {
  allowedProjects: null,
  defaultProjects: null,
};

const ProjectAccess = ({
  setProjectAccess,
  projectAccess,
  setProjectAccessOpen,
  projectAccessOpen,
  defaultProject,
  setDefaultProject,
}) => {
  const dispatch = useDispatch();

  const {
    control,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (defaultProject) {
      setValue(
        'defaultProjects',
        defaultProject.UPA_PROJ_ID && {
          UPA_PROJ_ID: defaultProject?.UPA_PROJ_ID,
          UPA_PROJ_CODE: defaultProject?.UPA_PROJ_CODE,
        }
      );
    }
    setProjectAccess(projectAccess || []);
  }, [defaultProject, projectAccess, setProjectAccess, setValue]);

  const handleUserDetails = () => {
    if (!getValues('allowedProjects')?.gm_id) {
      setError('allowedProjects', { type: 'manual', message: 'You must select Allowed Project' });
      return;
    }

    const data = {
      UPA_PROJ_ID: getValues('allowedProjects')?.gm_id,
      UPA_PROJ_CODE: getValues('allowedProjects')?.gm_name,
    };

    if (projectAccess.map((i) => i.UPA_PROJ_ID).includes(data.UPA_PROJ_ID)) {
      dispatch(showMessage({ message: 'Project already exists.', variant: 'error' }));
      setValue('allowedProjects', null);
      return;
    }

    const newRows = [...projectAccess];
    newRows.push(data);

    setProjectAccess(newRows);
    setValue('allowedProjects', null);
  };

  const handleDeleteProject = (data, i) => {
    dispatch(
      setAlert({
        state: true,
        title: 'Action required',
        content: `Are you sure to delete this ${data?.USER_ALLOWED_NAME}?`,
        handleAgree: () => {
          dispatch(setAlert({ state: false }));
          const newArray = [...projectAccess];
          newArray.splice(i, 1);
          setProjectAccess(newArray);
        },
      })
    );
  };

  return (
    <Modal open={projectAccessOpen}>
      <Paper
        sx={style}
        className="rounded [@media(max-width:900px),(max-height:550px)]:h-full [@media(max-width:900px)]:w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <Typography variant="h6" className="font-bold">
            Project Access
          </Typography>
        </div>
        <hr className="mb-12" />
        <Grid container spacing={3}>
          <Grid item xs={12} md={10}>
            <Controller
              name="allowedProjects"
              control={control}
              render={({ field }) => (
                <ComboBox
                  field={field}
                  className="mb-12 w-full"
                  label="Allowed Projects"
                  error={!!errors.allowedProjects}
                  helperText={errors.allowedProjects?.message}
                  url={jwtServiceConfig.listGeneralMaster}
                  data={{ gm_reference_code: 'PROJECT_LIST' }}
                  displayExpr="gm_name"
                  valueExpr="gm_id"
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
                onClick={handleUserDetails}
              >
                Add
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} md={12}>
            <DataTable
              className="rounded h-[200px]"
              columns={headers}
              rows={projectAccess.map((data, index) => ({
                id: index,
                ...data,
                action: (
                  <IconButton color="error" onClick={() => handleDeleteProject(data)}>
                    <Delete />
                  </IconButton>
                ),
              }))}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 25]}
              disableSelectionOnClick
            />
          </Grid>
        </Grid>
        <Divider className="my-24" />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Controller
              name="defaultProjects"
              control={control}
              render={({ field }) => (
                <ComboBox
                  field={field}
                  className="mb-12 w-full"
                  label="Default Projects"
                  error={!!errors.defaultProjects}
                  helperText={errors.defaultProjects?.message}
                  opts={projectAccess}
                  handleChange={(d) => setDefaultProject(d)}
                  displayExpr="UPA_PROJ_CODE"
                  valueExpr="UPA_PROJ_ID"
                  reload
                />
              )}
            />
          </Grid>
        </Grid>
        <div className="flex justify-end">
          <Button
            className="mb-12 rounded"
            variant="contained"
            color="primary"
            onClick={() => setProjectAccessOpen(false)}
          >
            Close
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};

export default ProjectAccess;
