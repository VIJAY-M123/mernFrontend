import { Box, Card, CardContent, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import { useCallback, useRef, useState } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectAgency } from 'app/store/agencySlice';
import { Popup } from 'devextreme-react/popup';
import { DataGrid, PivotGrid } from 'devextreme-react';
import { Export, FieldChooser, FieldPanel, Scrolling } from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { Column } from 'devextreme-react/data-grid';
import utils from 'src/@utils';
import { selectUser } from 'app/store/userSlice';
import axios from 'axios';
import ReportForm from './ReportForm';
import reportsService from '../service';
import ExcelPreview from './ExcelPreview';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 1000,
  borderRadius: 2,
  p: 2,
};

const { bufferToBase64, getDate, downloadExcel } = utils;

const PivotReport = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const dataGridRef = useRef(null);

  const user = useSelector(selectUser);
  const agency = useSelector(selectAgency);

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [summary, setSummary] = useState([]);
  const [popupTitle, setPopupTitle] = useState('');
  const [drillDownDataSource, setDrillDownDataSource] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [exportRowFieldHeaders, setExportRowFieldHeaders] = useState(true);
  const [exportColumnFieldHeaders, setExportColumnFieldHeaders] = useState(true);
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
        // dispatch(hideLoader());
        setRows(res);

        if (res.length === 0)
          dispatch(showMessage({ message: 'No data to display', variant: 'info' }));
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
        // dispatch(hideLoader());
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
        setColumns(res);
        dispatch(hideLoader());
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
          expanded: true,
          summaryType: 'sum',
          // showTotals: true,
        };
      }
      if (d.RPV_AREA === 'C') {
        return {
          caption: d.RPV_CAPTION,
          dataField: d.RPV_FIELD,
          dataType: 'string',
          area: 'column',
          expanded: true,
          summaryType: 'sum',
        };
      }
      if (d.RPV_AREA === 'D') {
        return {
          caption: d.RPV_CAPTION,
          dataField: d.RPV_FIELD,
          dataType: 'number',
          area: 'data',
          expanded: true,
          summaryType: 'sum',
          format: '#.##',
          width: '100%',
        };
      }
      return null; // Handle other cases or invalid RPV_AREA values as needed
    })
    .filter((field) => field !== null); // Filter out null values

  const dataSourceTable = new PivotGridDataSource({
    fields: dataSourceFields,
    store: columns,
  });

  const onContentReady = (e, data) => {
    const pivotGrid = e.component;
    const showRowGrandTotals = data.RPH_ROW_TTL === 'Y';
    const dataSource = pivotGrid.getDataSource();

    // dataSource.fields().forEach((field) => {
    //   if (field.dataType === 'number') {
    //     if (showRowGrandTotals) {
    //       console.log('Loop in side Field', field.dataType);
    //       field.area = 'row';
    //       field.summaryType = 'sum';
    //     } else {
    //       field.area = undefined;
    //       field.summaryType = undefined;
    //     }
    //   }
    // });
    // dataSource.repaint();
    // onSubmit({});
  };

  const onExporting = useCallback(
    (e) => {
      dispatch(showLoader());
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Reports');

      exportPivotGrid({
        component: e.component,
        worksheet,
        exportColumnFieldHeaders,
        exportRowFieldHeaders,
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
      dispatch,
      exportColumnFieldHeaders,
      exportRowFieldHeaders,
      user.data.blob_acc_cntr,
      user.data.blob_acc_key,
      user.data.blob_acc_name,
      user.data.blob_url,
    ]
  );

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

  return (
    <div>
      <Box className="p-24">
        <ReportForm id={id} handleReport={onSubmit} />
        {rows.length > 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} className="mt-12">
              <Card>
                <CardContent>
                  <PivotGrid
                    className="overflow-scroll w-[calc(80vw-150px)]"
                    id="sales"
                    dataSource={dataSourceTable}
                    allowSortingBySummary
                    allowSorting
                    allowFiltering
                    allowExpandAll
                    showRowTotals={false}
                    showColumnTotals
                    showBorders
                    height={500}
                    wordWrapEnabled
                    rowHeaderLayout="standard"
                    onExporting={onExporting}
                    onCellClick={onCellClick}
                    showRowGrandTotals={summary?.RPH_ROW_TTL === 'Y'}
                    showColumnGrandTotals={summary?.RPH_COL_TTL === 'Y'}
                    onContentReady={(e) => {
                      onContentReady(
                        e,
                        summary // summary.RPH_ROW_TTL === 'Y' &&
                      );
                    }}
                  >
                    <Scrolling mode="virtual" />
                    <FieldPanel
                      showColumnFields
                      showDataFields
                      showFilterFields
                      showRowFields
                      // allowFieldDragging
                      visible
                    />
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
      </Box>

      <ExcelPreview
        open={open}
        setOpen={setOpen}
        src={src}
        downloadBuffer={downloadBuffer}
        reportName={rptName}
      />
    </div>
  );
};

export default PivotReport;
