import { Add, Edit, FileCopy, FilterAlt } from '@mui/icons-material';
import {
  Button,
  Fab,
  Switch,
  Tooltip,
  Typography,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import utils from 'src/@utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectAgency } from 'app/store/agencySlice';
import { selectUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import CogMenu from 'app/shared-components/CogMenu';
import CustomizedTable, { makeHeader } from 'app/shared-components/CustomizedTable2';
import AgencyMoveMasterFilter from './widgets/AgencyMoveMasterFilter';
import agencyMoveService from './service';
import AgencyMoveMasterModal from './AgencyMoveMasterModal';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const { arrayToExcelBuffer, downloadExcel, fixArrayObjProps } = utils;

const excelHeaders = {
  CM_ID: 'CM_ID',
  CM_CODE: 'Move Code',
  CM_DESC: 'Move Description',
  CM_VESSEL: 'Vessel',
  CM_VOYAGE: 'Voyage',
  CM_TYPE: 'Type',
  CM_STATUS: 'Status',
  CM_CUR_PORT: 'Current Port',
  CM_NXT_PORT: 'Next Port',
  CM_CUR_TER: 'Current Terminal',
  CM_NXT_TER: 'Next Terminal',
  CM_CUR_DPT: 'Current Depot',
  CM_NXT_DPT: 'Next Depot',
  CM_CUR_LOC: 'Current Location',
  CM_NXT_LOC: 'Next Location',
  CM_TRANS_MODE: 'Transport Mode',
  CM_TRUCK_NUM: 'Truck Number',
  CM_BKG_NUM: 'Booking Number',
  CM_BL_NUM: 'BL Number',
  CM_RREQ_NUM: 'Release Request Number',
  CM_REF_NUM: 'Reference Number',
  CM_AR: 'Customer',
  CM_AP: 'Vendor',
  CM_CUS_PO_NUM: 'PO Number',
  CM_DO_NUM: 'DO Number',
  CM_LR_NUM: 'LR Number',
  CM_BE_NUM: 'BE Number',
  CM_INV_NUM: 'Invoice Number',
  CM_JOB_NUM: 'Job Number',
  CM_PLA_NAME: 'Plant',
  CM_AP_NAME: 'Ware House',
};

const AgencyMoveMaster = () => {
  const dispatch = useDispatch();
  const agency = useSelector(selectAgency);
  const user = useSelector(selectUser);

  const [openFilter, setOpenFilter] = useState(false);
  const [rows, setRows] = useState([]);
  const [editData, setEditData] = useState(null);
  const [copy, setCopy] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState(true);

  const handleAgencyMoveData = useCallback(
    (data) => {
      if (agency?.cp_id) {
        data.cp_id = agency.cp_id;
        data.user_id = user.data.user_id;
        data.status = active ? 'ACT' : 'DACT';
        dispatch(showLoader());
        agencyMoveService
          .getAgencyMove(data)
          .then((res) => {
            setRows(res.map((i, id) => ({ id, ...i })));
            dispatch(hideLoader());
          })
          .catch((err) => {
            dispatch(hideLoader());
            dispatch(showMessage({ message: 'Something went wrong!', variant: 'error' }));
          });
      }
    },
    [agency, user, active, dispatch]
  );

  useEffect(() => {
    handleAgencyMoveData(filterData);
  }, [filterData, handleAgencyMoveData]);

  const handleAgencyMove = (data) => {
    setEditData(data?.CM_ID);
    setModalOpen(true);
  };

  const handleCopyAgencyMove = (data) => {
    setCopy('Copy');
    setEditData(data?.CM_ID);
    setModalOpen(true);
  };

  const handleDownload = (name) => {
    const data = fixArrayObjProps(rows.length ? rows : [{}], excelHeaders);

    arrayToExcelBuffer(data, name)
      .then((buffer) => {
        downloadExcel(buffer, name);
      })
      .catch((err) => {
        dispatch(showMessage({ message: "Can't download excel", variant: 'error' }));
      });
  };

  const handleAction = (e) => {
    return (
      <div>
        <Tooltip title="Edit">
          <IconButton color="primary" size="small" onClick={() => handleAgencyMove(e.row)}>
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy">
          <IconButton color="secondary" size="small" onClick={() => handleCopyAgencyMove(e.row)}>
            <FileCopy fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  const headers = [
    makeHeader('action', 'Actions', null, '50px', null, true, handleAction),
    makeHeader('CM_CODE', 'Move Code'),
    makeHeader('CM_DESC', 'Move Description'),
    makeHeader('CM_TYPE', 'Type'),
    makeHeader('CM_VESSEL', 'Vessel'),
    makeHeader('CM_VOYAGE', 'Voyage'),
    makeHeader('CM_STATUS', 'Status'),
  ];

  return (
    <div className="p-24">
      <motion.div
        component={motion.div}
        initial={{ x: 200 }}
        animate={{ x: 0 }}
        transition={{ bounceDamping: 0 }}
      >
        <div className="flex items-center justify-between sm:items-start space-y-8 sm:space-y-0 sm:mb-24 mb-16">
          <motion.span
            className="flex items-end"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
          >
            <Typography
              className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
              role="button"
            >
              Agency Move
            </Typography>
          </motion.span>
          <div className="flex item-center gap-12 mb-4">
            <FormControlLabel
              control={
                <IOSSwitch sx={{ m: 1 }} checked={active} onChange={() => setActive(!active)} />
              }
            />
            <Button
              variant="contained"
              className="mx-8 whitespace-nowrap"
              startIcon={<Add />}
              color="secondary"
              onClick={() => setModalOpen(true)}
            >
              Create New
            </Button>
            <CogMenu
              menus={[
                {
                  label: 'Download',
                  onClick() {
                    handleDownload('Agency Move');
                  },
                },
              ]}
            />
          </div>
          <Tooltip title="Filter Agency">
            <Fab
              color="warning"
              className="absolute right-0 top-[250px] rounded-r-none rounded-l-20"
              onClick={() => setOpenFilter(true)}
            >
              <FilterAlt fontSize="large" />
            </Fab>
          </Tooltip>
        </div>
        <hr className="my-14" />
        <CustomizedTable
          tableProps={{ className: 'h-[550px]' }}
          className="rounded"
          headers={headers}
          disablePageReset
          rows={rows}
        />
      </motion.div>
      <AgencyMoveMasterFilter
        setOpenFilter={setOpenFilter}
        openFilter={openFilter}
        handleAgencyMoveData={handleAgencyMoveData}
        setFilterData={setFilterData}
      />
      <AgencyMoveMasterModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setEditData={setEditData}
        editData={editData}
        setCopy={setCopy}
        copy={copy}
        handleAgencyMoveData={handleAgencyMoveData}
        filterData={filterData}
      />
    </div>
  );
};
export default AgencyMoveMaster;
