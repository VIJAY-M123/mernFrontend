import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import ComboBox from 'app/shared-components/ComboBox';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { useState } from 'react';
import { Download, UploadFile } from '@mui/icons-material';
import { selectAgency } from 'app/store/agencySlice';
import { selectUser } from 'app/store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFiles,
  setExcelExtraData,
  setExcelHandleClose,
  setExcelHeaders,
  setExcelName,
  setExcelURL,
  setFiles,
} from 'app/store/viewerSlice';
import axios from 'axios';
import _ from 'lodash';
import utils from 'src/@utils';
import { showMessage } from 'app/store/fuse/messageSlice';
import ExcelUpload from 'app/shared-components/ExcelUpload';
import { hideLoader } from 'app/store/fuse/loaderSlice';
import { format } from 'date-fns';
import uploadService from './service';

const { fixArrayObjProps, arrayToExcelBuffer, fileToBuffer, handleFileType, downloadExcel } = utils;
const schema = yup.object().shape({
  uploadData: yup.object().required('You must select Upload Data').nullable(),
});

const defaultValues = {
  uploadData: null,
};

const Upload = () => {
  const dispatch = useDispatch();

  const agency = useSelector(selectAgency);
  const user = useSelector(selectUser);
  const files = useSelector(selectFiles);

  const [uploadName, setUploadName] = useState({});
  const [uploadDetails, setUploadDetails] = useState(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleUploadName = (v) => {
    setUploadName({ UCM_NAME: v, START: 1, LENGTH: v?.length });
  };

  const handleUpload = () => {
    if (uploadDetails?.UCM_TYPE.match(/s/i)) {
      dispatch(setExcelHandleClose());
      dispatch(setExcelURL(`/${uploadDetails.UCM_API_NAME}`));
      dispatch(setExcelName(uploadDetails.UCM_NAME));
      dispatch(setExcelHeaders(_.invert(JSON.parse(uploadDetails.UCM_JSON))));
      dispatch(setExcelExtraData());
    }
  };

  const bulkUpload = () => {
    const data = {
      UD_CP_ID: agency?.cp_id,
      UD_CREATED_BY: user.data.user_id,
      UD_MODE: uploadDetails?.UCM_MODE,
    };

    uploadService
      .uploadData(data)
      .then((res) => {
        dispatch(hideLoader());
        console.log(res);
        arrayToExcelBuffer(data, uploadDetails.UCM_NAME)
          .then((buffer) => {
            downloadExcel(buffer, uploadDetails.UCM_NAME);
          })
          .catch((err) => {
            dispatch(showMessage({ message: "Can't download excel", variant: 'error' }));
          });
      })
      .catch((err) => {
        dispatch(hideLoader());
        dispatch(showMessage({ message: err, variant: 'error' }));
      });
  };

  const handleUploadCheck = () => {
    if (!uploadDetails) {
      setError('uploadData', { type: 'manual', message: 'You must select Upload Data' });
      return;
    }

    if (uploadDetails.UCM_MODE.match(/s/i)) {
      handleUpload();
      return;
    }

    bulkUpload();
  };

  const handleDownload = () => {
    if (!uploadDetails) {
      setError('uploadData', { type: 'manual', message: 'You must select Upload Data' });
      return;
    }
    const { UCM_NAME, UCM_JSON } = uploadDetails;
    const newDeals = [Array.from(Array(10).keys()).map(() => ({}))];

    const data = fixArrayObjProps(newDeals, JSON.parse(UCM_JSON));

    arrayToExcelBuffer(data, UCM_NAME)
      .then((buffer) => {
        downloadExcel(buffer, UCM_NAME);
      })
      .catch((err) => {
        dispatch(showMessage({ message: "Can't download excel", variant: 'error' }));
      });
  };

  const handleFiles = (e) => {
    if (!uploadDetails) {
      setError('uploadData', { type: 'manual', message: 'You must select Upload Data' });
      return;
    }

    const count = files.length && files.at(-1).id + 1;
    const uploadedFiles = Object.values(e.target.files);
    const completedFiles = [];

    uploadedFiles.forEach((file, index) => {
      fileToBuffer(file)
        .then((base64) => {
          const i = file.name.lastIndexOf('.');
          const ext = file.name.slice(i);
          const newName = file.name.slice(0, i) + format(new Date(), 'yyyyMMHHmmSS') + ext;

          const data = {
            account_name: user.data.blob_acc_name,
            account_key: user.data.blob_acc_key,
            account_container: user.data.blob_acc_cntr,
            VIA_BASE64: base64,
            VIA_FILE_NAME: newName,
          };

          const status = {
            id: count + index,
            type: handleFileType(ext.slice(1)),
            name: newName,
          };

          axios
            .post('api/TransportOrder/PostVendInvAttachments', data)
            .then(() => {
              completedFiles.push(status);
              if (completedFiles.length === uploadedFiles.length) {
                const newFiles = [...files, ...completedFiles.filter((c) => !c.failed)].sort(
                  (a, b) => a.id - b.id
                );

                dispatch(setFiles(newFiles));
              }
            })
            .catch((err) => {
              console.log('err', err);
              status.failed = true;
              completedFiles.push(status);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <div className="p-24">
      <Typography variant="h5" className="bold">
        Upload Data
      </Typography>
      <hr className="mb-12" />
      <Grid container spacing={4}>
        <Grid item sm={12} md={6}>
          <Controller
            name="uploadData"
            control={control}
            render={({ field }) => (
              <ComboBox
                field={field}
                className="mb-12 w-full"
                label="Upload Data"
                required
                type="autocomplete"
                url={jwtServiceConfig.listUploadConfig}
                data={uploadName}
                error={!!errors.uploadData}
                helperText={errors.uploadData?.message}
                valueExpr="UCM_ID"
                displayExpr="UCM_NAME"
                handleChange={(v) => setUploadDetails(v || null)}
                onInputChange={handleUploadName}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="flex items-center gap-12 mt-4">
            {uploadDetails?.UCM_MODE === 'S' ? (
              <>
                <Button
                  className="mb-12 rounded"
                  variant="contained"
                  color="primary"
                  startIcon={<UploadFile />}
                  onClick={handleUploadCheck}
                >
                  Upload
                </Button>
                <Button
                  className="mb-12 rounded"
                  variant="contained"
                  color="secondary"
                  startIcon={<Download />}
                  onClick={handleDownload}
                >
                  Download
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  className="mb-12 rounded"
                  startIcon={<UploadFile />}
                  onChange={handleFiles}
                >
                  Upload
                  <input hidden multiple type="file" />
                </Button>
                <Button
                  className="mb-12 rounded"
                  variant="contained"
                  color="secondary"
                  startIcon={<Download />}
                  onClick={handleDownload}
                >
                  Download
                </Button>
              </>
            )}
          </div>
        </Grid>
      </Grid>
      <ExcelUpload />
    </div>
  );
};

export default Upload;
