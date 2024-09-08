import AgencyDashboard from './AgencyDashboard';
import Dashboard from './Dashboard';
import DynamicDashboard from './DynamicDashboard';
import VehicleDashboard1 from './Vehicle Performance/VehicleDashboard';
import VehiclePerformance from './Vehicle Performance/VehiclePerformance';

const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/dashboards',
      element: <Dashboard />,
    },
    {
      path: 'dashboard/dynamic',
      element: <DynamicDashboard />,
    },
    {
      path: '/dashboard/vehicle-performance',
      element: <VehiclePerformance />,
    },
    {
      path: '/dashboard/vehicle-dashboard',
      element: <VehicleDashboard1 />,
    },
    {
      path: '/dashboard/agency',
      element: <AgencyDashboard />,
    },
  ],
};

export default DashboardConfig;
