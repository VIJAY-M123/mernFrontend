import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import { hideLoader } from 'app/store/fuse/loaderSlice';
import Loader from 'app/shared-components/Loader';
import utils from 'src/@utils';
import jwtService from './services/jwtService';

const AuthContext = React.createContext();

const { filterMenus } = utils;

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    jwtService.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Signing in with JWT' }));

      /**
       * Sign in and retrieve user data with stored token
       */
      jwtService
        .signInWithToken()
        .then((user) => {
          // console.log(user);
          success(user, 'Signed in with JWT');
        })
        .catch((error) => {
          pass(error.message);
        });
    });

    jwtService.on('onLogin', (user) => {
      console.log('onLogin', user);
      success(user, 'Signed in');
    });

    jwtService.on('onLogout', () => {
      pass('Signed out');

      dispatch(logoutUser());
    });

    jwtService.on('onAutoLogout', (message) => {
      pass(message);

      dispatch(logoutUser());
    });

    jwtService.on('onNoAccessToken', () => {
      pass();
    });

    jwtService.init();

    function success(user, message) {
      if (message) {
        dispatch(showMessage({ message }));
        dispatch(hideLoader());
      }

      Promise.all([
        dispatch(setUser([user])),
        // jwtService.getUserAgencies(user),
        // You can receive data in here before app initialization
      ]).then((values) => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
        // const agencies = values[1];
        // const userAgency =
        //   agencies.filter((agency) => agency.cp_id === user[0].emp_cp_id).pop() || agencies.at(0);

        // dispatch(setAgency(userAgency));
        // dispatch(setAgencyList(agencies));
        // const { data } = values[0].payload;
        // dispatch(
        //   setModule({
        //     upa_project_name: data.default_project_name,
        //     upa_project_id: data.default_project_id,
        //   })
        // );

        // jwtService
        //   .getNavigation({
        //     cp_id: userAgency?.cp_id,
        //     user_id: user[0].user_id,
        //     KEY_VAL: module?.upa_project_name || data?.default_project_name,
        //   })
        //   .then((res) => {
        //     // console.log(res);
        //     dispatch(setNavigation(filterMenus(res)));
        //   });
      });
    }

    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return (
    <Loader spinner>
      {waitAuthCheck ? (
        <FuseSplashScreen />
      ) : (
        <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
      )}
    </Loader>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
