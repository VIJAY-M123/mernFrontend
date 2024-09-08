import Inventory from './Inventory-Optimization/Inventory';

const LogisticConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'logistic/inventory',
      element: <Inventory />,
    },
  ],
};

export default LogisticConfig;
