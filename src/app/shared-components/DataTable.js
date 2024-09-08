import { FilterList, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { IconButton, MenuItem, Paper, TextField } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import {
  DataGrid,
  gridClasses,
  GridCsvExportMenuItem,
  gridFilteredSortedRowIdsSelector,
  GridFooterContainer,
  GridToolbarContainer,
  GridToolbarExportContainer,
  gridVisibleColumnFieldsSelector,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import utils from 'src/@utils';
import ComboBox from './ComboBox';

const { arrayToExcelBuffer, downloadExcel, getDate } = utils;

const ODD_OPACITY = 0.1;
const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`.${gridClasses.columnHeaders}`]: {
    backgroundColor: '#1aa194 !important', // theme.palette.common.black
    color: theme.palette.common.white,
  },
  [`.${gridClasses.columnHeaders} .MuiIconButton-root`]: {
    // backgroundColor: '#e0e0e0', // theme.palette.common.white
    color: theme.palette.common.white,
  },
  [`.${gridClasses.columnHeaders} .MuiIconButton-root:hover`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

const ExcelExportMenuItem = (props) => {
  const apiRef = useGridApiContext();
  const { hideMenu, fileName, rows } = props;
  return (
    <MenuItem
      onClick={() => {
        // Select rows and columns
        const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
        const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

        // Format the data. Here we only keep the value
        const data = filteredSortedRowIds.map((id) => {
          const row = {};
          visibleColumnsField.forEach((field) => {
            row[field] = apiRef.current.getCellParams(id, field).value;
          });
          return row;
        });

        // Export excel
        arrayToExcelBuffer(rows || data, fileName)
          .then((buffer) => downloadExcel(buffer, fileName))
          .catch((err) => console.log(err));

        // Hide the export menu after the export
        hideMenu?.();
      }}
    >
      Download as XLSX
    </MenuItem>
  );
};

const DataTable = ({
  className,
  checkboxSelection,
  rows,
  columns,
  pageSize,
  rowsPerPageOptions,
  selectionModel,
  disableSelectionOnClick,
  onSelectionModelChange,
  onRowDoubleClick,
  onRowClick,
  exportCsv,
  fileName,
  hideFooterPagination,
  tableProps,
  pagination,
  hideFilters,
  showFilters,
}) => {
  const [size, setSize] = useState(pageSize);
  const [newRows, setNewRows] = useState(rows);
  const [filters, setFilters] = useState({});

  const handlePageSize = (s) => setSize(s);

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarExportContainer>
        <GridCsvExportMenuItem options={{ fileName: fileName + getDate() }} />
        <ExcelExportMenuItem fileName={fileName} rows={tableProps?.initialRows} />
      </GridToolbarExportContainer>
    </GridToolbarContainer>
  );

  const { field, options, top, bottom, count, onBefore, onNext, disableIcon } = pagination || {};

  const CustomFooter = () => (
    <GridFooterContainer>
      <div className="flex items-center justify-end w-full p-6">
        <div className="flex items-center mr-32">
          <div>Rows per page:</div>
          <ComboBox
            className="w-[60px] ml-12"
            field={field}
            handleChange={(v) => setSize(+v.size)}
            opts={options.map((i) => ({ size: String(i) }))}
            displayExpr="size"
            valueExpr="size"
            disableLoading
            autoProps={{ size: 'small', disableClearable: true }}
          />
        </div>
        <div className="mr-10">
          {top}-{bottom} of {count}
        </div>
        <IconButton
          size="small"
          className="mx-4"
          disabled={disableIcon || top <= 1}
          onClick={() => onBefore()}
        >
          <NavigateBefore />
        </IconButton>
        <IconButton
          size="small"
          disabled={disableIcon || bottom === count}
          onClick={() => onNext()}
        >
          <NavigateNext />
        </IconButton>
      </div>
    </GridFooterContainer>
  );

  const autoHeight = !className.match(/h-/);

  const fields = columns
    .filter(({ field: f }) => !f.includes('action') && !hideFilters?.includes(f))
    .reduce(
      (prev, col) => ({
        ...prev,
        [col.field]: (
          <TextField
            variant="filled"
            label="filter"
            fullWidth
            onKeyDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              setFilters((filter) => ({ ...filter, [col.field]: e.target.value }));
            }}
            InputProps={{
              endAdornment: <FilterList />,
            }}
          />
        ),
      }),
      { id: 0 }
    );

  useEffect(() => {
    const newRws = rows.filter((row) =>
      Object.keys(filters)
        .map((f) => {
          const type = typeof row[f];
          const exp = new RegExp(filters[f], 'i');
          if (type === 'string') return exp.exec(row[f]);
          if (type === 'number') return exp.exec(row[f].toString());
          return false;
        })
        .every((i) => i)
    );
    setNewRows(newRws);
  }, [filters, rows]);

  const tableRows = showFilters ? [fields, ...newRows] : newRows;

  return (
    <Paper className={className} style={{ width: '100%' }}>
      <StripedDataGrid
        autoHeight={autoHeight}
        rows={tableRows}
        columns={columns}
        pageSize={size}
        onPageSizeChange={handlePageSize}
        onRowDoubleClick={onRowDoubleClick}
        onRowClick={onRowClick}
        hideFooterPagination={hideFooterPagination}
        rowsPerPageOptions={rowsPerPageOptions}
        selectionModel={selectionModel}
        checkboxSelection={checkboxSelection}
        disableSelectionOnClick={disableSelectionOnClick}
        onSelectionModelChange={onSelectionModelChange}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        components={{
          Toolbar: exportCsv ? CustomToolbar : null,
          Footer: pagination && CustomFooter,
        }}
        {...tableProps}
      />
    </Paper>
  );
};

export default DataTable;
