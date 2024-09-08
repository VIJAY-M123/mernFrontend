import axios from 'axios';

class CustomerLoginService {
  getCustomerLogin = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        CL_USER_CODE: data.userCode || null,
        CL_USER_NAME: data.userName || null,
        CL_USER_PASS: data.userPass || null,
        CL_AR_ID: data.customer?.ar_id,
        CL_STATUS: data.status?.ref_code,
      };

      axios
        .post('api/Customer/CustomerGetDetails', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getSelectedCustomerLoginDetails = (data) =>
    new Promise((resolve, reject) => {
      axios
        .post('api/Customer/GetCustLoginMasterList', data)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  postCustomerLogin = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        CL_USER_CODE: data.userCode || null,
        CL_USER_NAME: data.userName || null,
        CL_USER_PASS: data.userPass || null,
        CL_CP_ID: data.agency?.CP_ID,
        CL_AR_ID: data.customer?.ar_id,
        CL_BP_ID: data.bookingParty?.ar_id,
        CL_STATUS: data.status?.ref_code,
        CL_AP_ID: data.vendor?.AP_ID,
        CL_USER_ROLE: data.role?.gm_id,
        CL_DRV_ID: data.driverDetails?.DRV_ID,
        CL_DP_ID: data.depot?.DP_ID,
        CL_ONLINE_BKG: data.onlineBooking?.ref_code,
        CL_NOTES: data.notes || null,
        CUS_XML: data.shipperDetails,
        CL_CREATED_BY: data.user_id,
      };

      axios
        .post('api/Customer/PostCustLoginMaster', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  putCustomerLogin = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        CL_ID: data.CL_ID,
        CL_USER_CODE: data.userCode || null,
        CL_USER_NAME: data.userName || null,
        CL_USER_PASS: data.userPass || null,
        CL_CP_ID: data.agency?.CP_ID,
        CL_AR_ID: data.customer?.ar_id,
        CL_BP_ID: data.bookingParty?.ar_id,
        CL_STATUS: data.status?.ref_code,
        CL_AP_ID: data.vendor?.AP_ID,
        CL_USER_ROLE: data.role?.gm_id,
        CL_DRV_ID: data.driverDetails?.DRV_ID,
        CL_DP_ID: data.depot?.DP_ID,
        CL_ONLINE_BKG: data.onlineBooking?.ref_code,
        CL_NOTES: data.notes || null,
        CUS_XML: data.shipperDetails,
        CL_CREATED_BY: data.user_id,
      };

      axios
        .post('api/Customer/PutCustLoginMaster', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });
}

const instance = new CustomerLoginService();

export default instance;
