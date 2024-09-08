import * as yup from 'yup';
import { Button, Grid, IconButton, Modal, Paper, Typography } from '@mui/material';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import ComboBox from 'app/shared-components/ComboBox';
import { Controller, useForm } from 'react-hook-form';
import { Close } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { showLoader } from 'app/store/fuse/loaderSlice';
import { selectAgency } from 'app/store/agencySlice';
import { useEffect, useState } from 'react';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxWidth: 1000,
  borderRadius: 2,
  p: 2,
  height: '30%',
};

const schema = yup.object().shape({
  blNumber: yup.object().nullable().required('You must select BL Number'),
});

const defaultValues = { blNumber: null };

const KillSession = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const agency = useSelector(selectAgency);

  const [blNumber, setBLNumber] = useState({ OLD_CP_ID: agency?.cp_id });

  const { control, formState, handleSubmit, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  useEffect(() => {
    setBLNumber({ OLD_CP_ID: agency?.cp_id });
    setValue('blNumber', null);
  }, [agency, setValue]);

  const handleClose = () => {
    setOpen(false);
    setValue('blNumber', null);
  };

  const handleBLNumber = (v) => {
    const newData = {
      OLD_CP_ID: agency?.cp_id,
      OLD_BL_NUMBER: v,
      START: 1,
      LENGTH: v?.length,
    };
    setBLNumber(newData);
  };

  const onSubmit = (data) => {
    const newData = {
      BKG_CP_ID: agency?.cp_id,
      BKG_ID: data.blNumber?.OLD_OBJ_ID,
    };

    dispatch(showLoader());
    // dcService
    //   .killBLSession(newData)
    //   .then((message) => {
    //     dispatch(hideLoader());
    //     dispatch(showMessage({ message, variant: 'success' }));
    //     handleClose();
    //   })
    //   .catch((message) => {
    //     dispatch(hideLoader());
    //     dispatch(showMessage({ message, variant: 'error' }));
    //   });
  };

  return (
    <Modal open={open}>
      <Paper sx={style} className="[@media(max-width:900px)]:w-full">
        <form noValidate className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-8">
            <Typography variant="h6" className="font-bold">
              Kill BL Session - Agency Specific
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>

          <hr className="mb-10" />

          <div className="overflow-scroll h-[calc(100vh-150px)]">
            <Grid container spacing={2} className="mt-2">
              <Grid item xs={12} md={6}>
                <Controller
                  name="blNumber"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      field={field}
                      type="autocomplete"
                      label="BL Number"
                      required
                      data={blNumber}
                      error={!!errors.blNumber}
                      helperText={errors.blNumber?.message}
                      url={jwtServiceConfig.getLockBL}
                      displayExpr="OLD_BL_NUMBER"
                      valueExpr="OLD_ID"
                      onInputChange={handleBLNumber}
                      reload
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="flex justify-center">
                  <Button
                    variant="contained"
                    className="mt-6 rounded"
                    color="primary"
                    type="submit"
                  >
                    Kill
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
        </form>
      </Paper>
    </Modal>
  );
};

export default KillSession;
