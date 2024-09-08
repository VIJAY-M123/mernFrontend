import Reports from './Reports';
import CrystalReport from './widgets/CrystalReport';
import ExcelReport from './widgets/ExcelReport';
import GridReport from './widgets/GridReport';
import PivotReport from './widgets/PivotReport';
import DrillDownReport from './widgets/DrillDownReport';
import DynamicReport from './widgets/DynamicColumnReport';

const ReportsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'reports/index',
      element: <Reports />,
    },
    {
      path: 'reports/grid-report/:id',
      element: <GridReport />,
    },
    {
      path: 'reports/crystal-report/:id',
      element: <CrystalReport />,
    },
    {
      path: 'reports/pivot-report/:id',
      element: <PivotReport />,
    },
    {
      path: 'reports/excel-report/:id',
      element: <ExcelReport />,
    },
    {
      path: 'reports/drilldown-report/:id',
      element: <DrillDownReport />,
    },
    {
      path: 'reports/dynamic',
      element: <DynamicReport />,
    },
    // {
    //   path: 'reports/mis-report',
    //   element: <MisReport />,
    // },
    // {
    //   path: 'reports/pod-report',
    //   element: <PodReport />,
    // },
    // {
    //   path: 'reports/load-request',
    //   element: <LoadRequest />,
    // },
    // {
    //   path: 'reports/loading-sheet',
    //   element: <LoadingSheet />,
    // },
    // {
    //   path: 'reports/vehicle-register',
    //   element: <VehicleRegister />,
    // },
  ],
};

export default ReportsConfig;
