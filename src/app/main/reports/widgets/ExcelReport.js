import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { Workbook } from 'exceljs';
import utils from 'src/@utils';
import DocumentViewer from 'app/shared-components/DocumentViewer';
import reportsService from '../service';
import ReportForm from './ReportForm';

const { bufferToBase64, getDate, downloadExcel } = utils;

const ExcelReport = () => {
  const dispatch = useDispatch();

  const { id } = useParams();

  const onSubmit = (obj) => {
    const { fields, data: dt, code, user, name } = obj;
    const blobData = {
      url: `${user.data.blob_url}${name}.xlsx`,
      type: 'buffer',
    };
    const data = Object.keys(dt)
      .map((d) => {
        const v = dt[d];
        const i = +d.match(/\d+/);
        const { VARIABLE, DATA_TYPE } = fields.filter((f) => f.SERIAL === i).at(0);
        const value = { [`var${i}`]: VARIABLE, [`dt_type${i}`]: DATA_TYPE };

        if (DATA_TYPE === 'D') {
          value[`date_${i}`] = v?.toDateString();
        }

        if (DATA_TYPE === 'I') {
          value[`int${i}`] = v instanceof Object ? v.ID : v;
        }

        if (DATA_TYPE === 'B') {
          value[`Bigint${i}`] = v instanceof Object ? v.ID : v;
        }

        if (DATA_TYPE === 'V') {
          value[`Str${i}`] = v instanceof Object ? v.ID : v;
        }

        return value;
      })
      .reduce((a, b) => ({ ...a, ...b }), {});

    data.rpt_report_code = code;

    dispatch(showLoader());
    reportsService
      .getGridReport(data)
      .then((res) => {
        if (!res.length) {
          dispatch(hideLoader());
          dispatch(showMessage({ message: 'No data to display', variant: 'info' }));
          return;
        }

        handleExcel(blobData, res, name, user);
      })
      .catch((err) => {
        console.log(err);
        dispatch(hideLoader());
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
      });
  };

  const handleExcel = (input, arr, name, user) => {
    reportsService
      .getBufferFromURL(input)
      .then(async (buffer) => {
        const workbook = new Workbook();
        await workbook.xlsx.load(new Uint8Array(buffer));

        const worksheet = workbook.getWorksheet('Sheet3');
        const rows = worksheet._rows;
        const headers = rows[0]._cells.map(({ value, address }) => ({
          value,
          address,
          alpha: address.replace(/\d+/, ''),
        }));

        let rowIndex = 1;
        const data = arr.reduce((obj, item) => {
          rowIndex += 1;

          const newObj = Object.keys(item).reduce((j, k) => {
            const cell = headers.filter((h) => h.value === k).at(0)?.alpha;
            if (cell) {
              const d = item[k];
              const row = {
                columnName: cell,
                data: d,
              };

              return [...j, row];
            }

            return j;
          }, []);

          return [...obj, { rowIndex, rows: newObj }];
        }, []);

        // console.log(data);

        if (!data.length) {
          dispatch(hideLoader());
          dispatch(showMessage({ message: 'No data to display', variant: 'info' }));
          return;
        }

        const getData = { url: input.url, sheet: 'Sheet3', data };
        // const fileName = `${name} ${getDate()}.xlsx`;

        reportsService
          .getExcelReport(getData)
          .then((res) => {
            // getData = {
            //   account_name: user.data.blob_acc_name,
            //   account_key: user.data.blob_acc_key,
            //   account_container: user.data.blob_acc_cntr,
            //   // VIA_BASE64: bufferToBase64(res),
            //   // VIA_FILE_NAME: fileName,
            // };

            dispatch(hideLoader());
            downloadExcel(new Uint8Array(res), name);

            // for uploading in blob

            // reportsService
            //   .uploadFile(getData)
            //   .then(() => {
            //     dispatch(hideLoader());
            //     dispatch(setDocumentURL(`${user.data.blob_url}${fileName}`));
            //   })
            //   .catch((err) => {
            //     console.log(err);
            //     dispatch(hideLoader());
            //     dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
            //   });
          })
          .catch((err) => {
            console.log(err);
            dispatch(hideLoader());
            dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
          });
      })
      .catch((err) => {
        console.log(err);
        dispatch(hideLoader());
        dispatch(showMessage({ message: "Can't read or open file", variant: 'error' }));
      });
  };

  return (
    <Box className="p-24">
      <ReportForm id={id} handleReport={onSubmit} />
      <DocumentViewer />
    </Box>
  );
};

export default ExcelReport;
