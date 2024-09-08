import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import { Buffer } from 'buffer';
import jwtDecode from 'jwt-decode';
import jwtEncode from 'jwt-encode';
import jwtServiceConfig from './jwtServiceConfig';

/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token');
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit('onNoAccessToken');

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'access_token expired');
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(jwtServiceConfig.signUp, data).then((response) => {
        if (response.data.user) {
          this.setSession(response.data.access_token);
          resolve(response.data.user);
          this.emit('onLogin', response.data.user);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      console.log('sss', email, password);
      axios
        .post(jwtServiceConfig.signIn, {
          email,
          password,
        })
        .then((response) => {
          console.log('res', response);
          if (response.data.user) {
            this.setSession(response.data.token);
            resolve(response.data.user);
            this.emit('onLogin', response.data.user);
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  signInWithToken = () => {
    // console.log('signInWithToken');
    return new Promise((resolve, reject) => {
      const decoded = jwtDecode(this.getAccessToken());
      // console.log(decoded);
      axios
        .post(jwtServiceConfig.signIn, {
          user_code: decoded.username,
          user_pass: decoded.password,
        })
        .then((response) => {
          if (response.data) {
            // this.setSession(response.data.access_token);
            response.data[0].user_code = decoded.username;
            resolve(response.data);
          } else {
            this.logout();
            reject(new Error('Failed to login with token.'));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error('Failed to login with token.'));
        });
    });
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  // getUserAgencies = (user) => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .post(jwtServiceConfig.listUserCompany, { user_code: user[0].user_code })
  //       .then((response) => {
  //         resolve(response.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         const emptyArr = [];
  //         reject(emptyArr);
  //       });
  //   });
  // };

  //  getNavigation = (data) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .post('api/Menu/GetMenuList', data)
  //         .then((response) => resolve(response.data))
  //         .catch((err) => reject(err));
  //     });
  //   };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem('jwt_access_token', access_token);

      const decoded = jwtDecode(access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${decoded.access_token}`;
    } else {
      localStorage.removeItem('jwt_access_token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit('onLogout', 'Logged out');
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }

    const decoded = jwtDecode(access_token);
    const currentTime = new Date().getTime();
    if (decoded.expiresIn < currentTime) {
      console.warn('access token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem('jwt_access_token');
  };

  getBasicToken = () => {
    const accessToken = localStorage.getItem('jwt_access_token');
    const decode = jwtDecode(accessToken);
    const token = `${decode.username}:${decode.password}:1`;

    return Buffer.from(token).toString('base64');
  };

  basicInstance = () => {
    const token = this.getBasicToken();
    return axios.create({
      baseURL: process.env.REACT_APP_API_KEY,
      headers: {
        Authorization: `bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  };

  changePasswordandNewpassword = (data) => {
    console.log(data);

    return new Promise((resolve, reject) => {
      axios
        .post(
          jwtServiceConfig.token,
          `userName=${data.userName}&password=${data.oldPassword}&grant_type=password`
        )
        .then((response) => {
          if (response.data.access_token) {
            const date = new Date();
            const jwt_password = {
              access_token: response.data.access_token,
              userName: data.userName,
              oldPassword: data.oldPassword,
              newPassword: data.newPassword,
              confirmPassword: data.confirmPassword,
              expiresIn: date.setSeconds(response.data.expires_in),
            };
            axios.defaults.headers.common.Authorization = `Bearer ${jwt_password.access_token}`;
            this.setSession(jwtEncode(jwt_password, ''));
            const postData = {
              PS_UR_NAME: data.userName,
              PS_OLD_PASS: data.oldPassword,
              PS_NEW_PASS_C: data.confirmPassword,
              PS_NEW_PASS: data.newPassword,
            };
            console.log('JWT Service', postData);
            axios
              .post(jwtServiceConfig.passwordChange, postData)
              .then((user) => {
                console.log('Response', user);

                // user.data[0].PS_UR_NAME = data.userName;
                resolve(user.data);
                this.emit('onSubmit', user);
                console.log(user.data);
              })
              .catch(({ response: errRes }) => {
                const message = 'This user does not exist';
                this.setSession(null);
                reject(message);
              });
          } else {
            reject(response.data.error);
          }
        })
        .catch(({ response }) => {
          console.log(response.data.error_description);
          reject(response.data.error_description);
        });
    });
  };
}

const instance = new JwtService();

export default instance;
