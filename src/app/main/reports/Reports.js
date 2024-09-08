import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { selectAgency, selectModule } from 'app/store/agencySlice';
import _ from '@lodash';
import { useNavigate } from 'react-router-dom';
import { Grid, Tooltip } from '@mui/material';
import CustomizedTabs from 'app/shared-components/CustomizedTabs';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import { showMessage } from 'app/store/fuse/messageSlice';
import ComboBox from 'app/shared-components/ComboBox';
import reportsService from './service';

const createHeader = (color, icon, bg) => ({ color, icon, bg });

const CustomToolTip = (props) => {
  const [isOverflowed, setIsOverflow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setIsOverflow(ref.current.scrollHeight > ref.current.clientHeight);
  }, []);

  return (
    <Tooltip title={props.title} disableHoverListener={!isOverflowed}>
      <div ref={ref} className="line-clamp-6 max-h-[130px]">
        {props.title}
      </div>
    </Tooltip>
  );
};

const Reports = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const agency = useSelector(selectAgency);
  const module = useSelector(selectModule);

  const [menu, setMenu] = useState([]);

  useEffect(() => {
    reportsService
      .getReportMenu({
        PROGRAM_ID: 'RP0001',
        USER_ID: user?.data.user_id,
        CP_ID: agency?.cp_id,
        PG_KEY_VALUE: module.upa_project_name || user.data.default_project_name,
      })
      .then((data) => {
        setMenu(
          _.groupBy(
            data.filter((d) => d.PG_REPORT_TYPE),
            'SM_NAME'
          )
        );
      })
      .catch((err) => {
        console.log(err);
        setMenu([]);
      });
  }, [agency, module, user]);

  const handleReport = (type, code) => {
    if (type === 'C') {
      navigate(`/reports/crystal-report/${code}`);
      return;
    }

    if (type === 'P') {
      navigate(`/reports/grid-report/${code}`);
      return;
    }

    if (type === 'Q') {
      navigate(`/reports/pivot-report/${code}`);
      return;
    }

    if (type === 'D') {
      navigate(`/reports/drilldown-report/${code}`);
      return;
    }

    if (type === 'EX') {
      navigate(`/reports/excel-report/${code}`);
      return;
    }

    dispatch(showMessage({ message: 'Invaild Report', variant: 'error' }));
  };

  const config = {
    C: createHeader('error', 'pdf.svg', 'bg-red-600'),
    P: createHeader('action', 'grid.svg', 'bg-blue-600'),
    D: createHeader('primary', 'drill.png', 'bg-blue-500'),
    Q: createHeader('warning', 'pivot.png', 'bg-orange-600'),
    EX: createHeader('success', 'xls.svg', 'bg-green-600'),
  };

  const isNew = (date, add = 30) => {
    const compareDate = new Date(date);
    compareDate.setMilliseconds(1000 * 24 * 60 * 60 * add);

    if (date && compareDate > new Date()) return true;

    return false;
  };

  return (
    <div className="p-24">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="text-3xl sm:text-7xl font-extrabold tracking-tight leading-tigh mb-16">
          Reports
        </div>
        <div className="max-w-[450px] w-full">
          <ComboBox
            className="w-full mb-16 sm:mb-0"
            field={{}}
            label="Search and Select"
            opts={Object.values(menu).reduce((a, b) => [...a, ...b], [])}
            displayExpr="PG_NAME"
            valueExpr="PG_ID"
            handleChange={(e) => handleReport(e.PG_REPORT_TYPE, e.PG_REPORT_ID)}
          />
        </div>
      </div>

      <CustomizedTabs
        tabsProps={{
          allowScrollButtonsMobile: true,
          sx: { borderBottom: 1, borderColor: 'divider' },
        }}
        tabs={Object.keys(menu).map((m) => ({
          tab: { label: m },
          panel: {
            children: (
              <Grid container spacing={2}>
                {menu[m].map(
                  ({ PG_NAME: name, PG_REPORT_TYPE: type, PG_DESC: desc, ...item }, j) => {
                    const con = config[type];
                    return (
                      <Grid item key={j} xs={12} sm={6} md={4} lg={3}>
                        <div
                          className="group relative bg-white border border-gray-200 cursor-pointer rounded-xl shadow h-[150px] overflow-hidden"
                          onClick={() => handleReport(type, item.PG_REPORT_ID)}
                          onKeyDown={() => handleReport(type, item.PG_REPORT_ID)}
                          role="button"
                          tabIndex={0}
                        >
                          {isNew(item.PG_CREATED_ON) && (
                            <div className="absolute bg-red-600 font-semibold text-center text-white text-sm w-96 rotate-[-45deg] top-[10px] left-[-30px]">
                              new
                            </div>
                          )}
                          <div className="flex flex-col items-center justify-center h-[150px] p-12">
                            {con?.icon.match(/\./) ? (
                              <img
                                alt="report img"
                                className="h-56"
                                src={`assets/images/custom/report/${con.icon}`}
                              />
                            ) : (
                              <FuseSvgIcon color={con?.color || 'error'} size={56}>
                                {con?.icon || 'material-solid:broken_image'}
                              </FuseSvgIcon>
                            )}

                            <div className="font-semibold text-center mt-12">{name}</div>
                          </div>
                          {!!desc && (
                            <div
                              className={`group-hover:translate-y-[-150px] ${con?.bg} font-semibold h-[150px] p-12 text-white transition`}
                            >
                              <CustomToolTip title={desc} />
                            </div>
                          )}
                        </div>
                      </Grid>
                    );
                  }
                )}
              </Grid>
            ),
            props: {
              sx: {
                backgroundColor: (theme) => `${theme.palette.background.default}!important`,
              },
            },
          },
        }))}
      />
    </div>
  );
};

export default Reports;
