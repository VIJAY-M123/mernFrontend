import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import PDFViewer from 'app/shared-components/PDFViewer';
import { openViewer, setViewer } from 'app/store/viewerSlice';
import ReportForm from './ReportForm';
import reportsService from '../service';

const CrystalReport = () => {
  const dispatch = useDispatch();

  const { id } = useParams();

  const onSubmit = (obj) => {
    const { fields, data: dt, agency, code } = obj;
    const data = Object.keys(dt)
      .map((d) => {
        const v = dt[d];
        const i = +d.match(/\d+/);
        const { VARIABLE, DATA_TYPE } = fields.filter((f) => f.SERIAL === i).at(0);
        const value = { [`parameter_${i}`]: VARIABLE, [`type_${i}`]: DATA_TYPE };

        if (DATA_TYPE === 'D') {
          value[`date_${i}`] = v?.toDateString();
        }

        if (DATA_TYPE === 'I') {
          value[`integer_${i}`] = v instanceof Object ? v.ID : v;
        }

        if (DATA_TYPE === 'S') {
          value[`string_${i}`] = v instanceof Object ? v.ID : v;
        }

        return value;
      })
      .reduce((a, b) => ({ ...a, ...b }), {});

    data.report_code = code;
    data.company_code = agency.cp_code;

    dispatch(showLoader());
    reportsService
      .printReport(data)
      .then((res) => {
        dispatch(hideLoader());
        dispatch(openViewer(true));
        dispatch(setViewer({ name: res.file_name, base64: res.file_base64 }));
      })
      .catch((err) => {
        console.log(err);
        dispatch(hideLoader());
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
      });
  };

  return (
    <Box className="p-24">
      <ReportForm id={id} handleReport={onSubmit} />
      <PDFViewer />
    </Box>
  );
};

export default CrystalReport;
