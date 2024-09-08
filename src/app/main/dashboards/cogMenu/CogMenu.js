import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { MoreVert } from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import BasicDatePicker from 'app/shared-components/DatePicker';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { selectUser } from 'app/store/userSlice';
import { selectAgency } from 'app/store/agencySlice';

const defaultValues = {
  fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
};
const schema = yup.object().shape({
  fromDate: yup
    .date()
    .nullable()
    .required('You must select the from date')
    .typeError('You must enter a valid date')
    .max(new Date(), 'Future dates are not allowed'),
  toDate: yup
    .date()
    .nullable()
    .required('You must select the to date')
    .typeError('You must enter a valid date')
    .test((value, ctx) => {
      const { fromDate } = ctx.parent;
      if (value && fromDate > value) {
        return ctx.createError({ message: 'End Date must be greater than Start Date' });
      }
      return true;
    }),
});
function CogMenu({ name }) {
  const user = useSelector(selectUser);
  const agency = useSelector(selectAgency);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;

  const { control, setValue, formState, setError, handleSubmit, getValues, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const [selectedFromDate, setSelectedFromDate] = useState(defaultValues.fromDate);
  const [selectedToDate, setSelectedToDate] = useState(defaultValues.toDate);

  //   useEffect(() => {
  //     if (clear === 'OverAll') {
  //       setSelectedFromDate(defaultValues.fromDate);
  //       setSelectedToDate(defaultValues.toDate);
  //       reset(defaultValues); // Reset the entire form to default values
  //     }
  //   }, [clear, reset]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onSubmit = (data) => {
    // if (data.fromDate && !data.toDate) {
    //   setError('toDate', { type: manual, message: 'You must select to date' });
    //   return;
    // }
    // dispatch(
    //   setallSalesPersonActivityFilter({
    //     startDate: data.fromDate.toLocaleDateString(),
    //     endDate: data.toDate.toLocaleDateString(),
    //   })
    // );
    // try {
    //   dispatch(showLoader());
    //   DashboardService.getAllSalesPersonActivity({
    //     ...data,
    //     cp_id: agency?.cp_id,
    //     user_id: user.data.user_id,
    //   }).then((res) => {
    //     dispatch(hideLoader());
    //     dispatch(setallSalesPersonActivity(res));
    //     setAnchorEl(null);
    //   });
    // } catch (error) {
    //   dispatch(hideLoader());
    //   dispatch(showMessage({ message: error, variant: 'error' }));
    // }
  };
  return (
    <div>
      <IconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        // disabled={disabled}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '30ch',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="fromDate"
              control={control}
              render={({ field }) => (
                <BasicDatePicker
                  field={field}
                  disableFuture
                  className="mb-12"
                  label="From Date"
                  error={!!errors.fromDate}
                  helperText={errors.fromDate?.message}
                  value={selectedFromDate}
                  onChange={(date) => {
                    setSelectedFromDate(date);
                    field.onChange(date);
                  }}
                />
              )}
            />

            <Controller
              name="toDate"
              control={control}
              render={({ field }) => (
                <BasicDatePicker
                  field={field}
                  // disableFuture
                  className="mb-12"
                  label="To Date"
                  error={!!errors.toDate}
                  helperText={errors.toDate?.message}
                  value={selectedToDate}
                  onChange={(date) => {
                    setSelectedToDate(date);
                    field.onChange(date);
                  }}
                />
              )}
            />
            <Button
              className="bg-cyan-400 text-white hover:bg-black"
              type="submit"
              variant="contained"
            >
              Apply
            </Button>
          </form>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default CogMenu;
