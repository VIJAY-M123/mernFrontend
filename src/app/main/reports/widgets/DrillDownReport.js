import { Card, CardContent, Grid } from '@mui/material';
import { PivotGrid } from 'devextreme-react';
import DataGrid, { Column, Export } from 'devextreme-react/data-grid';
import { FieldChooser, Scrolling } from 'devextreme-react/pivot-grid';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Popup } from 'devextreme-react/popup';
import { Workbook } from 'exceljs';
import { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAgency } from 'app/store/agencySlice';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { Box } from '@mui/system';
import utils from 'src/@utils';
import { selectUser } from 'app/store/userSlice';
import axios from 'axios';
import reportsService from '../service';
import ReportForm from './ReportForm';
import ExcelPreview from './ExcelPreview';

function DrillDownReport() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const agency = useSelector(selectAgency);

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [summary, setSummary] = useState([]);
  const [exportRowFieldHeaders, setExportRowFieldHeaders] = useState(true);
  const [exportColumnFieldHeaders, setExportColumnFieldHeaders] = useState(true);
  const [popupTitle, setPopupTitle] = useState('');
  const [drillDownDataSource, setDrillDownDataSource] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const { bufferToBase64, getDate, downloadExcel } = utils;

  const dataGridRef = useRef(null);
  const [src, setSrc] = useState('');
  const [open, setOpen] = useState(false);
  const [downloadBuffer, setDownloadBuffer] = useState(false);
  const [rptName, setRptName] = useState();

  const onSubmit = (obj) => {
    setRows([]);
    setColumns([]);
    const { fields, data: dt, code, name } = obj;
    setRptName(name);
    const data = Object.keys(dt)
      .map((d) => {
        const v = dt[d];
        const i = +d.match(/\d+/);
        const { VARIABLE, DATA_TYPE } = fields.filter((f) => f.SERIAL === i).at(0);
        const value = { [`var${i}`]: VARIABLE, [`dt_type${i}`]: DATA_TYPE };

        if (DATA_TYPE === 'D') {
          value[`date_${i}`] = new Date(v);
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
    data.company_code = agency.cp_code;
    data.CP_ID = agency.cp_id;

    dispatch(showLoader());

    reportsService
      .getPivotDetails({ rpt_report_code: id })
      .then((res) => {
        dispatch(hideLoader());
        setRows(res);

        if (res.length === 0) {
          dispatch(showMessage({ message: 'No data to display', variant: 'info' }));
          // return;
        }
      })
      .catch((err) => {
        console.log(err);
        setRows([]);
        dispatch(hideLoader());
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
      });

    reportsService
      .getPivotSummaryDetails({ rpt_report_code: id })
      .then((res) => {
        dispatch(hideLoader());
        setSummary(res.at(0));
      })
      .catch((err) => {
        console.log(err);
        dispatch(hideLoader());
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
      });

    reportsService
      .getPivotOutputDetails(data)
      .then((res) => {
        dispatch(hideLoader());
        setColumns(res);
      })
      .catch((err) => {
        console.log(err);
        dispatch(hideLoader());
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }));
      });
  };

  const dataSourceFields = rows
    .map((d) => {
      if (d.RPV_AREA === 'R') {
        return {
          caption: d.RPV_CAPTION,
          dataField: d.RPV_FIELD,
          area: 'row',
        };
      }
      if (d.RPV_AREA === 'C') {
        return {
          caption: d.RPV_CAPTION,
          dataField: d.RPV_FIELD,
          dataType: 'string',
          area: 'column',
        };
      }
      if (d.RPV_AREA === 'D') {
        return {
          caption: d.RPV_CAPTION,
          dataField: d.RPV_FIELD,
          dataType: 'number',
          area: 'data',
          summaryType: 'sum',
          format: '#.##',
          // width: '100%',
        };
      }
      return null; // Handle other cases or invalid RPV_AREA values as needed
    })
    .filter((field) => field !== null); // Filter out null values

  const dataSourceTable = new PivotGridDataSource({
    fields: dataSourceFields,
    store: columns,
  });

  const getDataGridInstance = (ref) => {
    if (ref && ref.instance) {
      dataGridRef.current = ref.instance;
    }
  };

  const onCellClick = (e) => {
    if (e.area === 'data') {
      const pivotGridDataSource = e.component.getDataSource();
      const rowPathLength = e.cell.rowPath.length;
      const rowPathName = e.cell.rowPath[rowPathLength - 1];
      setPopupTitle(`${rowPathName || 'Total'} Drill Down Data`);
      setDrillDownDataSource(pivotGridDataSource.createDrillDownDataSource(e.cell));
      setPopupVisible(true);
    }
  };

  const onHiding = () => {
    setPopupVisible(false);
  };

  const onShown = () => {
    dataGridRef.current.updateDimensions();
  };
  const onExporting = useCallback(
    (e) => {
      dispatch(showLoader());
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Reports');

      exportPivotGrid({
        component: e.component,
        worksheet,
        exportRowFieldHeaders,
        exportColumnFieldHeaders,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          const base64 = bufferToBase64(buffer);
          setDownloadBuffer(buffer);
          // downloadExcel(buffer, `Preview`);

          const fileName = `Preview${getDate()}.xlsx`;
          const data = {
            account_name: user.data.blob_acc_name,
            account_key: user.data.blob_acc_key,
            account_container: user.data.blob_acc_cntr,
            VIA_BASE64: base64,
            VIA_FILE_NAME: fileName,
          };

          axios
            .post('api/TransportOrder/PostVendInvAttachments', data)
            .then((res) => {
              const url = `${user.data.blob_url}${fileName}`;
              setSrc(url);
              setOpen(true);
              dispatch(hideLoader());
            })
            .catch((err) => {
              console.log('err', err);
            });
        });
      });
    },
    [
      bufferToBase64,
      dispatch,
      exportColumnFieldHeaders,
      exportRowFieldHeaders,
      getDate,
      user.data.blob_acc_cntr,
      user.data.blob_acc_key,
      user.data.blob_acc_name,
      user.data.blob_url,
    ]
  );

  // const onExporting = useCallback((e) => {
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet('Reports');

  //   worksheet.columns = [
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //   ];

  //   exportPivotGrid({
  //     component: e.component,
  //     worksheet,
  //     topLeftCell: { row: 4, column: 1 },
  //     keepColumnWidths: false,
  //   })
  //     .then((cellRange) => {})
  //     .then(() => {
  //       workbook.xlsx.writeBuffer().then((buffer) => {
  //         saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Reports.xlsx');
  //       });
  //     });
  // }, []);
  return (
    <Box className="p-24">
      <ReportForm id={id} handleReport={onSubmit} />

      {rows.length > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} className="mt-12">
            <Card>
              <CardContent>
                <PivotGrid
                  className="overflow-x-scroll"
                  id="sales"
                  allowSortingBySummary
                  allowSorting
                  allowFiltering
                  allowExpandAll
                  showBorders
                  dataSource={dataSourceTable}
                  showRowTotals={false}
                  showColumnTotals
                  onCellClick={onCellClick}
                  height={500}
                  wordWrapEnabled
                  rowHeaderLayout="tree"
                  onExporting={onExporting}
                >
                  <Scrolling mode="virtual" />
                  <FieldChooser enabled={false} />
                  <Export enabled />
                </PivotGrid>
                <Popup
                  visible={popupVisible}
                  width={1200}
                  height={400}
                  title={popupTitle}
                  onHiding={onHiding}
                  onShown={onShown}
                >
                  <DataGrid
                    width={1200}
                    height={300}
                    dataSource={drillDownDataSource}
                    ref={getDataGridInstance}
                  >
                    {rows.map((item) =>
                      item.RPV_AREA === 'R' ? (
                        <Column
                          key={item.RPV_FIELD} // Add a unique key for each Column
                          dataField={item.RPV_FIELD}
                          // dataType={item.RPV_FIELD === 'COUNTRY' ? 'string' : 'number'}
                        />
                      ) : null
                    )}
                    {rows.map((item) =>
                      item.RPV_AREA === 'C' ? (
                        <Column
                          key={item.RPV_FIELD} // Add a unique key for each Column
                          dataField={item.RPV_FIELD}
                          // dataType={item.RPV_FIELD === 'COUNTRY' ? 'string' : 'number'}
                        />
                      ) : null
                    )}
                    {rows.map((item) =>
                      item.RPV_AREA === 'D' ? (
                        <Column
                          key={item.RPV_FIELD} // Add a unique key for each Column
                          dataField={item.RPV_FIELD}
                          dataType="number"
                        />
                      ) : null
                    )}
                  </DataGrid>
                </Popup>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <ExcelPreview
        open={open}
        setOpen={setOpen}
        src={src}
        downloadBuffer={downloadBuffer}
        reportName={rptName}
      />
    </Box>
  );
}

export default DrillDownReport;
