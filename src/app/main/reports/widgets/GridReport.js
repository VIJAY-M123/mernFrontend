import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import { useState } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import utils from 'src/@utils';
import DataTable from 'app/shared-components/DataTable';
import { format } from 'date-fns';
import ReportForm from './ReportForm';
import reportsService from '../service';

const { createDataGridHeader, getDate, fixArrayDates } = utils;

const GridReport = () => {
  const dispatch = useDispatch();

  const { id } = useParams();

  const [rows, setRows] = useState([]);
  const [initialRows, setInitialRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const onSubmit = (obj) => {
    const { fields, data: dt, code } = obj;
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
        dispatch(hideLoader());
        setRows(res.map((e, i) => ({ id: i, ...e })));
        setInitialRows(res);

        if (!res.length) {
          setRows([]);
          dispatch(showMessage({ message: 'No data to display', variant: 'info' }));
          return;
        }

        const setNewRows = () => {
          setRows(
            fixArrayDates(
              res.map((e, i) => ({ id: i, ...e })),
              'dd-MMM-yyyy'
            )
          );
        };

        reportsService
          .getReportGridSummary({ rss_rsh_code: code })
          .then((sum) => {
            sum.forEach((s) => {
              if (s.RSS_TYPE === 'T' && s.RSS_S_TYPE === 'DATE TIME') {
                res.forEach((r) => {
                  const val = r[s.RSS_COLUMN];
                  if (val) {
                    r[s.RSS_COLUMN] = format(new Date(val), 'dd-MM-yyyy HH:mm');
                  }
                });
              }
            });
            setNewRows();
          })
          .catch((err) => {
            console.log(err);
            setNewRows();
          });

        setColumns(
          Object.keys(res.at(0)).map((c) =>
            createDataGridHeader(c, c, 0, 1, Math.max(c.length * 14, 50))
          )
        );
      })
      .catch((err) => {
        console.log(err);
        setRows([]);
        dispatch(hideLoader());
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
      });
  };

  return (
    <Box className="p-24">
      <ReportForm id={id} handleReport={onSubmit} />
      {rows.length > 0 && (
        <DataTable
          className="rounded mt-24"
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          disableSelectionOnClick
          rows={rows}
          tableProps={{ initialRows }}
          exportCsv
          fileName={`GridReport${getDate()}`}
        />
      )}
    </Box>
  );
};

export default GridReport;
