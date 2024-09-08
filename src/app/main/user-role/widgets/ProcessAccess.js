import { Delete } from '@mui/icons-material';
import { Button, Checkbox, Grid, IconButton, Modal, Paper, Typography } from '@mui/material';
import ComboBox from 'app/shared-components/ComboBox';
import DataTable from 'app/shared-components/DataTable';
import { showMessage } from 'app/store/fuse/messageSlice';
import { setAlert } from 'app/store/viewerSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import utils from 'src/@utils';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  maxWidth: 1000,
  borderRadius: 2,
  p: 2,
};

const { createDataGridHeader } = utils;

const headers = [
  createDataGridHeader('action', 'Actions', 0, 1, 150),
  createDataGridHeader('UPC_PRC_CODE', 'Process Name', 0, 1, 150),
  createDataGridHeader('UPC_CREATE', 'Create', 0, 1, 150),
  createDataGridHeader('UPC_DELETE', 'Delete', 0, 1, 150),
  createDataGridHeader('UPC_UPDATE', 'Update', 0, 1, 150),
  createDataGridHeader('UPC_VIEW', 'View', 0, 1, 150),
];

const ProcessAccess = ({ open, setOpen, selectedProgramId, processDetails, setProcessDetails }) => {
  const dispatch = useDispatch();

  const [processData, setProcessData] = useState({});
  const [processName, setProcessName] = useState(null);

  useEffect(() => {
    setProcessData({ PRC_FORM_ID: selectedProgramId });
  }, [selectedProgramId]);

  const handleProcessInputChange = (v) => {
    setProcessData({
      PRC_FORM_ID: selectedProgramId,
      PRC_CODE: v || null,
      START: 1,
      LENGTH: v?.length,
    });
  };

  const handleProcessDetails = () => {
    if (!processName) {
      dispatch(showMessage({ message: 'You must select Process Name', variant: 'error' }));
      return;
    }

    const newData = {
      UPC_PC_ID: processName?.PRC_ID,
      UPC_PRC_CODE: processName?.PRC_CODE,
      UPC_PRC_FORM_ID: selectedProgramId,
      UPC_CREATE: true,
      UPC_UPDATE: true,
      UPC_DELETE: true,
      UPC_VIEW: true,
    };

    const newRows = [...processDetails];

    const type = processDetails.map((i) => i.UPC_PC_ID);

    if (type.includes(newData.UPC_PC_ID)) {
      dispatch(showMessage({ message: 'Same Process Cannot beallowed ', variant: 'error' }));
      setProcessName(null);
      return;
    }

    newRows.push(newData);

    setProcessDetails(newRows);
    setProcessName(null);
  };

  const handleProgramData = (data, params) => {
    const index = processDetails.indexOf(data);

    const newRows = [...processDetails];
    newRows[index] = { ...data, [params]: !data[params] };

    setProcessDetails(newRows);
  };

  const handleDeleteProcess = (data) => {
    const index = processDetails.indexOf(data);
    dispatch(
      setAlert({
        state: true,
        title: 'Action required',
        content: `Are you sure to delete this ${processDetails[index]?.UPC_PRC_CODE}?`,
        handleAgree: () => {
          dispatch(setAlert({ state: false }));
          const newProcess = [...processDetails];
          newProcess.splice(index, 1);
          setProcessDetails(newProcess);
        },
      })
    );
  };

  return (
    <Modal open={open}>
      <Paper
        sx={style}
        className="rounded [@media(max-width:900px),(max-height:550px)]:h-full [@media(max-width:900px)]:w-full"
      >
        <div className="flex justify-between">
          <div className="flex justify-between items-center w-full">
            <Typography variant="h6" className="font-semibold">
              Process Master
            </Typography>
          </div>
        </div>
        <hr className="mb-12" />
        <div className="pt-12">
          <Grid container spacing={2}>
            <Grid item md={6}>
              <ComboBox
                field={{
                  value: processName,
                }}
                label="Process Name"
                className="mb-12"
                required
                type="autocomplete"
                url={jwtServiceConfig.getProcessMasterList}
                data={processData}
                reload
                handleChange={(d) => setProcessName(d)}
                valueExpr="PRC_ID"
                displayExpr="PRC_CODE"
                onInputChange={(v) => handleProcessInputChange(v)}
              />
            </Grid>
            <Grid item md={6}>
              <Button
                className="mb-12"
                color="primary"
                variant="contained"
                onClick={handleProcessDetails}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </div>
        <hr className="mt-auto mb-8" />
        <DataTable
          className="rounded mb-12"
          columns={headers}
          rows={processDetails
            .filter((i) => i.UPC_PRC_FORM_ID === selectedProgramId)
            .map((data, index) => ({
              id: index,
              ...data,
              UPC_CREATE: (
                <Checkbox
                  checked={data.UPC_CREATE}
                  onChange={() => handleProgramData(data, 'UPC_CREATE')}
                />
              ),
              UPC_UPDATE: (
                <Checkbox
                  checked={data.UPC_UPDATE}
                  onChange={() => handleProgramData(data, 'UPC_UPDATE')}
                />
              ),
              UPC_VIEW: (
                <Checkbox
                  checked={data.UPC_VIEW}
                  onChange={() => handleProgramData(data, 'UPC_VIEW')}
                />
              ),
              UPC_DELETE: (
                <Checkbox
                  checked={data.UPC_DELETE}
                  onChange={() => handleProgramData(data, 'UPC_DELETE')}
                />
              ),
              action: (
                <IconButton color="error" onClick={() => handleDeleteProcess(data)}>
                  <Delete />
                </IconButton>
              ),
            }))}
          pageSize={5}
          disableSelectionOnClick
          rowsPerPageOptions={[5, 10, 25]}
        />

        <div className="flex justify-end">
          <Button
            className="mb-12 rounded"
            color="primary"
            variant="contained"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};
export default ProcessAccess;
