import { Close, SimCardDownload } from '@mui/icons-material';
import { Button, IconButton, Modal, Paper, Typography } from '@mui/material';
import utils from 'src/@utils';

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

const { downloadExcel } = utils;

const ExcelPreview = (props) => {
  const { src, open, setOpen, downloadBuffer, reportName } = props;

  const handleClose = () => {
    setOpen(false);
  };
  const handleDownload = () => downloadExcel(downloadBuffer, reportName);

  return (
    <Modal open={open}>
      <Paper
        sx={style}
        className="[@media(max-width:900px),(max-height:750px)]:h-full [@media(max-width:900px)]:w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <Typography variant="h6" className="font-bold">
            {reportName}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </div>

        <hr className="mb-16" />

        <div className="flex justify-end">
          <Button
            className="rounded mb-14"
            variant="contained"
            color="success"
            startIcon={<SimCardDownload />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>

        <iframe
          title="Documnet Viewer"
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`}
          width="100%"
          className="h-[75vh]"
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

export default ExcelPreview;
