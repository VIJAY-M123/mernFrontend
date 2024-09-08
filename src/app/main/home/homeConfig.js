import WelcomePage from './welcomePage';

const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/home',
      element: <WelcomePage />,
    },
  ],
};

export default DashboardConfig;
