import axios from 'axios';
import JwtService from 'src/app/auth/services/jwtService';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';

class ReportService {
  getReportMenu = (data) =>
    new Promise((resolve, reject) => {
      // console.log(data);
      axios
        .post('api/Report/GetReportMenu', data)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getReportFieldDetails = (data) =>
    new Promise((resolve, reject) => {
      // console.log(data);
      axios
        .post('api/Report/GetReportFieldDetails', data)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getReportComboboxdetails = (data) =>
    new Promise((resolve, reject) => {
      // console.log(data);
      axios
        .post('api/Report/GetReportComboboxdetails', data)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  getGridReport = (data) =>
    new Promise((resolve, reject) => {
      // console.log(data);
      axios
        .post('api/Report/GetReportOutput', data)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  printReport = (data) =>
    new Promise((resolve, reject) => {
      JwtService.basicInstance()
        .post(jwtServiceConfig.printReport, data)
        .then((res) => resolve(res.data))
        .catch(({ response }) => reject(response.data));
    });

  getBufferFromURL = (data) =>
    new Promise((resolve, reject) => {
      JwtService.basicInstance()
        .post(jwtServiceConfig.getBufferFromURL, data)
        .then((res) => resolve(res.data))
        .catch(({ response }) => reject(response.data));
    });

  getExcelReport = (data) =>
    new Promise((resolve, reject) => {
      // console.log(data);
      axios
        .post('api/Report/GetExcelReport', data)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });

  uploadFile = (data) =>
    new Promise((resolve, reject) => {
      // console.log(data);
      axios
        .post(jwtServiceConfig.uploadFile, data)
        .then((res) => resolve(res.data))
        .catch(({ response }) => reject(response.data));
    });

  getPivotDetails = (data) =>
    new Promise((resolve, reject) => {
      const newData = { RPV_RPH_CODE: data.rpt_report_code };
      axios
        .post('api/Report/GetReportPivotDetails', newData)
        .then((res) => resolve(res.data))
        .catch(({ response }) => reject(response.data));
    });

  getPivotOutputDetails = (data) =>
    new Promise((resolve, reject) => {
      axios
        .post('api/Report/GetReportOutput', data)
        .then((res) => resolve(res.data))
        .catch(({ response }) => reject(response.data));
    });

  getPivotSummaryDetails = (data) =>
    new Promise((resolve, reject) => {
      const newData = { RPV_RPH_CODE: data.rpt_report_code };
      axios
        .post('api/Report/GetReportPivotSummary', newData)
        .then((res) => resolve(res.data))
        .catch(({ response }) => reject(response.data));
    });

  getReportGridSummary = (data) =>
    new Promise((resolve, reject) => {
      axios
        .post('api/Report/GetReportGridSummary', data)
        .then((res) => resolve(res.data))
        .catch(({ response }) => reject(response.data));
    });
}

const instance = new ReportService();

export default instance;
