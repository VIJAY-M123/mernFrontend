import { Close } from '@mui/icons-material';
import { Paper, Modal, Typography, IconButton } from '@mui/material';
import DataTable from 'app/shared-components/DataTable';
import utils from 'src/@utils';

const { createDataGridHeader, fixArrayDates, getDate } = utils;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 2000,
  borderRadius: 2,
  p: 2,
};

const PreviewModal = ({ open, handleClose, gridSummary, clickedItem }) => {
  const table = gridSummary[clickedItem];
  const text = gridSummary[clickedItem]?.title;
  const header = gridSummary[clickedItem]?.tableBody || [];

  return (
    <Modal open={open}>
      <Paper sx={style}>
        <div className="flex justify-between">
          <Typography variant="h6" className="font-bold text-black" gutterBottom>
            {text}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </div>

        <hr className="mb-12" />
        <DataTable
          className="rounded mb-12 h-[270px]"
          columns={
            header.length > 0
              ? Object.keys(header[0]).map((key) => createDataGridHeader(key, key, 1, 0, 150))
              : [] // Provide a default empty array if vehiclePerformance is undefined or empty
          }
          pageSize={10}
          exportCsv
          fileName={`${text}${getDate()}`}
          rowsPerPageOptions={[5, 10, 25]}
          rows={
            header === null
              ? []
              : header.map((item, index) => ({
                  id: index,
                  ...item,
                }))
          }
        />
      </Paper>
    </Modal>
  );
};

export default PreviewModal;
