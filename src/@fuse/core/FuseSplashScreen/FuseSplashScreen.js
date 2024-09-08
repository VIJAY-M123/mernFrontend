import { memo } from 'react';
import Box from '@mui/material/Box';
import useAppIconText from 'src/app/hooks/useAppIconText';

function FuseSplashScreen() {
  const icon = useAppIconText('icon');
  return (
    <div id="fuse-splash-screen">
      <div className="logo">
        <img width="128" src={icon} alt="logo" />
      </div>
      <Box
        id="spinner"
        sx={{
          '& > div': {
            backgroundColor: 'palette.secondary.main',
          },
        }}
      >
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </Box>
    </div>
  );
}

export default memo(FuseSplashScreen);
