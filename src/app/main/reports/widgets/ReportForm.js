import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import { Box, Button, Card, CardContent, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import BasicDatePicker from 'app/shared-components/DatePicker';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { selectAgency } from 'app/store/agencySlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import ComboBox from 'app/shared-components/ComboBox';
import { format } from 'date-fns';
import reportsService from '../service';

const createYupSchema = (schema, config) => {
  const { SERIAL, TYPE, MANDATORY, NAME } = config;
  let validator;

  if (['T', 'U'].includes(TYPE)) {
    validator = yup.string().trim();
  }

  if (TYPE === 'D') {
    validator = yup.date().nullable().typeError('You must enter a valid date');
  }

  if (TYPE === 'C') {
    validator = yup.object().nullable();
  }

  if (TYPE === 'X') {
    validator = yup.number();
  }

  if (MANDATORY === 'Y') {
    validator = validator.required(`You must enter ${NAME}`);
  }

  schema[`field_${SERIAL}`] = validator;
  return schema;
};

const ReportForm = ({ id, handleReport }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const agency = useSelector(selectAgency);

  const [report, setReport] = useState({});
  const [fields, setFields] = useState([]);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (!report.RPH_NAME) {
      reportsService
        .getReportFieldDetails({ RPH_CODE: id })
        .then((data) => {
          const dt = data.at(0);
          const fd = _.sortBy(dt.RPH_PARM_DETAILS, 'SERIAL');

          setReport(dt);
          setFields(fd);
        })
        .catch((err) => {
          console.log(err);
          navigate('/reports/index');
          dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
        });
    }
  }, [dispatch, id, navigate, report]);

  const yepSchema = fields.reduce(createYupSchema, {});
  const schema = yup.object().shape(yepSchema);

  const { control, formState, handleSubmit, reset, getValues, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  useEffect(() => {
    const setDefaultValues = (values, config) => {
      const { SERIAL, TYPE } = config;

      if (TYPE === 'T') {
        values[`field_${SERIAL}`] = '';
      }

      if (TYPE === 'D') {
        values[`field_${SERIAL}`] = new Date();
      }

      if (TYPE === 'C') {
        values[`field_${SERIAL}`] = null;
      }

      if (TYPE === 'X') {
        values[`field_${SERIAL}`] = agency?.cp_id;
      }

      if (TYPE === 'U') {
        values[`field_${SERIAL}`] = user.data?.user_code;
      }

      return values;
    };

    reset(fields.reduce(setDefaultValues, {}));
  }, [agency, fields, reset, user]);

  useEffect(() => {
    watch(() => {
      const values = getValues();
      const comboValues = Object.keys(values).reduce((v, c) => {
        const i = c.match(/\d+/i);
        const val = values[c];

        if (val instanceof Date) {
          v[`P${i}`] = format(val, 'yyyy-MM-dd');
        } else if (val instanceof Object) {
          v[`P${i}`] = val.ID;
        } else {
          v[`P${i}`] = val;
        }

        return v;
      }, {});

      setFormValues(comboValues);
    });
  }, [getValues, watch]);

  const onSubmit = (data) => {
    const _data = Object.keys(data).reduce((prev, key) => {
      const value = data[key];
      return { ...prev, [key]: value === '' ? null : value };
    }, {});

    const formData = {
      data: _data,
      fields,
      agency,
      user,
      code: report.RPH_REPORT_CODE,
      name: report.RPH_NAME,
    };

    handleReport(formData);
  };

  return (
    <Box>
      <div className="sm:mt-32">
        <Button
          component={Link}
          to="/reports/index"
          color="secondary"
          startIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>}
        >
          Back to Reports
        </Button>
      </div>

      <div className="mt-8 text-2xl sm:text-5xl font-extrabold tracking-tight leading-tight">
        {report.RPH_NAME}
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Card className="mt-12 rounded-lg">
          <CardContent>
            <Grid container spacing={2}>
              {fields.map(({ TYPE, NAME, MANDATORY, SERIAL: i }) => {
                const name = `field_${i}`;
                return (
                  ['T', 'D', 'C'].includes(TYPE) && (
                    <Grid key={i} item xs={12} md={4} xl={3}>
                      {TYPE === 'T' && (
                        <Controller
                          name={name}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              className="mb-12"
                              label={NAME}
                              required={MANDATORY === 'Y'}
                              error={!!errors[name]}
                              helperText={errors[name]?.message}
                              fullWidth
                            />
                          )}
                        />
                      )}
                      {TYPE === 'D' && (
                        <Controller
                          name={name}
                          control={control}
                          defaultValue={new Date()}
                          render={({ field }) => (
                            <BasicDatePicker
                              className="mb-12"
                              label={NAME}
                              field={field}
                              required={MANDATORY === 'Y'}
                              error={!!errors[name]}
                              helperText={errors[name]?.message}
                            />
                          )}
                        />
                      )}
                      {TYPE === 'C' && (
                        <Controller
                          name={name}
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <ComboBox
                              field={field}
                              className="mb-12"
                              label={NAME}
                              reload
                              required={MANDATORY === 'Y'}
                              error={!!errors[name]}
                              helperText={errors[name]?.message}
                              url="api/Report/GetReportComboboxdetails"
                              data={{
                                PROGRAM_ID: id,
                                RPH_ID: report.RPH_ID,
                                RPM_SERIAL: i,
                                COMPANY: agency?.cp_id,
                                ...formValues,
                              }}
                              displayExpr="VALUE"
                              valueExpr="ID"
                            />
                          )}
                        />
                      )}
                    </Grid>
                  )
                );
              })}
            </Grid>
          </CardContent>
        </Card>
        <div className="flex justify-end mt-12">
          <Button variant="contained" color="primary" type="submit" className="rounded">
            submit
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default ReportForm;
