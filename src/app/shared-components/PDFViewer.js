import { Close } from '@mui/icons-material';
import { IconButton, Modal, Paper, Typography } from '@mui/material';
import { openViewer, selectViewer, selectViewerDetails } from 'app/store/viewerSlice';
import { useDispatch, useSelector } from 'react-redux';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 1000,
  minHeight: '90%',
  borderRadius: 2,
  p: 2,
};

const PDFViewer = () => {
  const dispatch = useDispatch();

  const open = useSelector(selectViewer);
  const { base64 } = useSelector(selectViewerDetails);
  const src = base64 && `data:application/pdf; base64, ${base64}`;

  return (
    <Modal open={open}>
      <Paper sx={style}>
        <div className="flex items-center justify-between mb-12">
          <Typography variant="h6" className="font-bold">
            PDF Viewer
          </Typography>
          <IconButton onClick={() => dispatch(openViewer(false))}>
            <Close />
          </IconButton>
        </div>
        <hr className="mb-14" />
        <div className="h-full">
          <iframe title="pdf" src={src} className="absolute left-12 pr-24 w-full h-full pb-96" />
        </div>
      </Paper>
    </Modal>
  );
};

export default PDFViewer;
