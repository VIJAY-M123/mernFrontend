import { Card, CardContent, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from 'app/shared-components/DataTable';
import { useState } from 'react';
import utils from 'src/@utils';
import PieChart from './charts/pieChart';
import DountChart from './charts/dountChart';
import SemiDount from './charts/semiDount';
import Stacked from './charts/stackedColumnChart';
import LineColumnChart from './charts/lineColumnChart';
import Filter from './cogMenu/Filter';
import PreviewModal from './previewModal';

const { createDataGridHeader, fixArrayDates } = utils;

const filterData = [
  {
    DASHBOARD_ID: 1,
    DASHBOARD_NAME: 'Sales',
    DASHBOARD_CODE: 'DASH001',
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
        ClassName: 'sm: h-[400px] lg:h-[349px]',
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
        ClassName: 'sm: h-[400px] lg:h-[349px]',
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
        ClassName: 'sm: h-[400px] lg:h-[349px]',
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

function DynamicDashboard() {
  const [open, setOpen] = useState(false);
  const [selectItem, setSelectItem] = useState([]);
  const [selectIndex, setSelectIndex] = useState();

  const Handle = (indexs, data, parentIndex) => {
    console.log('index', indexs, data, parentIndex);

    const parent = filterData[0].DASHBOARD_CHARTS[parentIndex].child;
    console.log('parent', parent);
    setOpen(true);
    setSelectItem(parent);
    setSelectIndex(indexs);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="p-24">
      <Filter filterData={filterData} />

      <Grid container spacing={2} className="mt-12">
        {filterData[0].DASHBOARD_CHARTS.map((item, index) => (
          <Grid item xs={12} sm={12} md={12} lg={item.LG} xl={item.XL} key={index}>
            {(() => {
              switch (item.type) {
                case 'Pie':
                  return (
                    <div>
                      <Card className={item.ClassName}>
                        <CardContent>
                          <div className="flex justify-between">
                            <div>
                              <Typography>{item.tile}</Typography>
                              <Typography className="font-medium">A Monthly Report</Typography>
                            </div>
                            <div>
                              {/* {item.filter === true ? (
                                <>
                                  <CogMenu name="Pie" />
                                </>
                              ) : (
                                <></>
                              )} */}
                            </div>
                          </div>

                          <PieChart
                            Series={item.series}
                            Label={item.labels}
                            Width={item.chartWidth}
                            Colors={item.pieColors}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  );
                case 'Donut':
                  return (
                    <div>
                      <Card className={item.ClassName}>
                        <CardContent>
                          <div className="flex justify-between">
                            <div>
                              <Typography>{item.tile}</Typography>
                              <Typography className="font-medium">A Monthly Report</Typography>
                            </div>
                            <div>
                              {/* {item.filter === true ? (
                                <>
                                  <CogMenu name="Dount" />
                                </>
                              ) : (
                                <></>
                              )} */}
                            </div>
                          </div>
                          <DountChart
                            Series={item.series}
                            Label={item.labels}
                            Width={item.chartWidth}
                            Colors={item.pieColors}
                            DountSize={item.donutSize}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  );
                case 'SemiDount':
                  return (
                    <div>
                      <Card className={item.ClassName}>
                        <CardContent>
                          <div className="flex justify-between">
                            <div>
                              <Typography>{item.tile}</Typography>
                              <Typography className="font-medium">A Monthly Report</Typography>
                            </div>
                            <div>
                              {/* {item.filter === true ? (
                                <>
                                  <CogMenu name="SemiDount" />
                                </>
                              ) : (
                                <></>
                              )} */}
                            </div>
                          </div>
                          <SemiDount
                            Series={item.series}
                            Label={item.labels}
                            Width={item.chartWidth}
                            Colors={item.pieColors}
                            DountSize={item.donutSize}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  );
                case 'Card1':
                  return (
                    <div>
                      <Grid container spacing={2}>
                        {item.child.map((obj, indexs) => (
                          <Grid item xs={12} sm={12} md={6} lg={6} xl={3} key={indexs}>
                            <Card
                              className={`${obj.CardclassName}`}
                              sx={{
                                overflow: 'visible',
                                // height: item.height,
                                '@media (max-width: 600px)': {
                                  marginBottom: '20px',
                                },

                                '@media (max-width: 1300px)': {
                                  marginBottom: '20px',
                                },
                              }}
                              component={motion.div}
                              initial={{ x: -500 }}
                              animate={{ x: 0 }}
                              transition={{ duration: 0.3, bounceDamping: 0 }}
                            >
                              <CardContent>
                                <div className="flex justify-between relative mb-8">
                                  <Typography className={`${obj.titleClassName}`}>
                                    {obj.title}
                                  </Typography>
                                  <div className="absolute right-0 top-0 mt-[-35px]">
                                    <FuseSvgIcon
                                      className="shadow-lg shadow-gray-500/20 p-5 rounded-md"
                                      size={40}
                                      sx={{
                                        color: obj.iconColor,
                                        backgroundColor: obj.iconBgcolor,
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                          transform: 'translateY(-5px)',
                                        },
                                      }}
                                    >
                                      {obj.icon}
                                    </FuseSvgIcon>
                                  </div>
                                </div>
                                <hr />
                                {obj.subtitle.map((objs, ids) => (
                                  <div className={`${obj.subtitleClassName}`} key={ids}>
                                    <div>{objs.title}</div>
                                    <div>{objs.value !== null ? objs.value : 0}</div>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  );
                case 'Table':
                  return (
                    <div>
                      <Grid container spacing={2}>
                        {item.child.map((objs, key) => (
                          <Grid item xs={12} sm={6} md={12} lg={4} key={key}>
                            <Card
                              component={motion.div}
                              initial={{ x: -500 }}
                              animate={{ x: 0 }}
                              transition={{ duration: 0.3, bounceDamping: 0 }}
                              sx={{ maxHeight: '350px' }}
                            >
                              <CardContent>
                                <div className="flex mb-12 justify-between">
                                  <div className="flex">
                                    <FuseSvgIcon size={30} style={{ color: objs.iconColor }}>
                                      {objs.icon}
                                    </FuseSvgIcon>
                                    <div className="ml-12 flex items-center">
                                      <Typography className="text-xl">{objs.title}</Typography>
                                    </div>
                                  </div>
                                  {objs.preview === true ? (
                                    <>
                                      <FuseSvgIcon
                                        className="rounded-md hover:bg-gray-300"
                                        size={30}
                                        style={{ color: '#00000' }}
                                        onClick={() => Handle(key, objs, index)}
                                      >
                                        material-twotone:preview
                                      </FuseSvgIcon>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                                <hr className="mb-12" />
                                <DataTable
                                  className="rounded h-[270px]"
                                  columns={objs.headers.map((obj) =>
                                    createDataGridHeader(
                                      obj.field,
                                      obj.headerName,
                                      obj.width,
                                      obj.flex,
                                      obj.minWidth
                                    )
                                  )}
                                  pageSize={10}
                                  rowsPerPageOptions={[5, 10, 25]}
                                  rows={objs.tableBody.map((items, indexs) => ({
                                    id: indexs,
                                    ...items,
                                  }))}
                                />
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  );
                case 'StackedColumns':
                  return (
                    <div>
                      <Card>
                        <CardContent>
                          <Stacked Series={item.series} Categories={item.categories} />
                        </CardContent>
                      </Card>
                    </div>
                  );
                case 'LineColumn':
                  return (
                    <div>
                      <Card>
                        <CardContent>
                          <LineColumnChart
                            Series={item.series}
                            ChartHeight={item.height}
                            Labels={item.labels}
                            YAxisTitle={item.yaxisTitle}
                            OppositeYAxisTitle={item.yaxisOppositeTitle}
                            ChartTitle={item.chartTitle}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  );
                default:
                  return null; // Handle other cases if needed
              }
            })()}
          </Grid>
        ))}
      </Grid>

      <PreviewModal
        open={open}
        handleClose={handleClose}
        gridSummary={selectItem}
        clickedItem={selectIndex}
      />
    </div>
  );
}

export default DynamicDashboard;
