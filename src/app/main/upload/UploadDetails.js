import { Add, NavigateNext } from '@mui/icons-material';
import { Breadcrumbs, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Box } from '@mui/system';
import DataTable from 'app/shared-components/DataTable';
import utils from 'src/@utils';
import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { selectAgency } from 'app/store/agencySlice';
import uploadService from './service';
import UploadDrawer from './widgets/UploadDrawer';

const { createDataGridHeader } = utils;

const columns = [
  createDataGridHeader('UCM_CP_NAME', 'Agency', 0, 1, 150),
  createDataGridHeader('UCM_NAME', 'Upload Name', 0, 1, 150),
  createDataGridHeader('UCM_TYPE_CODE', 'Type', 0, 1, 80),
  createDataGridHeader('UCM_API_NAME', 'API', 0, 1, 100),
  createDataGridHeader('UCM_STATUS_CODE', 'Status', 0, 1, 90),
];

const UploadDetails = () => {
  const user = useSelector(selectUser);
  const agency = useSelector(selectAgency);

  const [rows, setRows] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleUploadConfigureData = useCallback(() => {
    uploadService
      .getUploadConfig({ cp_id: agency?.cp_id, user_id: user.data.user_id })
      .then((res) => setRows(res.map((r, i) => ({ id: i, ...r }))))
      .catch((err) => console.log(err));
  }, [agency, user]);

  useEffect(() => handleUploadConfigureData({}), [handleUploadConfigureData]);

  const handleUplaodConfig = (data) => {
    setEditData(data?.row);
    setOpenDrawer(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <div className="flex items-center justify-center sm:justify-between">
        <motion.span
          className="flex items-end"
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
        >
          <Typography
            className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
            role="button"
          >
            Upload
          </Typography>

          <Breadcrumbs
            aria-label="breadcrumb"
            className="mx-12"
            separator={<NavigateNext fontSize="small" />}
          >
            <div />

            <Typography>Configuration</Typography>
          </Breadcrumbs>
        </motion.span>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Add />}
          onClick={() => setOpenDrawer(true)}
        >
          Create New
        </Button>
      </div>
      <div className="mt-24">
        <DataTable
          className="rounded"
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          rows={rows}
          disableSelectionOnClick
          onRowDoubleClick={handleUplaodConfig}
        />
      </div>
      <UploadDrawer
        openDrawer={openDrawer}
        handleUploadConfigureData={handleUploadConfigureData}
        setOpenDrawer={setOpenDrawer}
        editData={editData}
        setEditData={setEditData}
      />
    </Box>
  );
};

export default UploadDetails;
