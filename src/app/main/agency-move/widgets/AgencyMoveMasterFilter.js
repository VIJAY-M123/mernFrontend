import { yupResolver } from '@hookform/resolvers/yup';
import { Close } from '@mui/icons-material';
import { Button, Drawer, IconButton, List, ListItem, TextField, Typography } from '@mui/material';
import ComboBox from 'app/shared-components/ComboBox';
import { Controller, useForm } from 'react-hook-form';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import * as yup from 'yup';

const defaultValues = {
  moveCode: '',
  moveDescription: '',
  type: null,
};

const schema = yup.object().shape({
  moveCode: yup.string().trim(),
  moveDescription: yup.string().trim(),
  type: yup.object().nullable(),
});

const AgencyMoveMasterFilter = ({
  setOpenFilter,
  setFilterData,
  handleAgencyMoveData,
  openFilter,
}) => {
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const onSubmit = (data) => {
    setOpenFilter(false);
    setFilterData(data);
    handleAgencyMoveData(data);
  };

  return (
    <div>
      <Drawer anchor="left" open={openFilter}>
        <form noValidate className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
          <List className="w-[350px]">
            <ListItem>
              <div className="flex justify-between items-center w-full">
                <Typography variant="h6" className="font-semibold">
                  Filter
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
                name="moveCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Move Code"
                    className="mb-12 w-full"
                    error={!!errors.moveCode}
                    helperText={errors.moveCode?.message}
                  />
                )}
              />
            </ListItem>
            <ListItem>
              <Controller
                name="moveDescription"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Move Description"
                    className="mb-12 w-full"
                    error={!!errors.moveDescription}
                    helperText={errors.moveDescription?.message}
                  />
                )}
              />
            </ListItem>
            <ListItem>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <ComboBox
                    field={field}
                    className="mb-12 w-full"
                    label="Type"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    url={jwtServiceConfig.refCode}
                    data={{ PROGRAM: 'DIM001', FIELD: 'TYPE' }}
                    valueExpr="ref_code"
                    displayExpr="ref_name"
                    required
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
              <Button variant="contained" color="primary" className="mt-6 rounded" type="submit">
                Apply
              </Button>
            </ListItem>
          </List>
        </form>
      </Drawer>
    </div>
  );
};
export default AgencyMoveMasterFilter;
