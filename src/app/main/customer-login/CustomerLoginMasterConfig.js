import CustomerLoginMaster from './CustomerLoginMaster';
import CustomerLoginMasterDetails from './CustomerLoginMasterDetails';

const CustomerLoginMasterConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'masters/customer-login',
      element: <CustomerLoginMaster />,
    },
    {
      path: 'masters/customer-login/new',
      element: <CustomerLoginMasterDetails />,
    },
    {
      path: 'masters/customer-login/:id',
      element: <CustomerLoginMasterDetails />,
    },
    {
      path: 'masters/customer-login/copy/:id',
      element: <CustomerLoginMasterDetails />,
    },
  ],
};

export default CustomerLoginMasterConfig;
