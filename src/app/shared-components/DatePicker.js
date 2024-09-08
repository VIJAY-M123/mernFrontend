import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DesktopDatePicker,
  DesktopDateTimePicker,
  MobileDatePicker,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { Hidden } from '@mui/material';

const BasicDatePicker = ({
  className,
  disableFuture,
  disablePast,
  error,
  helperText,
  field: { value, ...field },
  required,
  disabled,
  label,
  views,
  inputFormat,
  openTo,
  dateTime,
  dateProps,
  size,
}) => {
  const pickerProps = {
    ...field,
    ...dateProps,
    value: value && new Date(value),
    label,
    disabled,
    disablePast,
    disableFuture,
    closeOnSelect: false,
    openTo: openTo || 'day',
    format: inputFormat || (dateTime ? 'dd/MM/yy hh:mm aa' : 'dd/MM/yy'),
    views:
      views || (dateTime ? ['year', 'month', 'day', 'hours', 'minutes'] : ['year', 'month', 'day']),
  };

  const props = {
    ...pickerProps,
    slotProps: {
      textField: { error, helperText, required, fullWidth: true, size: size && size },
      popper: { sx: { zIndex: 10000 } },
      actionBar: { actions: ['clear', 'accept'] },
    },
  };

  return (
    <div className={className}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {!dateTime && (
          <Hidden smDown>
            {dateTime ? <DesktopDateTimePicker {...props} /> : <DesktopDatePicker {...props} />}
          </Hidden>
        )}
        <Hidden smUp={!dateTime}>
          {dateTime ? <MobileDateTimePicker {...props} /> : <MobileDatePicker {...props} />}
        </Hidden>
      </LocalizationProvider>
    </div>
  );
};

export default BasicDatePicker;
