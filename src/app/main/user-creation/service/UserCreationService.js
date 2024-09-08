import axios from 'axios';

class UserCreationService {
  getUserRoleList = (data) =>
    new Promise((resolve, reject) => {
      axios
        .post('api/UserCompany/GetUserRoleList', data)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => reject(response.data));
    });

  getUserCreation = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        USER_CREATED_BY: data.user_id,
        USER_CP_ID: data.cp_id,
        USER_CODE: data.userCode,
        USER_NAME: data.userName,
        USER_STATUS: data.status?.ref_code,
      };
      axios
        .post('api/Master/GetUserCreation', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => reject(response.data));
    });

  getUserCreationDetails = (data) =>
    new Promise((resolve, reject) => {
      axios
        .post('api/Master/GetUserCreationDetails', data)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => reject(response.data));
    });

  postUserCreation = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        USER_CREATED_BY: data.user_id,
        USER_CP_ID: data.cp_id,
        USER_CODE: data?.userCode || null,
        USER_NAME: data?.userName || null,
        USER_STATUS: data?.status?.ref_code || null,
        USER_EMAIL: data?.emailId || null,
        USER_EMAIL_PASS: data?.password || null,
        USER_ADDRESS: data?.address || null,
        USER_CC_ACCESS: data.roles,
        USER_PRJ_ACCESS: data.projectAccess,
        USER_DEFAULT_PRJ: data.defaultProject?.UPA_PROJ_ID,
        USER_UR_ACCESS: data.roles?.reduce((a, b) => [...a, ...b.UCP_ROLES], []),
      };

      axios
        .post('api/Master/PostUserCreation', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  putUserCreation = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        USER_ID: data.USER_ID,
        USER_CREATED_BY: data.user_id,
        USER_CP_ID: data.cp_id,
        USER_CODE: data?.userCode || null,
        USER_NAME: data?.userName || null,
        USER_STATUS: data?.status?.ref_code || null,
        USER_EMAIL: data?.emailId || null,
        USER_EMAIL_PASS: data?.password || null,
        USER_ADDRESS: data?.address || null,
        USER_CC_ACCESS: data.roles,
        USER_PRJ_ACCESS: data.projectAccess,
        USER_DEFAULT_PRJ: data.defaultProject?.UPA_PROJ_ID,
        USER_UR_ACCESS: data.roles.reduce((a, b) => [...a, ...b.UCP_ROLES], []),
      };

      axios
        .post('api/Master/PutUserCreation', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });
}

const userCreationService = new UserCreationService();

export default userCreationService;
