import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Close } from '@mui/icons-material';
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import ComboBox from 'app/shared-components/ComboBox';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { selectUser } from 'app/store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import uploadService from '../service';

const schema = yup.object().shape({
  agency: yup.object().nullable(),
  uploadName: yup.string().required('You must enter Upload Name').trim().max(100),
  description: yup.string().trim().max(2500),
  status: yup.object().nullable().required('You must select Status'),
  uploadType: yup.object().nullable(),
  apiName: yup
    .string()
    .trim()
    .max(250)
    .test((value, ctx) => {
      const { uploadType } = ctx.parent;
      if (!value && uploadType?.ref_code === 'S') {
        return ctx.createError({ message: 'You must enter API Name' });
      }
      return true;
    }),
  mode: yup
    .string()
    .trim()
    .test((value, ctx) => {
      const { uploadType } = ctx.parent;
      if (!value && uploadType?.ref_code === 'B') {
        return ctx.createError({ message: 'You must enter Mode' });
      }
      return true;
    }),
  json: yup.string().trim().required('You must enter JSON'),
});

const defaultValues = {
  agency: null,
  uploadName: '',
  description: '',
  status: null,
  apiName: '',
  uploadType: { ref_code: 'B', ref_name: 'BULK' },
  mode: '',
  json: '',
};

const UploadDrawer = (props) => {
  const { openDrawer, setOpenDrawer, handleUploadConfigureData, editData, setEditData } = props;

  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (editData) {
      const {
        UCM_CP_ID,
        UCM_CP_NAME,
        UCM_NAME,
        UCM_DESCRIPTION,
        UCM_STATUS,
        UCM_STATUS_CODE,
        UCM_API_NAME,
        UCM_TYPE,
        UCM_TYPE_CODE,
        UCM_UPLOAD_MODE,
        UCM_JSON,
      } = editData;
      reset({
        agency: UCM_CP_ID && {
          CP_NAME: UCM_CP_NAME,
          CP_ID: UCM_CP_ID,
        },
        uploadName: UCM_NAME || '',
        description: UCM_DESCRIPTION || '',
        status: UCM_STATUS && {
          ref_code: UCM_STATUS,
          ref_name: UCM_STATUS_CODE,
        },
        apiName: UCM_API_NAME || '',
        uploadType: UCM_TYPE && {
          ref_code: UCM_TYPE,
          ref_name: UCM_TYPE_CODE,
        },
        mode: UCM_UPLOAD_MODE || '',
        json: UCM_JSON || '',
      });
    } else {
      reset(defaultValues);
    }
  }, [editData, reset]);

  const handleRefresh = () => {
    setEditData(null);
    setOpenDrawer(false);
    reset(defaultValues);
    dispatch(hideLoader());
  };

  const onSubmit = (data) => {
    data.user_id = user.data.user_id;
    data.UCM_ID = editData?.UCM_ID;

    dispatch(showLoader());

    if (editData) {
      uploadService
        .putUploadConfig(data)
        .then((message) => {
          dispatch(showMessage({ message, variant: 'success' }));
          handleUploadConfigureData();
          handleRefresh();
        })
        .catch((err) => {
          dispatch(hideLoader());
          dispatch(showMessage({ message: err, variant: 'error' }));
        });
      return;
    }
    uploadService
      .postUploadConfig(data)
      .then((message) => {
        handleUploadConfigureData();
        handleRefresh();
        dispatch(showMessage({ message, variant: 'success' }));
      })
      .catch((err) => {
        dispatch(hideLoader());
        dispatch(showMessage({ message: err, variant: 'error' }));
      });
  };

  return (
    <Drawer anchor="right" open={openDrawer}>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <List className="w-[350px] ">
          <ListItem>
            <div className="flex justify-between items-center w-full">
              <Typography variant="h6" className="font-semibold">
                Upload
              </Typography>
              <IconButton onClick={() => handleRefresh()}>
                <Close />
              </IconButton>
            </div>
          </ListItem>
        </List>
        <Divider className="mb-12" />
        <List className="overflow-scroll h-[calc(100vh-150px)]">
          <ListItem>
            <Controller
              control={control}
              name="agency"
              render={({ field }) => (
                <ComboBox
                  field={field}
                  label="Agency"
                  className="mb-12 w-full"
                  url={jwtServiceConfig.getCompany}
                  data={{}}
                  valueExpr="CP_ID"
                  displayExpr="CP_NAME"
                  error={!!errors.agency}
                  helperText={errors.agency?.message}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              control={control}
              name="uploadName"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Upload Name"
                  className="mb-12"
                  required
                  fullWidth
                  error={!!errors.uploadName}
                  helperText={errors.uploadName?.message}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  className="mb-12"
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <ComboBox
                  field={field}
                  label="Status"
                  className="mb-12 w-full"
                  required
                  url={jwtServiceConfig.refCode}
                  data={{ FIELD: 'UPLOAD_STATUS', PROGRAM: 'UCM001' }}
                  valueExpr="ref_code"
                  displayExpr="ref_name"
                  error={!!errors.status}
                  helperText={errors.status?.message}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              control={control}
              name="uploadType"
              render={({ field }) => (
                <ComboBox
                  field={field}
                  label="Upload Type"
                  className="mb-12 w-full"
                  url={jwtServiceConfig.refCode}
                  data={{ FIELD: 'UPLOAD_TYPE', PROGRAM: 'UCM001' }}
                  valueExpr="ref_code"
                  displayExpr="ref_name"
                  error={!!errors.uploadType}
                  helperText={errors.uploadType?.message}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              control={control}
              name="apiName"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="API Name"
                  className="mb-12"
                  fullWidth
                  error={!!errors.apiName}
                  helperText={errors.apiName?.message}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              control={control}
              name="mode"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="MODE"
                  className="mb-12"
                  fullWidth
                  error={!!errors.mode}
                  helperText={errors.mode?.message}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              control={control}
              name="json"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="JSON"
                  className="mb-12"
                  required
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.json}
                  helperText={errors.json?.message}
                />
              )}
            />
          </ListItem>
        </List>
        <List style={{ marginTop: `auto` }}>
          <Divider className="mb-4" />
          <ListItem className="flex justify-end gap-12">
            <Button
              variant="contained"
              color="error"
              className="rounded mb-12"
              onClick={() => reset(defaultValues)}
            >
              Clear
            </Button>
            <Button variant="contained" color="primary" className="rounded mb-12" type="submit">
              Submit
            </Button>
          </ListItem>
        </List>
      </form>
    </Drawer>
  );
};

export default UploadDrawer;
