import { Button, Fab, IconButton, Typography } from '@mui/material';
// import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import utils from 'src/@utils';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector, useDispatch } from 'react-redux';
import { selectAgency } from 'app/store/agencySlice';
import { useCallback, useEffect, useState } from 'react';
import CustomizedTable, { makeHeader } from 'app/shared-components/CustomizedTable2';
import { Edit, FileCopy, FilterAlt } from '@mui/icons-material';
import { showMessage } from 'app/store/fuse/messageSlice';
import CogMenu from 'app/shared-components/CogMenu';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import customerLoginService from './service';
import CustomerLoginFilter from './widgets/CustomerLoginFilter';

const { fixArrayObjProps, arrayToExcelBuffer, downloadExcel } = utils;

const excelHeaders = {
  CL_USER_NAME: 'User Name',
  CL_USER_PASS: 'Password',
  CL_AR_CODE: 'Customer',
  CL_BP_CODE: 'Booking Party',
  CL_STATUS_CODE: 'Status',
};

const CustomerLoginMaster = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const agency = useSelector(selectAgency);

  const [rows, setRows] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);

  const getCustomerLogin = useCallback(
    (d) => {
      const data = { ...d };
      data.cp_id = agency?.cp_id;
      dispatch(showLoader());
      customerLoginService
        .getCustomerLogin(data)
        .then((res) => {
          dispatch(hideLoader());
          setRows(res || []);
        })
        .catch((err) => {
          dispatch(hideLoader());
          console.log(err);
        });
    },
    [agency?.cp_id, dispatch]
  );

  useEffect(() => {
    getCustomerLogin(filterData);
  }, [filterData, getCustomerLogin]);

  const handleDownload = (name) => {
    const data = fixArrayObjProps(rows.length ? rows : [{}], excelHeaders);

    if (!data.length) {
      dispatch(showMessage({ message: "Can't download empty details", variant: 'info' }));
      return;
    }
    arrayToExcelBuffer(data, name)
      .then((buffer) => downloadExcel(buffer, name))
      .catch((err) => dispatch(showMessage({ message: "Can't download excel", variant: 'error' })));
  };

  const handleCustomerLogin = (CL_ID) => navigate(`/masters/customer-login/${CL_ID}`);

  const handleCopyCustomerLogin = (CL_ID) => navigate(`/masters/customer-login/copy/${CL_ID}`);

  const handleAction = (e) => {
    return (
      <>
        <IconButton
          color="secondary"
          sx={{ height: '15px', width: '15px', fontSize: '20px', marginRight: 2 }}
          onClick={() => handleCopyCustomerLogin(e.row?.CL_ID)}
        >
          <FileCopy />
        </IconButton>
        <IconButton
          color="primary"
          sx={{ height: '15px', width: '15px', fontSize: '20px' }}
          onClick={() => handleCustomerLogin(e.row?.CL_ID)}
        >
          <Edit />
        </IconButton>
      </>
    );
  };

  const headers = [
    makeHeader('action', 'Action', null, null, null, true, handleAction),
    makeHeader('CL_USER_CODE', 'User Code'),
    makeHeader('CL_USER_NAME', 'User Name'),
    makeHeader('CL_USER_PASS', 'User Pass'),
    makeHeader('CL_AR_CODE', 'Customer'),
    makeHeader('CL_BP_CODE', 'Booking Party'),
    makeHeader('CL_STATUS_CODE', 'Status'),
  ];

  const onSubmit = (data) => {
    setFilterData(data);
    setOpenFilter(false);
    getCustomerLogin(data);
  };
  return (
    <div className="p-24">
      <div className="flex items-center justify-between sm:items-start space-y-8 sm:space-y-0 sm:mb-24 mb-16">
        <motion.span
          className="flex items-end"
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
        >
          <Typography
            component={Link}
            to="/masters/customer-login"
            className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
            role="button"
          >
            Customer Login Master
          </Typography>
        </motion.span>
        <div className="flex item-center gap-4 mb-4">
          <Button
            className="mx-8 whitespace-nowrap"
            variant="contained"
            color="secondary"
            component={Link}
            to="/masters/customer-login/new"
            startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
          >
            Create New
          </Button>
          <CogMenu
            menus={[
              {
                label: 'Download',
                onClick() {
                  handleDownload('CustomerLoginMaster');
                },
              },
            ]}
          />
        </div>
      </div>
      <Fab
        color="warning"
        className="absolute right-0 top-[250px] rounded-r-none rounded-l-20"
        onClick={() => setOpenFilter(true)}
      >
        <FilterAlt fontSize="large" />
      </Fab>

      <CustomizedTable className="mb-12 rounded" headers={headers} rows={rows} />
      <CustomerLoginFilter
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        onSubmit={onSubmit}
      />
    </div>
  );
};
export default CustomerLoginMaster;
