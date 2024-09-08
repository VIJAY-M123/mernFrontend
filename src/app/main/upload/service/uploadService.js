import axios from 'axios';

class UploadService {
  getUploadConfig = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        UCM_CP_ID: data.cp_id,
        UCM_CREATED_BY: data.user_id,
      };
      axios
        .post('api/UploadConfig/GetUploadConfig', newData)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });

  postUploadConfig = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        UCM_CP_ID: data.agency?.CP_ID,
        UCM_NAME: data.uploadName,
        UCM_DESCRIPTION: data.description,
        UCM_STATUS: data.status?.ref_code,
        UCM_API_NAME: data.apiName,
        UCM_TYPE: data.uploadType?.ref_code,
        UCM_UPLOAD_MODE: data.mode,
        UCM_JSON: data.json,
        UCM_CREATED_BY: data.user_id,
      };
      axios
        .post('api/UploadConfig/PostUploadConfig', newData)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });

  putUploadConfig = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        UCM_ID: data.UCM_ID,
        UCM_CP_ID: data.agency?.CP_ID,
        UCM_NAME: data.uploadName,
        UCM_DESCRIPTION: data.description,
        UCM_STATUS: data.status?.ref_code,
        UCM_API_NAME: data.apiName,
        UCM_TYPE: data.uploadType?.ref_code,
        UCM_UPLOAD_MODE: data.mode,
        UCM_JSON: data.json,
        UCM_CREATED_BY: data.user_id,
      };
      axios
        .post('api/UploadConfig/PutUploadConfig', newData)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });

  uploadData = (data) =>
    new Promise((resolve, reject) => {
      axios
        .post('aoi/UploadConfig/UploadData', data)
        .then((response) => resolve(response.data))
        .catch(({ response }) => reject(response.data));
    });
}

const instance = new UploadService();

export default instance;
