import * as yup from 'yup';
import { Close } from '@mui/icons-material';
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import ComboBox from 'app/shared-components/ComboBox';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { useState } from 'react';

const schema = yup.object().shape({
  userCode: yup.string().trim(),
  userName: yup.string().trim(),
  userPass: yup.string().trim(),
  customer: yup.object().nullable(),
  status: yup.object().nullable(),
});

const defaultValues = {
  userCode: '',
  userName: '',
  userPass: '',
  customer: null,
  status: null,
};

const CustomerLoginFilter = ({ openFilter, setOpenFilter, onSubmit }) => {
  const [customer, setCustomer] = useState({});

  const { control, handleSubmit, reset, formState } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const handleClose = () => setOpenFilter(false);

  const handleCustomerInputchange = (v) =>
    setCustomer({ ar_name: v || null, start: 1, length: v?.length });

  return (
    <Drawer anchor="left" open={openFilter}>
      <form noValidate className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
        <List className="w-[350px] ">
          <ListItem>
            <div className="flex justify-between items-center w-full">
              <Typography variant="h6" className="font-semibold">
                Filter
              </Typography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </div>
          </ListItem>
        </List>
        <Divider className="mb-12" />
        <List className="overflow-scroll h-[calc(100vh-150px)]">
          <ListItem>
            <Controller
              name="userCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-12"
                  label="User Code"
                  error={!!errors.userCode}
                  helperText={errors.userCode?.message}
                  fullWidth
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
                  className="mb-12"
                  label="User Name"
                  error={!!errors.userName}
                  helperText={errors.userName?.message}
                  fullWidth
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="userPass"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-12"
                  label="User Pass"
                  error={!!errors.userPass}
                  helperText={errors.userPass?.message}
                  fullWidth
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="customer"
              control={control}
              render={({ field }) => (
                <ComboBox
                  field={field}
                  className="mb-12 w-full"
                  type="autocomplete"
                  label="Customer"
                  error={!!errors.customer}
                  helperText={errors.customer?.message}
                  url={jwtServiceConfig.listCustomer}
                  data={customer}
                  valueExpr="ar_id"
                  displayExpr="ar_name"
                  onInputChange={(v) => handleCustomerInputchange(v)}
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
                  url={jwtServiceConfig.refCode}
                  data={{ FIELD: 'STATUS', PROGRAM: 'CSD001' }}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  valueExpr="ref_code"
                  displayExpr="ref_name"
                />
              )}
            />
          </ListItem>
        </List>
        <List style={{ marginTop: `auto` }}>
          <Divider className="mb-4" />
          <ListItem className="flex justify-end gap-16">
            <Button
              variant="contained"
              color="error"
              className="rounded"
              onClick={() => reset(defaultValues)}
            >
              Clear
            </Button>

            <Button variant="contained" color="primary" className="rounded" type="submit">
              Apply
            </Button>
          </ListItem>
        </List>
      </form>
    </Drawer>
  );
};

export default CustomerLoginFilter;
