import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import utils from 'src/@utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectAgency } from 'app/store/agencySlice';
import { selectUser } from 'app/store/userSlice';
import { useEffect, useState } from 'react';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/DataTable';
import LrtDashboardService from '../service';
import PreviewModal from './Modal/PreviewModal';

const { createDataGridHeader, getDate, fixArrayDates } = utils;

const table = [
  {
    title: 'Trip Details',
    icon: 'material-outline:electric_car',
    iconColor: '#57DE0F',
    headers: [
      {
        field: 'VRID',
        headerName: 'VR_ID',
        width: 0,
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'AgencyName',
        headerName: 'Agency Name',
        width: 0,
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'VendorName',
        headerName: 'Vendor Name',
        width: 0,
        flex: 1,
        minWidth: 100,
      },
    ],

    tableBody: [
      {
        VRID: 3278,
        AgencyName: 'Chennai TR',
        VendorName: 'SHAL VEHICLE',
      },
    ],
  },
  {
    title: 'Fuel Details',
    icon: 'material-outline:electric_car',
    iconColor: '#1C96DC',
    headers: [
      {
        field: 'FDID',
        headerName: 'FD_ID',
        width: 0,
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'TruckNumber',
        headerName: 'Truck Number',
        width: 0,
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'Vendor',
        headerName: 'Vendor',
        width: 0,
        flex: 1,
        minWidth: 100,
      },
    ],
    tableBody: [
      {
        FDID: 14,
        TruckNumber: 'TN04BC0857',
        Vendor: 'HPCL Drive Track',
      },
    ],
  },
  {
    title: 'Toll Expenses',
    icon: 'material-outline:electric_car',
    iconColor: '#EE3A52',
    headers: [
      {
        field: 'TIME',
        headerName: 'TIME & DATE',
        width: 0,
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'CATEGORY',
        headerName: 'CATEGORY',
        width: 0,
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'TRANSACTION',
        headerName: 'TRANSACTION NUMBER',
        width: 0,
        flex: 1,
        minWidth: 100,
      },
    ],
    tableBody: [
      {
        TIME: '30-09-2023, 17:42',
        CATEGORY: 'AutoPay - 00100223093017452055991(TN04BC0857) - 36',
        TRANSACTION: '00100223093017452055991',
      },
    ],
  },
];

function VehicleDashboard() {
  const location = useLocation();

  const { id, fromDates, toDates } = location.state;
  const TrackNumber = id['Truck Number'];

  const dispatch = useDispatch();
  const agency = useSelector(selectAgency);
  const user = useSelector(selectUser);

  const [vehicleDashboard, setVehicleDashboard] = useState([]);
  const [vehicleDataGrid, setvehicleDataGrid] = useState([]);
  const [open, setOpen] = useState(false);
  const [clickedItems, setClickedItem] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          cp_id: agency?.cp_id,
          user_id: user.data.user_id,
          from_date: fromDates,
          to_date: toDates,
          trk_number: TrackNumber,
        };
        dispatch(showLoader());
        const message = await LrtDashboardService.getVehicleDashboard(data);
        dispatch(hideLoader());
        setVehicleDashboard(message);
      } catch (error) {
        dispatch(hideLoader());
        dispatch(showMessage({ message: error, variant: 'error' }));
      }
    };

    fetchData();
  }, [TrackNumber, agency, dispatch, fromDates, toDates, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          cp_id: agency?.cp_id,
          user_id: user.data.user_id,
          from_date: fromDates,
          to_date: toDates,
          trk_id: TrackNumber,
        };
        dispatch(showLoader());
        const message = await LrtDashboardService.getVehicleGrid(data);
        dispatch(hideLoader());
        setvehicleDataGrid(message);
      } catch (error) {
        dispatch(hideLoader());
        dispatch(showMessage({ message: error, variant: 'error' }));
      }
    };

    fetchData();
  }, [TrackNumber, agency, dispatch, fromDates, toDates, user]);

  const Handle = (index) => {
    setOpen(true);
    setClickedItem(index);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="p-24">
      <Typography variant="h5" className="mb-12">
        Vehicle Dashboard - {id['Truck Number']}
      </Typography>
      <Button
        className="mb-12"
        component={Link}
        to="/dashboard/vehicle-performance"
        color="secondary"
        startIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>}
      >
        Back to Dashboard
      </Button>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {vehicleDashboard.map((obj, ids) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={ids}>
                <Card
                  component={motion.div}
                  initial={{ x: 500 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.3, bounceDamping: 0 }}
                  // onClick={() => onClick(obj, ids)}
                >
                  <CardContent>
                    <Grid className="flex justify-end">
                      <FuseSvgIcon
                        className="text-48 p-3 rounded-md"
                        size={40}
                        sx={{
                          color: '#FFF',
                          backgroundColor: obj.COLOR,
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                          },
                        }}
                      >
                        {obj.ICON}
                      </FuseSvgIcon>
                    </Grid>
                    <Grid>
                      <Typography className="font-bold mb-10 mt-12" sx={{ fontSize: '15px' }}>
                        {obj.FIELD}
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography className="" sx={{ fontSize: '16px' }}>
                        {obj.TOTAL}
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {vehicleDataGrid.map((items, indexs) => (
              <Grid item xs={12} sm={12} md={12} lg={6} key={indexs}>
                <Card
                  component={motion.div}
                  initial={{ x: -500 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.3, bounceDamping: 0 }}
                  sx={{ maxHeight: '350px' }}
                >
                  <CardContent>
                    <div className="flex mb-12 justify-between">
                      <div className="flex">
                        <FuseSvgIcon size={30} style={{ color: items.iconColor }}>
                          {items.icon}
                        </FuseSvgIcon>
                        <div className="ml-12 flex items-center">
                          <Typography className="text-xl">{items.title}</Typography>
                        </div>
                      </div>
                      <FuseSvgIcon
                        className="rounded-md hover:bg-gray-300"
                        size={30}
                        style={{ color: '#00000' }}
                        onClick={() => Handle(indexs)}
                      >
                        material-twotone:preview
                      </FuseSvgIcon>
                    </div>
                    <hr className="mb-12" />
                    <DataTable
                      className="rounded h-[270px]"
                      columns={
                        items.tableBody && items.tableBody.length > 0
                          ? Object.keys(items.tableBody[0]).map((key) =>
                              createDataGridHeader(key, key, 1, 0, 150)
                            )
                          : []
                      }
                      pageSize={10}
                      rowsPerPageOptions={[5, 10, 25]}
                      rows={
                        items.tableBody === null
                          ? []
                          : items.tableBody.map((item, index) => ({
                              id: index,
                              ...item,
                            }))
                      }
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <PreviewModal
        open={open}
        handleClose={handleClose}
        gridSummary={vehicleDataGrid}
        clickedItem={clickedItems}
      />
    </div>
  );
}

export default VehicleDashboard;
