import { Box, Button, Card, CardContent, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import BasicDatePicker from 'app/shared-components/DatePicker';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { selectAgency } from 'app/store/agencySlice';
import ComboBox from 'app/shared-components/ComboBox';

const filterDatas = [
  {
    DASHBOARD_CODE: null,
    DASHBOARD_PROGRAM_ID: null,
    DASHBOARD_USER: null,
    DASHBOARD_ID: 1,
    DASHBOARD_NAME: 'Sales',
    DASHBOARD_FILTER: [
      {
        DASHBOARD_ID: 1,
        SERIAL: 1,
        NAME: 'From Date',
        TYPE: 'D',
        VARIABLE: '@FROM_DATE',
        DATA_TYPE: 'D',
        MANDATORY: 'N',
      },
      {
        DASHBOARD_ID: 1,
        SERIAL: 2,
        NAME: 'To Date',
        TYPE: 'D',
        VARIABLE: '@TO_DATE',
        DATA_TYPE: 'D',
        MANDATORY: 'N',
      },
      {
        DASHBOARD_ID: 1,
        SERIAL: 3,
        NAME: 'Company',
        TYPE: 'C',
        VARIABLE: '@CCP_ID',
        DATA_TYPE: 'I',
        MANDATORY: 'N',
      },
    ],
    DASHBOARD_CHARTS: [
      {
        type: 'Card1',
        LG: 12,
        child: [
          {
            title: 'Booking',
            icon: 'heroicons-solid:calendar',
            iconColor: '#FFF',
            iconBgcolor: '#121C9C',
            CardclassName: 'h-[158px] text-black',
            titleClassName: 'text-xl',
            subtitleClassName: 'flex justify-between mt-8',
            subtitle: [
              {
                title: 'No.of.LRS',
                value: '27',
              },
              {
                title: 'Revenue',
                value: '3436',
              },
              {
                title: 'Tonnage',
                value: '2.7',
              },
            ],
          },
          {
            title: 'Delivery',
            icon: 'heroicons-solid:truck',
            iconColor: '#FFF',
            iconBgcolor: '#11B382',
            CardclassName: 'h-[158px] text-black',
            titleClassName: 'text-xl',
            subtitleClassName: 'flex justify-between mt-8',
            subtitle: [
              {
                title: 'Delivery Collection',
                value: '0',
              },
              {
                title: 'No.of.LRS',
                value: '0',
              },
              {
                title: 'Tonnage',
                value: '2.7',
              },
            ],
          },
          {
            title: 'Actual vs Target Revenue',
            icon: 'heroicons-solid:chart-square-bar',
            iconColor: '#FFF',
            iconBgcolor: '#FF1493',
            CardclassName: 'h-[158px] text-black',
            titleClassName: 'text-xl',
            subtitleClassName: 'flex justify-between mt-8',
            subtitle: [
              {
                title: 'Actual',
                value: '0',
              },
              {
                title: 'Target',
                value: '0',
              },
              {
                title: 'Difference',
                value: '2.7',
              },
            ],
          },
          {
            title: 'Hamali',
            icon: 'heroicons-solid:users',
            iconColor: '#FFF',
            iconBgcolor: '#E78336',
            CardclassName: 'h-[158px] text-black',
            titleClassName: 'text-xl',
            subtitleClassName: 'flex justify-between mt-8',
            subtitle: [
              {
                title: 'Contract',
                value: '0',
              },
              {
                title: 'Non-Contract',
                value: '0',
              },
              {
                title: '',
                value: '',
              },
            ],
          },
        ],
      },
      {
        type: 'Pie',
        filter: true,
        ClassName: 'h-[349px]',
        LG: 6,
        XL: 4,
        tile: 'Sales Performance',
        series: [44, 55, 13, 43, 22],
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        pieColors: [
          '#02bbd6',
          '#1c9bee',
          '#c1d83e',
          '#129c81',
          '#24a79d',
          '#a026ac',
          '#e41e67',
          '#6df0d1',
          '#00b894',
        ],
        chartWidth: 380,
      },
      {
        type: 'Donut',
        filter: true,
        LG: 6,
        XL: 4,
        ClassName: 'h-[349px]',
        tile: 'Lead Performance',
        donutSize: '70%',
        series: [44, 55, 13, 43, 22],
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        pieColors: [
          '#02bbd6',
          '#1c9bee',
          '#c1d83e',
          '#129c81',
          '#24a79d',
          '#a026ac',
          '#e41e67',
          '#6df0d1',
          '#00b894',
        ],
        chartWidth: 360,
      },
      {
        type: 'SemiDount',
        ClassName: 'h-[349px]',
        LG: 6,
        XL: 4,
        title: 'Lost Performance',
        donutSize: '30%',
        series: [44, 55],
        labels: ['Team A', 'Team B'],
        pieColors: [
          '#02bbd6',
          '#1c9bee',
          '#c1d83e',
          '#129c81',
          '#24a79d',
          '#a026ac',
          '#e41e67',
          '#6df0d1',
          '#00b894',
        ],
        chartWidth: 380,
      },
      {
        type: 'LineColumn',
        height: 500,
        LG: 12,
        yaxisTitle: 'x-axis',
        yaxisOppositeTitle: 'x-axis oppositeTitle',
        chartTitle: 'sample',
        series: [
          {
            name: 'Website Blog',
            type: 'column',
            data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
          },
          {
            name: 'Social Media',
            type: 'line',
            data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
          },
        ],
        labels: [
          '01 Jan 2001',
          '02 Jan 2001',
          '03 Jan 2001',
          '04 Jan 2001',
          '05 Jan 2001',
          '06 Jan 2001',
          '07 Jan 2001',
          '08 Jan 2001',
          '09 Jan 2001',
          '10 Jan 2001',
          '11 Jan 2001',
          '12 Jan 2001',
        ],
      },
      {
        type: 'Table',
        LG: 12,
        child: [
          {
            title: 'Sales Person wise Revenue',
            preview: true,
            icon: 'material-solid:person',
            iconColor: '#57DE0F',
            headers: [
              {
                field: 'Name',
                headerName: 'Name',
                width: 0,
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'Revenue',
                headerName: 'Revenue',
                width: 0,
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'TON',
                headerName: 'TAT',
                width: 0,
                flex: 1,
                minWidth: 100,
              },
            ],
            tableBody: [
              {
                Name: 'Vijay',
                Revenue: 1020.2,
                TON: 45,
              },
              {
                Name: 'Ajai',
                Revenue: 900.2,
                TON: 10,
              },
              {
                Name: 'Raj',
                Revenue: 400,
                TON: 20.3,
              },
            ],
          },
          {
            title: 'Date wise Revenue',
            icon: 'heroicons-solid:calendar',
            iconColor: '#1C96DC',
            headers: [
              {
                field: 'Name',
                headerName: 'Date',
                width: 0,
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'Revenue',
                headerName: 'Revenue',
                width: 0,
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'TON',
                headerName: 'TON',
                width: 0,
                flex: 1,
                minWidth: 100,
              },
            ],
            tableBody: [
              {
                Name: '12-12-2020',
                Revenue: 1000,
                TON: 30,
              },
              {
                Name: '12-12-2020',
                Revenue: 2000,
                TON: 60,
              },
              {
                Name: '12-12-2020',
                Revenue: 150,
                TON: 200,
              },
            ],
          },
          {
            title: 'LR wise POD Pending',
            preview: true,
            icon: 'heroicons-solid:document-text',
            iconColor: '#EE3A52',
            headers: [
              {
                field: 'Name',
                headerName: 'Booking Date',
                width: 0,
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'Revenue',
                headerName: 'LR Number',
                width: 0,
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'TON',
                headerName: 'TAT',
                width: 0,
                flex: 1,
                minWidth: 100,
              },
            ],
            tableBody: [
              {
                Name: '12-09-2023',
                Revenue: 'RAQ000',
                TON: 10,
              },
              {
                Name: '12-09-2023',
                Revenue: 'RAQ000',
                TON: 12,
              },
            ],
          },
        ],
      },
      {
        type: 'StackedColumns',
        LG: 12,
        series: [
          {
            name: 'PRODUCT A',
            data: [44, 55, 41, 67, 22, 43, 21, 49],
          },
          {
            name: 'PRODUCT B',
            data: [13, 23, 20, 8, 13, 27, 33, 12],
          },
          {
            name: 'PRODUCT C',
            data: [11, 17, 15, 15, 21, 14, 15, 13],
          },
        ],
        categories: [
          '2011 Q1',
          '2011 Q2',
          '2011 Q3',
          '2011 Q4',
          '2012 Q1',
          '2012 Q2',
          '2012 Q3',
          '2012 Q4',
        ],
      },
    ],
  },
];

const createYupSchema = (schema, config) => {
  const { SERIAL, TYPE, MANDATORY, NAME } = config;
  let validator;

  // if (TYPE === 'T') {
  //   validator = yup.string().trim();
  // }

  if (TYPE === 'D') {
    validator = yup.date().nullable().typeError('You must enter a valid date');
  }

  if (TYPE === 'C') {
    validator = yup.object().nullable();
  }

  // if (['X', 'U'].includes(TYPE)) {
  //   validator = yup.number();
  // }

  if (MANDATORY === 'Y') {
    validator = validator.required(`You must enter ${NAME}`);
  }

  schema[`field_${SERIAL}`] = validator;
  return schema;
};

const Filter = ({ filterData }) => {
  const user = useSelector(selectUser);
  const agency = useSelector(selectAgency);

  // const [report, setReport] = useState({});
  // const [fields, setFields] = useState([]);
  const [formValues, setFormValues] = useState({});

  const filterfields = filterData.at(0);

  console.log('filterfields', filterfields);

  const fields = filterfields.DASHBOARD_FILTER;

  console.log('Fields', fields);

  const id = filterfields.DASHBOARD_CODE;

  console.log('ID', id);

  // useEffect(() => {
  //   if (!report.RPH_NAME) {
  //     reportsService
  //       .getReportFieldDetails({ RPH_CODE: id })
  //       .then((data) => {
  //         console.log('Data', data);
  //         const dt = data.at(0);
  //         const fd = _.sortBy(dt.RPH_PARM_DETAILS, 'SERIAL');

  //         console.log('dt', dt);
  //         console.log('fd', fd);

  //         setReport(dt);
  //         setFields(fd);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         navigate('/reports/index');
  //         dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
  //       });
  //   }
  // }, [dispatch, id, navigate, report]);

  const yupSchema = fields.reduce(createYupSchema, {});
  const schema = yup.object().shape(yupSchema);
  const defaultValues = {};

  const { control, formState, handleSubmit, reset, getValues, watch } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  useEffect(() => {
    const setDefaultValues = (values, config) => {
      const { SERIAL, TYPE } = config;

      // if (TYPE === 'T') {
      //   values[`field_${SERIAL}`] = '';
      // }

      if (TYPE === 'D') {
        values[`field_${SERIAL}`] = new Date();
      }

      if (TYPE === 'C') {
        values[`field_${SERIAL}`] = null;
      }

      // if (TYPE === 'X') {
      //   values[`field_${SERIAL}`] = agency?.cp_id;
      // }

      // if (TYPE === 'U') {
      //   values[`field_${SERIAL}`] = user.data?.user_id;
      // }

      return values;
    };

    reset(fields.reduce(setDefaultValues, {}));
  }, [agency, fields, reset, user]);

  // useEffect(() => {
  //   watch(() => {
  //     const values = getValues();
  //     const comboValues = Object.keys(values).reduce((v, c) => {
  //       const i = c.match(/\d+/i);
  //       const val = values[c];

  //       if (val instanceof Date) {
  //         v[`P${i}`] = format(val, 'yyyy-MM-dd');
  //       } else if (val instanceof Object) {
  //         v[`P${i}`] = val.ID;
  //       } else {
  //         v[`P${i}`] = val;
  //       }

  //       return v;
  //     }, {});

  //     setFormValues(comboValues);
  //   });
  // }, [getValues, watch]);

  const onSubmit = (d) => {
    // const data = {
    //   data: d,
    //   fields,
    //   agency,
    //   user,
    //   code: report.RPH_REPORT_CODE,
    //   name: report.RPH_NAME,
    // };
    // handleReport(data);
  };

  return (
    <Box>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-12">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={10} lg={10}>
                    <Grid container spacing={2}>
                      {fields.map(({ TYPE, NAME, MANDATORY, SERIAL: i }) => {
                        const name = `field_${i}`;
                        return (
                          ['T', 'D', 'C'].includes(TYPE) && (
                            <Grid key={i} item xs={12} md={4} xl={4}>
                              {TYPE === 'T' && (
                                <Controller
                                  name={name}
                                  control={control}
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
                                      // data={{
                                      //   PROGRAM_ID: id,
                                      //   RPH_ID: report.RPH_ID,
                                      //   RPM_SERIAL: i,
                                      //   COMPANY: agency?.cp_id,
                                      //   ...formValues,
                                      // }}
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
                  </Grid>
                  <Grid item xs={12} md={2} lg={2} className="flex items-center justify-end">
                    <Button variant="contained" color="primary" type="submit" className="rounded">
                      submit
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Filter;
