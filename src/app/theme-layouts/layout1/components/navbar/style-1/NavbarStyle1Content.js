import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import useAppIconText from 'src/app/hooks/useAppIconText';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import Logo from 'app/theme-layouts/shared-components/Logo';
import NavbarToggleButton from '../../../../shared-components/NavbarToggleButton';
import Navigation from '../../../../shared-components/Navigation';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  '& ::-webkit-scrollbar-thumb': {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
    }`,
  },
  '& ::-webkit-scrollbar-thumb:active': {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
    }`,
  },
}));

const StyledContent = styled(FuseScrollbars)(({ theme }) => ({
  overscrollBehavior: 'contain',
  overflowX: 'hidden',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 40px, 100% 10px',
  backgroundAttachment: 'local, scroll',
}));

function NavbarStyle1Content(props) {
  const user = useSelector(selectUser);

  const icon = useAppIconText('icon');

  return (
    <Root className={clsx('flex flex-auto flex-col overflow-hidden h-full', props.className)}>
      <div className="flex flex-row items-center shrink-0 h-48 md:h-72 px-20 bg-[#334155]">
        <div className="flex flex-1 mx-4 gap-8">
          <Logo />

          {/* {user?.data.version && (
            <div className="space-x-8 mt-3">
              <Button variant="contained" disableElevation color="primary" size="small">
                {user?.data.version}
              </Button>
            </div>
          )} */}
        </div>

        <NavbarToggleButton className="w-40 h-40 p-0" />
      </div>

      <StyledContent
        className="flex flex-1 flex-col min-h-0 bg-[#334155]"
        // sx={{
        //   background: 'linear-gradient(145deg, #151c24, #0b485d)',
        // }}
        option={{ suppressScrollX: true, wheelPropagation: false }}
      >
        {/* <UserNavbarHeader /> */}

        <Navigation layout="vertical" />

        {/* <div className="flex flex-0 items-center justify-center py-48 opacity-10">
          <img className="w-full max-w-64" src={icon} alt="footer logo" />
        </div> */}
      </StyledContent>
    </Root>
  );
}

export default memo(NavbarStyle1Content);
