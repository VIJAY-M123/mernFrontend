import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { TablePagination, TableSortLabel, TextField, Tooltip } from '@mui/material';
import utils from 'src/@utils';
import _ from 'lodash';
import { FilterList } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { format, isValid } from 'date-fns';

const { fixArrayDates } = utils;

const BasicDatePicker = ({ onChange, fmt }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="filter"
        format={fmt || 'dd/MM/yyyy'}
        onChange={onChange}
        slotProps={{
          textField: { variant: 'filled', fullWidth: true, size: 'small' },
          actionBar: { actions: ['clear', 'accept'] },
        }}
      />
    </LocalizationProvider>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const getExpr = (str) => {
  let result = str;
  const match = str.match(/[!-/:-@[-`{-~]/g) || [];
  _.uniq(match).forEach((m) => {
    result = result.replaceAll(m, `[\\${m}]`);
  });
  return result;
};

const getCellStyle = ({ minWidth, maxWidth, cellStyle }) => ({
  width: minWidth === maxWidth ? minWidth : null,
  minWidth,
  maxWidth,
  ...cellStyle,
});

const CustomizedTable = ({
  className,
  headers = [],
  rows = [],
  options,
  hideFilters,
  hidePagination,
  dateFormat = 'dd/MM/yyyy',
  size = 10,
  cellStyle = {},
  onRowClick = () => {},
  onRowDblClick = () => {},
  tableProps,
  disablePageReset,
  resetFilter,
}) => {
  const [sort, setSort] = useState({ sortBy: null, sortOrder: 'asc' });
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 0, pageSize: size });

  const { sortBy, sortOrder } = sort;

  let sortedRows = rows.map((r, i) => ({ ...r, rowIndex: i }));
  if (sortBy) sortedRows = _.sortBy(sortedRows, sortBy);
  if (sortOrder === 'desc') sortedRows = _.reverse(sortedRows);

  const filteredRows = sortedRows.filter((row) =>
    _.every(
      Object.keys(filters).map((flt) => {
        const value = row[flt];
        const valueType = typeof value;
        const filterValue = filters[flt];
        const exp = new RegExp(getExpr(filterValue), 'i');
        if (filterValue === '') return true;
        if (valueType === 'string') return exp.test(value);
        if (valueType === 'number') return exp.test(value.toString());
        return false;
      }),
      Boolean
    )
  );

  const { page: pg, pageSize } = pagination;
  const { length: count } = filteredRows;

  const page = pg * pageSize - count > 0 ? 0 : pg;
  const pageStart = hidePagination ? 0 : page * pageSize;
  const pageEnd = hidePagination ? count : pageStart + pageSize;

  const tableRows = fixArrayDates(filteredRows.slice(pageStart, pageEnd), dateFormat);

  const handleSortChange = (sby) => {
    if (!sortBy) return setSort((s) => ({ ...s, sortBy: sby }));
    if (sortOrder === 'asc') return setSort((s) => ({ ...s, sortOrder: 'desc' }));
    return setSort({ sortBy: null, sortOrder: 'asc' });
  };

  const handleFilterChange = (id, filter) => {
    setPagination((prev) => ({ ...prev, page: 0 }));
    setFilters((flt) => ({ ...flt, [id]: filter }));
  };

  const filterFields = headers.map(({ id, type, hideFilter }) => {
    if (hideFilter || !id) return false;

    if (type === 'date') {
      return (
        <BasicDatePicker
          onChange={(e) => {
            handleFilterChange(id, isValid(e) ? format(e, 'yyyy-MM-dd') : '');
          }}
        />
      );
    }

    return (
      <TextField
        key={id}
        variant="filled"
        label="filter"
        fullWidth
        size="small"
        onKeyDown={(e) => e.stopPropagation()}
        onChange={(e) => handleFilterChange(id, e.target.value)}
        InputProps={{ endAdornment: <FilterList /> }}
      />
    );
  });

  useEffect(() => {
    if (!disablePageReset) setPagination((prev) => ({ ...prev, page: 0 }));
    if (resetFilter) setFilters({});
  }, [disablePageReset, rows, resetFilter]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }} className={className}>
      <TableContainer {...tableProps}>
        <Table stickyHeader sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              {headers.map(({ id, name, ...header }) => (
                <StyledTableCell key={id} sx={getCellStyle(header)}>
                  <TableSortLabel
                    className="w-full"
                    onClick={() => handleSortChange(id)}
                    active={sortBy === id}
                    direction={sortOrder}
                  >
                    <Tooltip title={name}>
                      <span className="text-white truncate">{name}</span>
                    </Tooltip>
                  </TableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!!rows.length && !hideFilters && (
              <StyledTableRow>
                {filterFields.map((field, i) => (
                  <StyledTableCell className="sticky bg-gray-100 border-b p-6 top-[58px]" key={i}>
                    {field}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            )}
            {count ? (
              tableRows.map(({ rowIndex, ...row }, index) => {
                const rowFields = {
                  rows,
                  row,
                  pageIndex: index,
                  rowIndex,
                  tableRows,
                  headers,
                  filters,
                  pagination,
                };
                return (
                  <StyledTableRow
                    key={index}
                    onClick={() => onRowClick(rowFields)}
                    onDoubleClick={() => onRowDblClick(rowFields)}
                  >
                    {headers.map(({ id, renderCell, ...header }) => {
                      const value = row[id];
                      return (
                        <StyledTableCell
                          key={id}
                          align={typeof value === 'number' ? 'right' : 'left'}
                          className="truncate"
                          sx={{ ...cellStyle, ...getCellStyle(header) }}
                        >
                          {renderCell ? renderCell({ ...rowFields, header: id, value }) : value}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={headers.length} className="text-center h-96">
                  No data
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!hidePagination && (
        <TablePagination
          rowsPerPageOptions={options}
          component="div"
          count={count}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={(__, p) => {
            setPagination((prev) => ({ ...prev, page: p }));
          }}
          onRowsPerPageChange={(e) =>
            setPagination({
              page: 0,
              pageSize: e.target.value,
            })
          }
        />
      )}
    </Paper>
  );
};

export const makeHeader = (...args) => ({
  id: args[0],
  name: args[1],
  type: args[2],
  minWidth: args[3] ?? '150px',
  maxWidth: args[4],
  hideFilter: args[5],
  renderCell:
    args[6] ??
    (({ value }) => (
      <Tooltip
        title={value}
        PopperProps={{
          onClick(e) {
            e.stopPropagation();
          },
          onDoubleClick(e) {
            e.stopPropagation();
          },
        }}
      >
        <span>{value}</span>
      </Tooltip>
    )),
});

export default CustomizedTable;
