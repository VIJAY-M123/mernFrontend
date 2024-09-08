import Sales from './Sales';

const SalesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/dashboard/sales',
      element: <Sales />,
    },
  ],
};

export default SalesConfig;
