import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import ReportsConfig from '../main/reports/ReportsConfig';
import DashboardConfig from '../main/dashboards/DashboardConfig';
import homeConfig from '../main/home/homeConfig';
import UploadConfig from '../main/upload/UploadConfig';
import ProjectConfig from '../main/project/projectCofig';
import SalesConfig from '../main/sales/salesConfig';
import FindOfficeConfig from '../main/office/FindOfficeConfig';
import UserCreationConfig from '../main/user-creation/UserCreationConfig';
import ChangePasswordConfig from '../main/changePassword/ChangePasswordConfig';
import CustomerLoginMasterConfig from '../main/customer-login/CustomerLoginMasterConfig';
import UserRoleConfig from '../main/user-role/UserRoleConfig';
import AgencyMoveMasterConfig from '../main/agency-move/AgencyMoveMasterConfig';
import MarketingConfig from '../main/marketing-anaytics/marketingConfig';
import LogisticConfig from '../main/logistics-analytics/logisticsConfig';

const routeConfigs = [
  DashboardConfig,
  ReportsConfig,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  homeConfig,
  FindOfficeConfig,
  UploadConfig,
  SalesConfig,
  ProjectConfig,
  UserCreationConfig,
  UserRoleConfig,
  ChangePasswordConfig,
  CustomerLoginMasterConfig,
  AgencyMoveMasterConfig,
  MarketingConfig,
  LogisticConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="/home" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
];

export default routes;
