import axios from 'axios';

class UserRoleService {
  getUserRoleManagement = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        UR_ID: data.UR_ID,
        UPA_PG_ID: data.UPA_PG_ID,
        UR_CREATED_BY: data.user_id,
        UR_CODE: data.roleCode || null,
        UR_DESC: data.roleDescription || null,
      };
      axios
        .post('api/Master/GetUserRoleManagement', newData)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });

  getSelectedUserRole = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        UR_ID: data.UR_ID,
      };
      axios
        .post('api/Master/GetSelectedUserRole', newData)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });

  putUserRoleManagement = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        UR_ID: data.id,
        UR_CODE: data.roleCode || null,
        UR_DESC: data.roleDescription || null,
        UR_NOTES: data.notes || null,
        UR_CP_ID: data.cp_id,
        UR_CREATED_BY: data.user_id,
        UR_PROGRAM_ID: data.programName?.PG_ID,
        UR_PG_ACCESS: data.programDetails || null,
        UR_PC_ACCESS: data.processDetails || null,
      };
      axios
        .post('api/Master/PutUserRoleManagement', newData)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });

  postUserRoleManagement = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        // UR_ID: data.UR_ID,
        UR_CODE: data.roleCode || null,
        UR_DESC: data.roleDescription || null,
        UR_NOTES: data.notes || null,
        UR_CP_ID: data.cp_id,
        UR_CREATED_BY: data.user_id,
        UR_PROGRAM_ID: data.programName?.PG_ID,
        UR_PG_ACCESS: data.programDetails || null,
        UR_PC_ACCESS: data.processDetails || null,
      };

      axios
        .post('api/Master/PostUserRoleManagement', newData)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });
}

const instance = new UserRoleService();

export default instance;
