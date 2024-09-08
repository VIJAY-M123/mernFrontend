import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'app/store/userSlice';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { NotInterested } from '@mui/icons-material';

import { selectAgency } from 'app/store/agencySlice';

import { Avatar } from '@mui/material';
import KillSession from './KillSession';

function UserMenu(props) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  console.log('userMenu', user);
  const agency = useSelector(selectAgency);

  const [userMenu, setUserMenu] = useState(null);
  const [open, setOpen] = useState(false);
  const [configEnable, setConfigEnable] = useState(false);

  // const CloseAndDeleteSession = useCallback(() => {
  //   const newData = {
  //     OLD_OBJ_TOKEN_ID: postSession?.OLD_OBJ_TOKEN_ID_OT,
  //   };
  //   dispatch(showLoader());
  //   dcService
  //     .deleteBLSessionLock(newData)
  //     .then((res) => {
  //       const newDatas = {
  //         USD_UR_ID: user?.data?.user_id,
  //         USD_CP_ID: agency?.cp_id,
  //         USD_TOKEN_ID: createSession?.USD_TOKEN_ID_OT,
  //       };
  //       dispatch(showLoader());
  //       dcService
  //         .closedUserSession(newDatas)
  //         .then((response) => {
  //           dispatch(hideLoader());
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           dispatch(showMessage({ message: err, variant: 'error' }));
  //         });
  //       dispatch(hideLoader());
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       dispatch(showMessage({ message: err, variant: 'error' }));
  //     });
  // }, [agency, createSession, dispatch, postSession, user]);

  /* useEffect(() => {
    rateRequestService
      .getAppConfigDetails({
        ACF_MODULE: 'DASHBOARD',
        ACF_PROGRAM_ID: 'LOGISTICS',
        ACF_PARAMETER: 'KILL_BL_SESSION',
        CP_ID: agency?.cp_id,
      })
      .then((res) => {
        const regex = new RegExp(`\\b${user.data.user_code}\\b`, 'i');
        setConfigEnable(
          regex.test(res[0]?.ACF_DESCRIPTION.toLowerCase() ?? ''.split(',')) &&
            res[0]?.ACF_VALUE === 'Y'
        );
      })
      .catch((err) => console.log(err));
  }, [agency, user]); */

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  return (
    <>
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {user.data.email}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="text.secondary">
            {user.role.toString()}
            {(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
          </Typography>
        </div>

        {user.data.photoURL ? (
          <Avatar className="md:mx-4" alt="user photo" src={user.data.photoURL} />
        ) : (
          <Avatar className="md:mx-4">{user.data.displayName[0]}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/sign-in" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </MenuItem>
            <MenuItem component={Link} to="/sign-up" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} to="/" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>
            {/* <MenuItem component={Link} to="/apps/mailbox" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:mail-open</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </MenuItem> */}

            <MenuItem
              component={Link}
              to="/change-password"
              onClick={() => {
                userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </MenuItem>
            {configEnable && (
              <MenuItem onClick={() => setOpen(true)}>
                <ListItemIcon className="min-w-40">
                  <NotInterested />
                </ListItemIcon>
                <ListItemText primary="Kill Session" />
              </MenuItem>
            )}
            <MenuItem
              component={NavLink}
              to="/sign-out"
              onClick={() => {
                // CloseAndDeleteSession();
                userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </MenuItem>
          </>
        )}
      </Popover>
      <KillSession open={open} setOpen={setOpen} />
    </>
  );
}

export default UserMenu;
