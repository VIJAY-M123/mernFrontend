import { Button, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import utils from 'src/@utils';
import { selectAgency } from 'app/store/agencySlice';
import AddIcon from '@mui/icons-material/Add';
import { selectUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import CogMenu from 'app/shared-components/CogMenu';
import AlertDialog from 'app/shared-components/AlertDialog';
import { Edit } from '@mui/icons-material';
import CustomizedTable, { makeHeader } from 'app/shared-components/CustomizedTable2';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import userRoleService from './service';

const { fixArrayObjProps, arrayToExcelBuffer, downloadExcel } = utils;

const excelHeaders = {
  UR_ID: 'UR_ID',
  UR_CODE: 'Role Code',
  UR_DESC: 'Role Description',
};

const UserRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const agency = useSelector(selectAgency);
  const user = useSelector(selectUser);
  const [rows, setRows] = useState([]);

  const handleUserData = useCallback(
    (data) => {
      if (agency?.cp_id) {
        dispatch(showLoader());
        data.cp_id = agency.cp_id;
        data.user_id = user.data.user_id;
        userRoleService
          .getUserRoleManagement(data)
          .then((res) => {
            dispatch(hideLoader());
            setRows(res);
          })
          .catch((err) => {
            dispatch(showMessage({ message: 'Something went wrong!', variant: 'error' }));
          });
      }
    },

    [agency, user, dispatch]
  );
  useEffect(() => {
    handleUserData({});
  }, [handleUserData]);

  const handleAction = (e) => {
    return (
      <IconButton
        sx={{ height: '15px', width: '15px', fontSize: '20px', marginRight: 2 }}
        onClick={() => handleEditUser(e.row.UR_ID)}
      >
        <Edit />
      </IconButton>
    );
  };

  const headers = [
    makeHeader('action', 'Actions', null, '50px', null, true, handleAction),
    makeHeader('UR_CODE', 'Role Code'),
    makeHeader('UR_DESC', 'Role Description'),
  ];

  const handleDownload = (name) => {
    const dr = rows.length ? rows : [Array.from(Array(10).keys()).map(() => ({}))];
    const data = fixArrayObjProps(dr, excelHeaders);

    arrayToExcelBuffer(data, name)
      .then((buffer) => downloadExcel(buffer, name))
      .catch(() => dispatch(showMessage({ message: "Can't download excel", variant: 'error' })));
  };

  const handleEditUser = (UR_ID) => navigate(`/masters/user-role/details/${UR_ID}`);

  return (
    <div className="p-24">
      <motion.div
        className="w-full"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        initial="hidden"
        animate="show"
      >
        <div className="flex items-center justify-between sm:items-start space-y-8 sm:space-y-0 sm:mb-24 mb-16">
          <Typography
            className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
            role="button"
          >
            User Role Management
          </Typography>
          <div className="flex item-center gap-4 mb-4">
            <Button
              variant="contained"
              className="mb-4 rounded-4xl"
              startIcon={<AddIcon />}
              color="secondary"
              component={Link}
              to="/masters/user-role/new"
            >
              Create New
            </Button>
            <CogMenu
              menus={[
                {
                  label: 'Download',
                  onClick() {
                    handleDownload('User Role Management');
                  },
                },
              ]}
            />
          </div>
        </div>

        <CustomizedTable className="rounded" headers={headers} rows={rows} />
      </motion.div>
      <AlertDialog />
    </div>
  );
};

export default UserRole;
