import axios from 'axios';

class AgencyMoveService {
  getAgencyMove = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        CM_CODE: data.moveCode || null,
        CM_DESC: data.moveDescription || null,
        CM_TYPE: data.type?.ref_code,
        CM_SEARCH: data.status || null,
      };
      axios
        .post('api/Master/GetAgencyMove', newData)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });

  putAgencyMove = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        CM_ID: data.CM_ID,
        CM_CODE: data.moveCode || null,
        CM_DESC: data.moveDescription || null,
        CM_TYPE: data.type?.ref_code || null,
        CM_STATUS: data.status?.ref_code || null,
        CM_VESSEL: data.vessel?.ref_code,
        CM_VOYAGE: data.voyage?.ref_code,
        CM_CUR_PORT: data.currentPort?.ref_code,
        CM_NXT_PORT: data.nextPort?.ref_code,
        CM_CUR_TER: data.currentTerminal?.ref_code,
        CM_NXT_TER: data.nextTerminal?.ref_code,
        CM_CUR_DPT: data.currentDepot?.ref_code,
        CM_NXT_DPT: data.nextDepot?.ref_code,
        CM_CUR_LOC: data.currentLocation?.ref_code,
        CM_NXT_LOC: data.nextLocation?.ref_code,
        CM_TRANS_MODE: data.transportMode?.ref_code,
        CM_TRUCK_NUM: data.truckNumber?.ref_code,
        CM_BKG_NUM: data.bookingNumber?.ref_code,
        CM_BL_NUM: data.blNumber?.ref_code,
        CM_RREQ_NUM: data.rrNumber?.ref_code,
        CM_REF_NUM: data.referenceNumber?.ref_code,
        CM_AR: data.customer?.ref_code,
        CM_AP: data.vendor?.ref_code,
        CM_CUS_PO_NUM: data.customerPoNumber?.ref_code,
        CM_DO_NUM: data.doNumber?.ref_code,
        CM_LR_NUM: data.lrNumber?.ref_code,
        CM_BE_NUM: data.beNumber?.ref_code,
        CM_INV_NUM: data.invoiceNumber?.ref_code,
        CM_JOB_NUM: data.jobNumber?.ref_code,
        CM_PLA_NAME: data.plant?.ref_code,
        CM_AP_NAME: data.wareHouse?.ref_code,
        DP_CM_PREV_MOVES: data.tableData || [],
      };
      axios
        .post('api/Master/PutAgencyMove', newData)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });

  getListAgencyMove = (data) =>
    new Promise((resolve, reject) => {
      axios
        .post('api/Master/GetListAgencyMove', data)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });

  postAgencyMove = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        CM_CODE: data.moveCode || null,
        CM_DESC: data.moveDescription || null,
        CM_TYPE: data.type?.ref_code,
        CM_STATUS: data.status?.ref_code,
        CM_VESSEL: data.vessel?.ref_code,
        CM_VOYAGE: data.voyage?.ref_code,
        CM_CUR_PORT: data.currentPort?.ref_code,
        CM_NXT_PORT: data.nextPort?.ref_code,
        CM_CUR_TER: data.currentTerminal?.ref_code,
        CM_NXT_TER: data.nextTerminal?.ref_code,
        CM_CUR_DPT: data.currentDepot?.ref_code,
        CM_NXT_DPT: data.nextDepot?.ref_code,
        CM_CUR_LOC: data.currentLocation?.ref_code,
        CM_NXT_LOC: data.nextLocation?.ref_code,
        CM_TRANS_MODE: data.transportMode?.ref_code,
        CM_TRUCK_NUM: data.truckNumber?.ref_code,
        CM_BKG_NUM: data.bookingNumber?.ref_code,
        CM_BL_NUM: data.blNumber?.ref_code,
        CM_RREQ_NUM: data.rrNumber?.ref_code,
        CM_REF_NUM: data.referenceNumber?.ref_code,
        CM_AR: data.customer?.ref_code,
        CM_AP: data.vendor?.ref_code,
        CM_CUS_PO_NUM: data.customerPoNumber?.ref_code,
        CM_DO_NUM: data.doNumber?.ref_code,
        CM_LR_NUM: data.lrNumber?.ref_code,
        CM_BE_NUM: data.beNumber?.ref_code,
        CM_INV_NUM: data.invoiceNumber?.ref_code,
        CM_JOB_NUM: data.jobNumber?.ref_code,
        CM_PLA_NAME: data.plant?.ref_code,
        CM_AP_NAME: data.wareHouse?.ref_code,
        DP_CM_PREV_MOVES: data.tableData || [],
      };

      axios
        .post('api/Master/PostAgencyMove', newData)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });
}

const instance = new AgencyMoveService();

export default instance;
