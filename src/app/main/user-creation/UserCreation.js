import { Button, Fab, IconButton, Tooltip, Typography } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAgency } from 'app/store/agencySlice';
import { selectUser } from 'app/store/userSlice';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { showMessage } from 'app/store/fuse/messageSlice';
import { Add, Edit } from '@mui/icons-material';
import CustomizedTable, { makeHeader } from 'app/shared-components/CustomizedTable2';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import UserCreationFilter from './widgets/UserCreationFilter';
import userCreationService from './service/UserCreationService';

const UserCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const agency = useSelector(selectAgency);

  const [openFilter, setOpenFilter] = useState(false);
  const [rows, setRow] = useState([]);
  const [filterData, setFilterData] = useState({});

  const handleUserCreationData = useCallback(
    (data) => {
      if (agency?.cp_id) {
        dispatch(showLoader());
        data.cp_id = agency.cp_id;
        data.user_id = user.data.user_id;
        userCreationService
          .getUserCreation(data)
          .then((res) => {
            dispatch(hideLoader());
            setRow(res);
          })
          .catch((err) =>
            dispatch(showMessage({ message: 'Something went wrong!', variant: 'error' }))
          );
      }
    },
    [dispatch, user, agency]
  );

  useEffect(() => {
    handleUserCreationData(filterData);
  }, [filterData, handleUserCreationData]);

  const handleEditCreation = (data) => navigate(`/user-creation/details/${data.USER_ID}`);

  const handleAction = (e) => {
    const data = e.row;
    return (
      <div className="flex items-center">
        <IconButton
          size="small"
          sx={{ height: '15px', width: '15px', fontSize: '20px', marginRight: 2 }}
          onClick={() => handleEditCreation(data)}
        >
          <Edit />
        </IconButton>
      </div>
    );
  };

  const headers = [
    makeHeader('action', 'Action', null, '50px', null, true, handleAction),
    makeHeader('USER_CODE', 'User Code'),
    makeHeader('USER_NAME', 'User Name'),
    makeHeader('USER_STATUS_CODE', 'Status'),
    makeHeader('USER_CREATED_ON', 'Created On', 'date'),
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
              component={Link}
              to="/user-creation/"
              className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
              role="button"
            >
              User Creation
            </Typography>
          </motion.span>
          <div className="flex item-center gap-4 mb-4">
            <Button
              className="mx-8 whitespace-nowrap"
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              component={Link}
              to="/user-creation/create"
            >
              Create New
            </Button>
          </div>
          <Tooltip title="Filter">
            <Fab
              color="warning"
              className="absolute right-0 top-[250px] rounded-r-none rounded-l-20"
              onClick={() => setOpenFilter(true)}
            >
              <FilterAltIcon fontSize="large" />
            </Fab>
          </Tooltip>
        </div>

        <CustomizedTable
          headers={headers}
          className="rounded"
          disablePageReset
          tableProps={rows.length && { className: 'h-[500px]' }}
          rows={rows.map((data) => ({ ...data, id: data.USER_ID }))}
        />
      </motion.div>
      <UserCreationFilter
        setOpenFilter={setOpenFilter}
        openFilter={openFilter}
        handleUserCreationData={handleUserCreationData}
        setFilterData={setFilterData}
      />
    </div>
  );
};

export default UserCreation;
