import { useEffect, useState } from 'react';
import { Autocomplete, Checkbox, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import JwtService from '../auth/services/jwtService';
// import { setNavigate } from '../main/masters/store/mastersSlice';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const ComboBox = ({
  field: { onChange, value, ref, ...field },
  className,
  label,
  disabled,
  error,
  helperText,
  url,
  data,
  displayExpr,
  valueExpr,
  opts,
  freeSolo,
  method,
  required,
  handleChange,
  type,
  onInputChange,
  reload,
  basicInstance,
  multiple,
  startAdornment,
  autoProps,
  padding,
  navigatePath,
  backUrl,
  pathData,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(opts || null);
  const [typeLoad, setTypeLoad] = useState(false);
  const loading = !opts && open && !options;

  useEffect(() => {
    let active = true;

    if (type === 'autocomplete') {
      if (options && !value && !open) {
        setOptions(null);
      }
      return undefined;
    }

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(5e2);

      if (!active) return;

      if (basicInstance) {
        JwtService.basicInstance()
          .post(url, data)
          .then((res) => setOptions(res.data));
        return;
      }

      axios({ method: method || 'post', url, data }).then((res) => setOptions(res.data));
    })();

    return () => {
      active = false;
    };
  }, [data, loading, url, valueExpr, method, type, basicInstance, options, value, open]);

  useEffect(() => {
    if (type === 'autocomplete' && open && data) {
      let active = true;

      setTypeLoad(true);
      (async () => {
        await sleep(5e2);

        if (!active) return;

        if (basicInstance) {
          JwtService.basicInstance()
            .post(url, data)
            .then((res) => {
              setTypeLoad(false);
              setOptions(res.data);
            });
          return;
        }

        axios({ method: 'post', url, data }).then((res) => {
          setTypeLoad(false);
          setOptions(res.data);
        });
      })();

      return () => {
        active = false;
      };
    }

    return undefined;
  }, [basicInstance, data, loading, open, type, url]);

  useEffect(() => {
    if (reload && !open) {
      setOptions(null);
    }

    if (value || (!value && !open)) setTypeLoad(false);

    if (opts?.length && !options?.length) setOptions(opts);
  }, [open, options, opts, reload, value]);

  /* const PaperComponentCustom = (option) => {
    const { children } = option;

    return (
      <Paper>
        {children}
        <Button
          color="primary"
          fullWidth
          sx={{ justifyContent: 'flex-start', pl: 2 }}
          onMouseDown={() => {
            dispatch(setNavigate({ backUrl, pathData }));
            navigate(navigatePath);
          }}
        >
          + Add New
        </Button>
      </Paper>
    );
  }; */

  return (
    <Autocomplete
      {...field}
      {...autoProps}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, val) => option[valueExpr] === val[valueExpr]}
      getOptionLabel={(option) => option?.[displayExpr] || option}
      className={className}
      freeSolo={freeSolo}
      options={options?.filter((o) => o[displayExpr]?.trim()) || []}
      value={value}
      PaperComponent={navigatePath} // && PaperComponentCustom
      multiple={multiple}
      loading={loading || typeLoad}
      disabled={disabled}
      onChange={(e, d) => {
        if (typeof handleChange === 'function') handleChange(d);
        if (typeof onChange === 'function') onChange(d);
      }}
      onInputChange={(e, d) => {
        if (typeof onInputChange === 'function') onInputChange(d);
        if (typeof onChange === 'function' && freeSolo && d) onChange(d);
      }}
      renderOption={(props, option, { selected }) =>
        !multiple ? (
          <li {...props} key={option[valueExpr]}>
            {option[displayExpr]}
          </li>
        ) : (
          <li {...props} key={option[valueExpr]}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option[displayExpr]}
          </li>
        )
      }
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          required={required}
          label={label}
          error={error}
          helperText={helperText}
          inputRef={ref}
          InputProps={{
            ...params.InputProps,
            style: padding && { padding: 2 },
            startAdornment: startAdornment || params.InputProps.startAdornment,
            endAdornment: (
              <>
                {loading || typeLoad ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      slotProps={{
        popper: {
          sx: {
            zIndex: 10000,
          },
        },
      }}
    />
  );
};

export default ComboBox;
