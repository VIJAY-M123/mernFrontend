import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import ComboBox from 'app/shared-components/ComboBox';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { useState } from 'react';
import { Search } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import FindOfficeService from './service';
import AgencyDetails from './widgets/AgencyDetailsCard';

const schema = yup.object().shape({
  city: yup.object().nullable(),
  pinCode: yup.string().trim(),
});

const defaultValues = {
  city: null,
  pinCode: '',
};

const FindOffice = () => {
  const dispatch = useDispatch();
  const [city, setCity] = useState({});
  const [agencyDetails, setAgencyDetails] = useState([]);

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleCityNameInput = (v) => {
    setCity({
      ct_name: v,
      START: 1,
      length: v?.length,
    });
  };

  const onSubmit = (data) => {
    console.log(data);
    dispatch(showLoader());
    FindOfficeService.getAgencyContactDetails(data)
      .then((res) => {
        dispatch(hideLoader());
        setAgencyDetails(res);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        dispatch(hideLoader());
        dispatch(showMessage({ message: err, variant: 'error' }));
      });
  };

  return (
    <div className="p-24">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Card
          component={motion.div}
          initial={{ x: 500 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, bounceDamping: 0 }}
          className="mb-24 rounded"
        >
          <CardContent>
            <div className="flex items-center justify-between">
              <Typography variant="h6">Find Office</Typography>
            </div>
            <hr className="mb-14" />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      className="mb-12 w-full"
                      field={field}
                      label="City"
                      type="autocomplete"
                      required
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      url={jwtServiceConfig.listCity}
                      data={city}
                      onInputChange={handleCityNameInput}
                      displayExpr="ct_name"
                      valueExpr="ct_id"
                      reload
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="pinCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-12"
                      label="Pin Code"
                      error={!!errors.pinCode}
                      helperText={errors.pinCode?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="flex justify-center">
                  <Button
                    variant="contained"
                    color="primary"
                    className="mt-6 rounded"
                    type="submit"
                    startIcon={<Search />}
                  >
                    Search
                  </Button>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
      <AgencyDetails agencyDetails={agencyDetails} />
    </div>
  );
};
export default FindOffice;
