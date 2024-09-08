import axios from 'axios';

class FindOfficeService {
  getAgencyContactDetails = (data) =>
    new Promise((resolve, reject) => {
      const newData = {
        CITY_ID: data.city?.ct_id,
        PINCODE: data.pinCode || null,
      };
      axios
        .post('api/LoadReceipt/GetAgencyContactDetails', newData)
        .then((response) => {
          resolve(response.data);
        })
        .catch(({ response }) => {
          reject(response.data);
        });
    });
}

const instance = new FindOfficeService();

export default instance;
