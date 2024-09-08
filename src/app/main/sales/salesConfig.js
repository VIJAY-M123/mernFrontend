import Invoice from './invoice/invoice';

const SalesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'sales/invoice',
      element: <Invoice />,
    },
  ],
};

export default SalesConfig;
