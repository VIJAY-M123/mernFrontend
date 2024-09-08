import { Close } from '@mui/icons-material';
import { IconButton, Modal, Paper, Typography } from '@mui/material';
import { selectDocumentURL, setDocumentURL } from 'app/store/viewerSlice';
import { useDispatch, useSelector } from 'react-redux';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 1100,
  borderRadius: 2,
  p: 2,
};

const DocumentViewer = () => {
  const dispatch = useDispatch();

  const url = useSelector(selectDocumentURL);
  const src = encodeURIComponent(url);

  const handleClose = () => {
    dispatch(setDocumentURL(''));
  };

  return (
    <Modal open={!!url}>
      <Paper
        sx={style}
        className="[@media(max-width:900px),(max-height:750px)]:h-full [@media(max-width:900px)]:w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <Typography variant="h6" className="font-bold">
            Document Viewer
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </div>

        <hr className="mb-16" />

        <iframe
          title="Documnet Viewer"
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${src}`}
          width="100%"
          className="h-[85vh]"
        >
          This is an embedded
          <a target="_blank" href="http://office.com" rel="noreferrer">
            Microsoft Office
          </a>
          document, powered by
          <a target="_blank" href="http://office.com/webapps" rel="noreferrer">
            Office Online
          </a>
          .
        </iframe>
      </Paper>
    </Modal>
  );
};

export default DocumentViewer;
