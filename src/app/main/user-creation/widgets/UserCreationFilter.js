import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Close } from '@mui/icons-material';
import { Button, Drawer, IconButton, List, ListItem, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import ComboBox from 'app/shared-components/ComboBox';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';

const schema = yup.object().shape({
  userCode: yup.string().trim(),
  userName: yup.string().trim(),
  status: yup.object().nullable(),
});

const defaultValues = {
  userCode: '',
  userName: '',
  status: null,
};

const UserCreationFilter = ({
  setOpenFilter,
  openFilter,
  handleUserCreationData,
  setFilterData,
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setOpenFilter(false);
    setFilterData(data);
    handleUserCreationData(data);
  };

  return (
    <div>
      <Drawer anchor="left" open={openFilter}>
        <form noValidate className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
          <List className="w-[350px]">
            <ListItem>
              <div className="flex justify-between items-center w-full">
                <Typography variant="h6" className="font-semibold">
                  User Creation
                </Typography>

                <IconButton onClick={() => setOpenFilter(false)}>
                  <Close />
                </IconButton>
              </div>
            </ListItem>
          </List>

          <hr className="mb-12" />

          <List className="overflow-scroll h-[calc(100vh-150px)]">
            <ListItem>
              <Controller
                name="userCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="User Code"
                    fullWidth
                    error={!!errors.userCode}
                    helperText={errors.userCode?.message}
                  />
                )}
              />
            </ListItem>
            <ListItem>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="User Name"
                    fullWidth
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                  />
                )}
              />
            </ListItem>
            <ListItem>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <ComboBox
                    field={field}
                    label="Status"
                    className="mb-12 w-full"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    url={jwtServiceConfig.refCode}
                    data={{ PROGRAM: 'UAM002', FIELD: 'STATUS' }}
                    valueExpr="ref_code"
                    displayExpr="ref_name"
                  />
                )}
              />
            </ListItem>
          </List>

          <List style={{ marginTop: `auto` }}>
            <hr className="mt-auto my-4" />

            <ListItem className="flex justify-end gap-6">
              <Button
                variant="contained"
                color="error"
                className="mt-6 rounded"
                onClick={() => reset(defaultValues)}
              >
                Clear
              </Button>

              <Button
                variant="contained"
                color="primary"
                className="mt-6 rounded"
                type="submit"
                onClick={() => handleSubmit(defaultValues)}
              >
                Apply
              </Button>
            </ListItem>
          </List>
        </form>
      </Drawer>
    </div>
  );
};

export default UserCreationFilter;
