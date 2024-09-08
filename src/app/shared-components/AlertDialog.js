import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { selectAlert, setAlert } from 'app/store/viewerSlice';

const AlertDialog = ({ disableOnClose }) => {
  const dispatch = useDispatch();

  const alert = useSelector(selectAlert);

  const { state: open, title, content, actions, handleAgree } = alert;

  const handleClose = () => {
    dispatch(setAlert({ state: false }));
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!disableOnClose) handleClose();
      }}
      className="rounded-md"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {actions || (
          <>
            <Button className="rounded-md" onClick={handleClose}>
              No
            </Button>
            <Button className="rounded-md" onClick={handleAgree}>
              Yes
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
