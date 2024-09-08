import axios from 'axios';

class DashboardService {
  getDashboard = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        LOGIN_CP_ID: data.cp_id,
        LR_USER_ID: data.user_id,
        LR_FROM_DATE: data.from_date?.toDateString(),
        LR_TO_DATE: data.to_date?.toDateString(),
      };
      axios
        .post('api/LRDashboard/GetLRSummaryDashboard', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getSummary = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        LOGIN_CP_ID: data.cp_id,
        LR_USER_ID: data.user_id,
        // LR_USER_ID: data.user_id,
        LR_FROM_DATE: data.from_date?.toDateString(),
        LR_TO_DATE: data.to_date?.toDateString(),
      };
      axios
        .post('api/LRDashboard/GetAllLRSummary', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getSaleSummary = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        LOGIN_CP_ID: data.cp_id,
        LR_USER_ID: data.user_id,
        // LR_USER_ID: data.user_id,
        LR_FROM_DATE: data.from_date?.toDateString(),
        LR_TO_DATE: data.to_date?.toDateString(),
      };
      axios
        .post('api/LRDashboard/GetSalesTargetDashboard', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getGridSummary = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        LOGIN_CP_ID: data.cp_id,
        LR_USER_ID: data.user_id,
        // LR_USER_ID: data.user_id,
        LR_FROM_DATE: data.from_date?.toDateString(),
        LR_TO_DATE: data.to_date?.toDateString(),
      };
      axios
        .post('api/LRDashboard/GetLRGridSummary', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getAgencyDashboard = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        LOGIN_CP_ID: data.cp_id,
        LR_USER_ID: data.user_id,
        LR_FROM_DATE: data.from_date?.toDateString(),
        LR_TO_DATE: data.to_date?.toDateString(),
      };
      axios
        .post('api/LRDashboard/GetLRAgencySummaryDashboard', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getAgencyGridSummary = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        LOGIN_CP_ID: data.cp_id,
        LR_USER_ID: data.user_id,
        // LR_USER_ID: data.user_id,
        LR_FROM_DATE: data.from_date?.toDateString(),
        LR_TO_DATE: data.to_date?.toDateString(),
      };
      axios
        .post('api/LRDashboard/GetLRAgencyGridSummary', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getAgencySummary = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        LOGIN_CP_ID: data.cp_id,
        LR_USER_ID: data.user_id,
        // LR_USER_ID: data.user_id,
        LR_FROM_DATE: data.from_date?.toDateString(),
        LR_TO_DATE: data.to_date?.toDateString(),
      };
      axios
        .post('api/LRDashboard/GetLRAgencySummary', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getVehiclePerformance = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        LOGIN_CP_ID: data.cp_id,
        LR_USER_ID: data.user_id,
        // LR_USER_ID: data.user_id,
        LR_FROM_DATE: data.fromDate?.toDateString(),
        LR_TO_DATE: data.toDate?.toDateString(),
        LR_TRK_NUM: data.vehicleNumber?.TRK_NUMBER,
        LR_TRK_TYPE_ID: data.vehicleType?.gm_id,
      };
      axios
        .post('api/LRDashboard/GetVehicleSummaryDashboard', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getVehicleDashboard = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        LOGIN_CP_ID: data.cp_id,
        LR_USER_ID: data.user_id,
        LR_FROM_DATE: data.from_date?.toDateString(),
        LR_TO_DATE: data.to_date?.toDateString(),
        LR_TRK_NUM: data.trk_number,
      };
      axios
        .post('api/LRDashboard/GetVehiclePerformance', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getVehicleGrid = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        LOGIN_CP_ID: data.cp_id,
        LR_USER_ID: data.user_id,
        LR_FROM_DATE: data.from_date?.toDateString(),
        LR_TO_DATE: data.to_date?.toDateString(),
        LR_TRK_ID: data.trk_id,
      };
      axios
        .post('api/LRDashboard/GetVRGridSummary', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });
}

const instance = new DashboardService();

export default instance;
