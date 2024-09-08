import AgencyMoveMaster from './AgencyMoveMaster';

const AgencyMoveMasterConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'move-master',
      element: <AgencyMoveMaster />,
    },
  ],
};

export default AgencyMoveMasterConfig;
