import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectAgency } from 'app/store/agencySlice';
import { selectUser } from 'app/store/userSlice';
import utils from 'src/@utils';
import DataTable from './DataTable';

const { fixArrayDates } = utils;

const TableWithPagination = (props) => {
  const { className, columns, api, data, fmt, options, code, action } = props;

  const agency = useSelector(selectAgency);
  const user = useSelector(selectUser);

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: { size: '10' },
    pageCount: 0,
    count: 0,
    disableIcon: false,
  });

  const { page, pageSize, pageCount, count, disableIcon } = pagination;

  const newData = useMemo(
    () => ({
      ...data,
      [`${code}_CP_ID`]: agency?.cp_id,
      [`${code}_CREATED_BY`]: user.data.user_id,
      [`${code}_PAGE`]: page,
      [`${code}_PAGE_SIZE`]: pageSize.size,
    }),
    [agency, code, data, page, pageSize.size, user]
  );

  const handleCompanyData = useCallback(() => {
    axios
      .post(api.data, newData)
      .then((res) => {
        setRows(
          fixArrayDates(
            res.data.map((e, i) => ({ id: i, ...e, action: action(e, i) })),
            fmt || 'dd/MM/yyyy'
          )
        );

        if (disableIcon) setPagination((prev) => ({ ...prev, disableIcon: false }));
      })
      .catch(({ response }) => {
        console.log(response.data);
      });
  }, [action, api.data, disableIcon, fmt, newData]);

  const handlePagination = useCallback(() => {
    axios
      .post(api.pagination, newData)
      .then(({ data: pageData }) => {
        handleCompanyData();

        const tempCount = pageData[`${code}_PAGE_COUNT`];
        const tempTotal = pageData[`${code}_TOTAL_DATA`];
        const tempPage = page > tempCount ? 1 : page;

        if (tempCount !== pageCount) {
          setPagination({
            ...pagination,
            page: tempPage,
            pageCount: tempCount,
            count: tempTotal,
          });
          return;
        }

        if (tempTotal !== count) {
          setPagination({
            ...pagination,
            page: tempPage,
            pageCount: tempCount,
            count: tempTotal,
          });
        }
      })
      .catch(({ response }) => {
        console.log(response.data);
      });
  }, [api.pagination, code, count, handleCompanyData, newData, page, pageCount, pagination]);

  useEffect(() => handlePagination(), [handlePagination]);

  return (
    <DataTable
      className={className || 'rounded-none rounded-t h-[450px]'}
      columns={columns}
      pageSize={10}
      disableSelectionOnClick
      rows={rows}
      tableProps={{ hideFooter: true }}
      pagination={{
        field: {
          value: pageSize,
          onChange(value) {
            setPagination((prev) => ({ ...prev, disableIcon: true, pageSize: value }));
          },
        },
        options: options || [5, 10, 25, 50, 100],
        top: (page - 1) * pageSize.size + Math.min(1, count),
        bottom: Math.min(page * pageSize.size, count),
        count,
        disableIcon,
        onBefore() {
          if (!disableIcon)
            setPagination((prev) => ({ ...prev, disableIcon: true, page: page - 1 }));
        },
        onNext() {
          if (!disableIcon)
            setPagination((prev) => ({ ...prev, disableIcon: true, page: page + 1 }));
        },
      }}
    />
  );
};

export default TableWithPagination;
