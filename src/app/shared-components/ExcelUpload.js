import { Close } from '@mui/icons-material';
import { Box, Button, IconButton, Modal, Paper, Typography, lighten } from '@mui/material';
import { useState } from 'react';
import utils from 'src/@utils';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import {
  selectExcelData,
  selectExcelExtraData,
  selectExcelHandleClose,
  selectExcelHandleObject,
  selectExcelHandleUpload,
  selectExcelHeaders,
  selectExcelName,
  selectExcelURL,
  setExcelData,
  setInitalExcel,
} from 'app/store/viewerSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import _ from 'lodash';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import DataTable from './DataTable';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  borderRadius: 2,
  p: 2,
};

const {
  excelBufferToArray,
  fixArrayObjProps,
  createHeader,
  createDataGridHeader,
  arrayToExcelBuffer,
  downloadExcel,
  fixArrayDates,
} = utils;

const ExcelUpload = () => {
  const dispatch = useDispatch();

  const url = useSelector(selectExcelURL);
  const name = useSelector(selectExcelName);
  const data = useSelector(selectExcelData);
  const headers = useSelector(selectExcelHeaders);
  const extraData = useSelector(selectExcelExtraData);
  const onClose = useSelector(selectExcelHandleClose);
  const handleCustomizedUpload = useSelector(selectExcelHandleUpload);
  const handleObject = useSelector(selectExcelHandleObject);

  const [results, setResults] = useState([]);
  const [success, setSuccess] = useState(0);
  const [failed, setFailed] = useState(0);
  const [upload, setUpload] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);

  const temp = [];

  const accept =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

  const selectedRows = data.filter((d, i) => selectionModel.includes(i));

  const value = Math.round((results.length / selectedRows.length) * 100);

  const status = [
    createHeader('heroicons-outline:hashtag', 'Total', selectedRows.length, 'action'),
    createHeader('material-outline:done', 'Success', success, 'success'),
    createHeader('material-outline:error_outline', 'Failed', failed, 'error'),
    createHeader(
      'material-outline:incomplete_circle',
      'Remaining',
      selectedRows.length - (success + failed),
      'info'
    ),
  ];

  const rows = fixArrayObjProps(fixArrayDates(data, 'dateTime'), _.invert(headers));

  const columns = Object.keys(rows.at(0) || {}).map((c) =>
    createDataGridHeader(c, c, 0, 1, Math.max(c.length * 14, 50))
  );

  const handleFile = async (e) => {
    const f = e.target.files[0];
    const reader = new FileReader();

    if (!accept.split(', ').includes(f.type)) {
      dispatch(showMessage({ message: 'Invalid file type', variant: 'error' }));
      return;
    }

    if (!f.name.match(name)) {
      dispatch(showMessage({ message: 'You must upload valid excel', variant: 'error' }));
      return;
    }

    reader.onload = () => {
      const buffer = new Uint8Array(reader.result);

      excelBufferToArray(buffer)
        .then((arr) => {
          const fixedArr = fixArrayObjProps(arr, headers).filter((row) =>
            Object.values(row).some((r) => r)
          );

          if (!fixedArr.length) {
            dispatch(showMessage({ message: 'Excel is blank or invalid', variant: 'error' }));
            return;
          }

          dispatch(setExcelData(fixedArr));
          setSelectionModel(Array.from(Array(fixedArr.length).keys()));
        })
        .catch((err) => {
          console.log(err);
          dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
        });
    };

    reader.readAsArrayBuffer(f);
  };

  const handleClose = () => {
    if (typeof onClose === 'function' && data.length) {
      onClose();
    }

    dispatch(setInitalExcel());
    setResults([]);
    setSuccess(0);
    setFailed(0);
    setUpload(false);
    setSelectionModel([]);
  };

  const handleSelection = (identifiers) => {
    setSelectionModel(identifiers);
  };

  const handleUpload = () => {
    if (!selectedRows.length) {
      dispatch(showMessage({ message: 'You must to choose at least one data.', variant: 'error' }));
      return;
    }

    setUpload(true);

    const handleResult = (a, message, rowIndex) => {
      const setStatus = (msg) => {
        temp.push({ ...a, message: msg, rowIndex });

        setSuccess(temp.filter((t) => t.message.match(/successfully/i)).length);
        setFailed(temp.filter((t) => !t.message.match(/successfully/i)).length);

        setResults(temp);
      };

      if (typeof handleCustomizedUpload === 'function') {
        const params = { message, rowIndex, temp, selectedRows, setStatus };
        handleCustomizedUpload(params);
        return;
      }

      setStatus(message);
    };

    fixArrayDates(selectedRows, 'yyyy-MM-dd HH:mm').forEach((a, i) => {
      a = { ...a, ...extraData };

      if (typeof handleObject === 'function') handleObject(a);

      axios
        .post(url, a)
        .then((response) => {
          handleResult(a, response.data, i);
        })
        .catch(({ response }) => {
          handleResult(a, response.data, i);
        });
    });
  };

  const handleDownload = () => {
    const displayHeaders = _.invert(headers);
    displayHeaders.message = 'message';

    const fixedArr = fixArrayDates(
      fixArrayObjProps(
        results.sort((a, b) => a.rowIndex - b.rowIndex),
        displayHeaders
      ),
      '',
      true
    );

    arrayToExcelBuffer(fixedArr, 'Status')
      .then((buffer) => {
        downloadExcel(buffer, 'Status');
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          showMessage({
            message: 'While exporting Excel, an unexpected issue occurred',
            variant: 'error',
          })
        );
      });
  };

  return (
    <Modal open={!!url}>
      <Paper sx={style} className="[@media(max-width:900px)]:w-full">
        <div className="flex items-center justify-between mb-8">
          <Typography variant="h6" className="font-bold">
            Excel Uploader: {name}
          </Typography>
          <IconButton
            disabled={!!results.length && results.length !== selectedRows.length}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        </div>

        <hr className="mb-16" />

        {!data.length && (
          <Box className="flex flex-col items-center justify-center h-[200px] border-dashed border-2 rounded-lg">
            <Typography variant="div" className="text-lg font-semibold mb-12">
              Click here to upload an excel file
            </Typography>
            <Button
              color="primary"
              variant="contained"
              component="label"
              className="mt-14"
              onChange={handleFile}
            >
              Upload
              <input hidden type="file" accept={accept} />
            </Button>
          </Box>
        )}

        {!!data.length && !upload && (
          <div>
            <DataTable
              className="rounded mt-6 mb-12 h-[350px]"
              rows={rows.map((d, i) => ({ id: i, ...d }))}
              columns={columns}
              checkboxSelection
              disableSelectionOnClick
              rowsPerPageOptions={[5, 10]}
              onSelectionModelChange={handleSelection}
              selectionModel={selectionModel}
              pageSize={10}
            />
            <div className="flex justify-end">
              <Button
                className="rounded"
                color="primary"
                variant="contained"
                onClick={handleUpload}
              >
                Upload
              </Button>
            </div>
          </div>
        )}

        {!!data.length && upload && (
          <div>
            <Box
              className="p-16 w-full rounded-16 mb-24 border"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
            >
              <Typography className="font-medium">Upload Status</Typography>
              <div className="flex flex-wrap -m-8 mt-8">
                <div className="w-full mx-8">
                  <LinearProgressWithLabel value={value} />
                </div>
              </div>
            </Box>

            <div className="flex [@media(max-width:500px)]:flex-col [@media(max-width:500px)]:gap-12 justify-between p-16 pt-0">
              {status.map((s, i) => (
                <div key={i} className="flex items-center">
                  <FuseSvgIcon className="mr-12" size={48} color={s.color}>
                    {s.id}
                  </FuseSvgIcon>
                  <div>
                    <Typography variant="div" className="font-bold">
                      {s.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-bold lg:text-xl sm:text-lg truncate xl:max-w-[210px] lg:max-w-[170px] sm:max-w-[120px]"
                      sx={{ color: '#0063bb' }}
                    >
                      {s.value}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>

            <hr className="mt-auto mb-8" />

            <div className="flex [@media(max-width:500px)]:justify-center justify-end gap-6">
              <Button
                variant="contained"
                className="mt-6 rounded"
                color="primary"
                disabled={selectedRows.length !== results.length}
                onClick={handleDownload}
              >
                Download status
              </Button>
            </div>
          </div>
        )}
      </Paper>
    </Modal>
  );
};

export default ExcelUpload;
