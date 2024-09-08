import { Business, LocationOn } from '@mui/icons-material';
import { Button, Grid, Typography } from '@mui/material';
import { selectModule } from 'app/store/agencySlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();
  const module = useSelector(selectModule);
  const handleOffice = () => {
    navigate('/find-office');
  };

  const handleTracking = () => {
    navigate('/tracking');
  };

  function getContentToRender(Key) {
    switch (Key) {
      case 'LTR':
        return (
          <>
            <Typography
              className="text-[50px] flex justify-center items-center uppercase font-['roman']"
              color="#201652"
            >
              Welcome
            </Typography>
            <Typography
              className="text-[16px] font-bold flex justify-center items-center font-['roman']"
              color="#201652"
            >
              TO OUR
            </Typography>
            <Typography className="flex justify-center items-center">
              <img className="w-1/3" src="assets/images/logo/logo-shalx-text.svg" alt="logo" />
            </Typography>
          </>
        );

      case 'CRM':
        return (
          <>
            <Typography
              className="text-[50px] flex justify-center items-center uppercase font-['roman']"
              color="#F28E1D"
            >
              Welcome
            </Typography>
            <Typography
              className="text-[16px] font-bold flex justify-center items-center font-['roman']"
              color="#F28E1D"
            >
              TO OUR
            </Typography>
            <Typography className="flex justify-center items-center">
              <img className="w-1/3" src="assets/images/logo/logo-crm-text.svg" alt="logo" />
            </Typography>
          </>
        );

      case 'LOGISTICS':
        return (
          <>
            <Typography
              className="text-[50px] flex justify-center items-center uppercase font-['roman']"
              color="#F28E1D"
            >
              Welcome
            </Typography>
            <Typography
              className="text-[16px] font-bold flex justify-center items-center font-['roman']"
              color="#F28E1D"
            >
              TO OUR
            </Typography>
            <Typography className="flex justify-center items-center">
              <img className="w-1/3" src="assets/images/logo/logo-zealit-text.svg" alt="logo" />
            </Typography>
          </>
        );

      case 'DEPOT':
        return (
          <>
            <Typography
              className="text-[50px] flex justify-center items-center uppercase font-['roman']"
              color="#F28E1D"
            >
              Welcome
            </Typography>
            <Typography
              className="text-[16px] font-bold flex justify-center items-center font-['roman']"
              color="#F28E1D"
            >
              TO OUR
            </Typography>
            <Typography className="flex justify-center items-center">
              <img className="w-1/3" src="assets/images/logo/logo-zealit-text.svg" alt="logo" />
            </Typography>
          </>
        );

      default:
        return (
          <>
            {/* <Typography
              className="text-[50px] flex justify-center items-center uppercase font-['roman']"
              color="#201652"
            >
              Welcome
            </Typography>
            <Typography
              className="text-[16px] font-bold flex justify-center items-center font-['roman']"
              color="#201652"
            >
              TO OUR
            </Typography>
            <Typography className="flex justify-center items-center">
              <img className="w-1/3" src="assets/images/logo/ltr.svg" alt="logo" />
            </Typography> */}
          </>
        );
    }
  }

  const image = getContentToRender(module?.upa_project_name);
  return (
    <div className="h-full bg-gray-100 flex flex-col justify-center items-center">
      <Grid container>
        {/* {!module?.upa_project_name?.match(/LTR/i) && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography
              className="text-[50px] flex justify-center items-center uppercase font-['roman']"
              color="#00a3aa"
            >
              Welcome
            </Typography>
            <Typography
              className="text-[16px] font-bold flex justify-center items-center font-['roman']"
              color="#00a3aa"
            >
              TO OUR
            </Typography>
            <Typography className="flex justify-center items-center">
              <img className="w-1/3" src="assets/images/logo/logo1-text.svg" alt="logo" />
            </Typography>
          </Grid>
        )}
        {module?.upa_project_name?.match(/LTR/i) && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography
              className="text-[50px] flex justify-center items-center uppercase font-['roman']"
              color="#201652"
            >
              Welcome
            </Typography>
            <Typography
              className="text-[16px] font-bold flex justify-center items-center font-['roman']"
              color="#201652"
            >
              TO OUR
            </Typography>
            <Typography className="flex justify-center items-center">
              <img className="w-1/3" src="assets/images/logo/logo-text.svg" alt="logo" />
            </Typography>
          </Grid>
        )} */}

        <Grid item xs={12} sm={12} md={12} lg={12}>
          {image}
        </Grid>
      </Grid>

      {module?.upa_project_name?.match(/LTR/i) && (
        <div className="mt-auto absolute right-10 bottom-10 flex justify-between gap-6">
          <Button
            className="rounded-full text-xl font-['roman']"
            color="primary"
            variant="contained"
            startIcon={<LocationOn />}
            onClick={() => handleTracking()}
          >
            LR Tracking
          </Button>
          <Button
            className="rounded-full text-xl font-['roman']"
            color="primary"
            variant="contained"
            startIcon={<Business />}
            onClick={() => handleOffice()}
          >
            Find Office
          </Button>
        </div>
      )}
    </div>
  );
}

export default WelcomePage;
