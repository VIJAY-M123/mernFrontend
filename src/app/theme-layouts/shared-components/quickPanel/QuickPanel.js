import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, IconButton } from '@mui/material';
import { ChevronRight, Close } from '@mui/icons-material';
import { selectAgency, selectModule, setModule } from 'app/store/agencySlice';
import { selectUser } from 'app/store/userSlice';
import JwtService from 'src/app/auth/services/jwtService';
import { setNavigation } from 'app/store/fuse/navigationSlice';
import utils from 'src/@utils';
import { useNavigate } from 'react-router-dom';
import reducer from './store';
import { selectQuickPanelState, toggleQuickPanel } from './store/stateSlice';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 400,
  },
}));
const { filterMenus } = utils;
function QuickPanel(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const state = useSelector(selectQuickPanelState);
  const module = useSelector(selectModule);
  const user = useSelector(selectUser);
  const agency = useSelector(selectAgency);

  const AccessValues = user.data.user_project_access_xml?.map((i) => i.upa_project_name);
  // console.log(module);

  const handleChange = (a) => {
    dispatch(setModule(a));
    JwtService.getNavigation({
      cp_id: agency.cp_id,
      user_id: user.data.user_id,
      KEY_VAL: a.upa_project_name,
    })
      .then((res) => dispatch(setNavigation(filterMenus(res))))
      .catch((err) => dispatch(setNavigation([])));

    navigate('/home');
    dispatch(toggleQuickPanel());
  };
  return (
    <StyledSwipeableDrawer
      open={state}
      anchor="right"
      onOpen={(ev) => {}}
      onClose={(ev) => dispatch(toggleQuickPanel())}
      disableSwipeToOpen
    >
      <div className="p-24">
        <div className="flex justify-between">
          <Typography variant="h5" className="font-bold">
            Module
          </Typography>
          <IconButton onClick={() => dispatch(toggleQuickPanel())}>
            <Close />
          </IconButton>
        </div>
        <hr className="mb-12" />
        {AccessValues?.includes('LTR') && (
          <Card
            onClick={() => handleChange({ upa_project_name: 'LTR' })}
            className={`rounded px-2 mb-12 ${
              module?.upa_project_name?.match(/LTR/i) && 'bg-grey-200'
            }`}
          >
            <CardContent className="h-60 p-[9px] pt-[16px] flex justify-between items-center">
              <div className="mt-4 flex justify-between items-center">
                <img
                  src="assets/images/ModuleLogo/Zealit ShalExpress.png"
                  alt="logo"
                  className="mt-4 rounded w-52 h-52 p-4"
                />
                <Typography className="text-18 px-12">Zealit - ShalExpress</Typography>
              </div>
              <IconButton className="flex justify-end px-1 items-center">
                <ChevronRight className="font-bold text-28" />
              </IconButton>
            </CardContent>
          </Card>
        )}
        {AccessValues?.includes('CRM') && (
          <Card
            onClick={() => handleChange({ upa_project_name: 'CRM' })}
            className={`rounded px-2 mb-12 ${
              module?.upa_project_name?.match(/CRM/i) && 'bg-grey-200'
            }`}
          >
            <CardContent className="h-60 p-[9px] pt-[16px] flex justify-between items-center">
              <div className="mt-4 flex justify-between items-center">
                <img
                  src="assets/images/ModuleLogo/Zealit CRM.png"
                  alt="logo"
                  className="mt-4 rounded w-52 h-52 p-4"
                />
                <Typography className="text-18 px-12">Zealit - CRM</Typography>
              </div>
              <IconButton className="flex justify-end px-1 items-center">
                <ChevronRight className="font-bold text-28" />
              </IconButton>
            </CardContent>
          </Card>
        )}
        {AccessValues?.includes('LOGISTICS') && (
          <Card
            onClick={() => handleChange({ upa_project_name: 'LOGISTICS' })}
            className={`rounded px-2 mb-12 ${
              module?.upa_project_name?.match(/LOGISTICS/i) && 'bg-grey-200'
            }`}
          >
            <CardContent className="h-60 p-[9px] pt-[16px] flex justify-between items-center">
              <div className="mt-4 flex justify-between items-center">
                <img
                  src="assets/images/ModuleLogo/Zealit Nvocc.png"
                  alt="logo"
                  className="mt-4 rounded w-52 h-52 p-4"
                />
                <Typography className="text-18 px-12">Zealit - NVOCC</Typography>
              </div>
              <IconButton className="flex justify-end px-1 items-center">
                <ChevronRight className="font-bold text-28" />
              </IconButton>
            </CardContent>
          </Card>
        )}
        {AccessValues?.includes('DEPOT') && (
          <Card
            onClick={() => handleChange({ upa_project_name: 'DEPOT' })}
            className={`rounded px-2 mb-12 ${
              module?.upa_project_name?.match(/DEPOT/i) && 'bg-grey-200'
            }`}
          >
            <CardContent className="h-60 p-[9px] pt-[16px] flex justify-between items-center">
              <div className="mt-4 flex justify-between items-center">
                <img
                  src="assets/images/ModuleLogo/Zealit Depot.png"
                  alt="logo"
                  className="mt-4 rounded w-52 h-52 p-4"
                />
                <Typography className="text-18 px-12">Zealit - Depot</Typography>
              </div>
              <IconButton className="flex justify-end px-1 items-center">
                <ChevronRight className="font-bold text-28" />
              </IconButton>
            </CardContent>
          </Card>
        )}
        {AccessValues?.includes('CHA') && (
          <Card
            onClick={() => handleChange({ upa_project_name: 'CHA' })}
            className={`rounded px-2 mb-12 ${
              module?.upa_project_name?.match(/CHA/i) && 'bg-grey-200'
            }`}
          >
            <CardContent className="h-60 p-[9px] pt-[16px] flex justify-between items-center">
              <div className="mt-4 flex justify-between items-center">
                <img
                  src="assets/images/ModuleLogo/CustomsHouseAgent.png"
                  alt="logo"
                  className="mt-4 rounded w-52 h-52 p-4"
                />
                <Typography className="text-18 px-12">Customs House Agent</Typography>
              </div>
              <IconButton className="flex justify-end px-1 items-center">
                <ChevronRight className="font-bold text-28" />
              </IconButton>
            </CardContent>
          </Card>
        )}
      </div>
    </StyledSwipeableDrawer>
  );
}

export default withReducer('quickPanel', reducer)(memo(QuickPanel));
