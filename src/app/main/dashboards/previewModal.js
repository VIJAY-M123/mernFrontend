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
  maxWidth: 1000,
  borderRadius: 2,
  p: 2,
};

const PreviewModal = ({ open, handleClose, gridSummary, clickedItem }) => {
  const header = gridSummary[clickedItem]?.headers || [];
  const body = gridSummary[clickedItem]?.tableBody || [];
  const text = gridSummary[clickedItem]?.title;

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
          columns={header.map((i) =>
            createDataGridHeader(i.field, i.headerName, i.width, i.flex, i.minWidth)
          )}
          pageSize={10}
          exportCsv
          fileName={`${text}${getDate()}`}
          rowsPerPageOptions={[5, 10, 25]}
          rows={body.map((item, index) => ({
            id: index,
            ...item,
          }))}
        />
      </Paper>
    </Modal>
  );
};

export default PreviewModal;
