import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Stack,
  Divider,
  useMediaQuery,
  Button,
  Skeleton
} from '@mui/material';

// third-party
import { DndProvider } from 'react-dnd';
import { isMobile } from 'react-device-detect';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  HeaderGroup,
  SortingState,
  GroupingState,
  FilterFn,
  SortingFn,
  sortingFns
} from '@tanstack/react-table';
import { compareItems, rankItem, RankingInfo } from '@tanstack/match-sorter-utils';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import {
  DebouncedInput,
  EmptyTable,
  HeaderSort,
  RowSelection,
  TablePagination,
  RowEditable,
  DraggableColumnHeader,
  SelectColumnVisibility
} from 'components/third-party/react-table';

// types
import { LabelKeyObject } from 'react-csv/lib/core';
import IconButton from 'components/@extended/IconButton';
import { DownOutlined, GroupOutlined, RightOutlined, UngroupOutlined } from '@ant-design/icons';
import ExpandingUserDetail from 'sections/tables/react-table/ExpandingUserDetail';
import CreatePaymentLinkForm from './create-payment-link';
import { PAYMENT_SITE_URL, PaymentLink } from 'config';
import { getAllPaymentsByUserId } from 'data/firebase';
import useAuth from 'hooks/useAuth';
import { getFirestore } from 'firebase/firestore';
import { enqueueSnackbar } from 'notistack';

export const fuzzyFilter: FilterFn<PaymentLink> = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

export const fuzzySort: SortingFn<PaymentLink> = (rowA, rowB, columnId) => {
  let dir = 0;

  // only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]! as RankingInfo,
      rowB.columnFiltersMeta[columnId]! as RankingInfo
    );
  }

  // provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

// ==============================|| REACT TABLE - EDIT ACTION ||============================== //

interface ReactTableProps {
  defaultColumns: ColumnDef<PaymentLink>[];
  data: PaymentLink[];
  setData: any;
  openModal: () => void;
}

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ defaultColumns, data, setData, openModal }: ReactTableProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [grouping, setGrouping] = useState<GroupingState>([]);

  const [originalData, setOriginalData] = useState(() => [...data]);
  const [selectedRow, setSelectedRow] = useState({});

  const [columns] = useState(() => [...defaultColumns]);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((column) => column.id as string) // must start out with populated columnOrder so we can splice
  );

  const [columnVisibility, setColumnVisibility] = useState({});

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      cell: RowEditable
    },
    state: {
      rowSelection,
      columnFilters,
      globalFilter,
      sorting,
      grouping,
      columnOrder,
      columnVisibility
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    getRowCanExpand: () => false,
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    getRowId: (row) => row.invoiceId,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    meta: {
      selectedRow,
      setSelectedRow,
      revertData: (rowIndex: number, revert: unknown) => {
        if (revert) {
          setData((old: PaymentLink[]) => old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row)));
        } else {
          setOriginalData((old) => old.map((row, index) => (index === rowIndex ? data[rowIndex] : row)));
        }
      },
      updateData: (rowIndex, columnId, value) => {
        setData((old: PaymentLink[]) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value
              };
            }
            return row;
          })
        );
      }
    }
  });

  useEffect(() => setColumnVisibility({ id: false }), []);

  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  let headers: LabelKeyObject[] = [];
  table.getVisibleLeafColumns().map(
    (columns) =>
      // @ts-ignore
      columns.columnDef.accessorKey &&
      headers.push({
        label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
        // @ts-ignore
        key: columns.columnDef.accessorKey
      })
  );

  return (
    <MainCard content={false}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        sx={{
          padding: 2,
          ...(matchDownSM && { '& .MuiOutlinedInput-root, & .MuiFormControl-root': { width: '100%' } })
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            sx={{
              marginBottom: '32px'
            }}
            onClick={openModal}
          >
            Create payment link
          </Button>
          <DebouncedInput
            value={globalFilter ?? ''}
            onFilterChange={(value) => setGlobalFilter(String(value))}
            placeholder={`Search ${data.length} records...`}
          />
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <SelectColumnVisibility
            {...{
              getVisibleLeafColumns: table.getVisibleLeafColumns,
              getIsAllColumnsVisible: table.getIsAllColumnsVisible,
              getToggleAllColumnsVisibilityHandler: table.getToggleAllColumnsVisibilityHandler,
              getAllColumns: table.getAllColumns
            }}
          />
        </Stack>
      </Stack>

      <ScrollX>
        <RowSelection selected={Object.keys(rowSelection).length} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                      Object.assign(header.column.columnDef.meta, {
                        className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                      });
                    }

                    return (
                      <DraggableColumnHeader key={header.id} header={header} table={table}>
                        <>
                          {header.isPlaceholder ? null : (
                            <Stack direction="row" spacing={1} alignItems="center">
                              {header.column.getCanGroup() && (
                                <IconButton
                                  color={header.column.getIsGrouped() ? 'error' : 'primary'}
                                  onClick={header.column.getToggleGroupingHandler()}
                                  size="small"
                                  sx={{ p: 0, width: 24, height: 24, fontSize: '1rem', mr: 0.75 }}
                                >
                                  {header.column.getIsGrouped() ? <UngroupOutlined /> : <GroupOutlined />}
                                </IconButton>
                              )}
                              <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                              {header.column.getCanSort() && <HeaderSort column={header.column} sort />}
                            </Stack>
                          )}
                        </>
                      </DraggableColumnHeader>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            {/* <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.column.getCanFilter() && <Filter column={header.column} table={table} />}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead> */}
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow>
                      <>
                        {row.getVisibleCells().map((cell) => {
                          let bgcolor = 'background.paper';
                          if (cell.getIsGrouped()) bgcolor = 'primary.lighter';
                          if (cell.getIsAggregated()) bgcolor = 'warning.lighter';
                          if (cell.getIsPlaceholder()) bgcolor = 'error.lighter';

                          if (cell.column.columnDef.meta !== undefined && cell.column.getCanSort()) {
                            Object.assign(cell.column.columnDef.meta, {
                              style: { backgroundColor: bgcolor }
                            });
                          }

                          return (
                            <TableCell
                              key={cell.id}
                              {...cell.column.columnDef.meta}
                              sx={{ bgcolor }}
                              {...(cell.getIsGrouped() &&
                                cell.column.columnDef.meta === undefined && {
                                  style: { backgroundColor: bgcolor }
                                })}
                            >
                              {cell.getIsGrouped() ? (
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                  <IconButton
                                    color="secondary"
                                    onClick={row.getToggleExpandedHandler()}
                                    size="small"
                                    sx={{ p: 0, width: 24, height: 24 }}
                                  >
                                    {row.getIsExpanded() ? <DownOutlined /> : <RightOutlined />}
                                  </IconButton>
                                  <Box>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Box>{' '}
                                  <Box>({row.subRows.length})</Box>
                                </Stack>
                              ) : cell.getIsAggregated() ? (
                                flexRender(
                                  cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                                  cell.getContext()
                                )
                              ) : cell.getIsPlaceholder() ? null : (
                                flexRender(cell.column.columnDef.cell, cell.getContext())
                              )}
                            </TableCell>
                          );
                        })}
                      </>
                    </TableRow>
                    {row.getIsExpanded() && !row.getIsGrouped() && (
                      <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` } }}>
                        <TableCell colSpan={row.getVisibleCells().length + 2}>
                          <ExpandingUserDetail data={row.original} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length}>
                    <EmptyTable msg="No Data" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              {/* {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  <TableCell />
                  {footerGroup.headers.map((footer) => (
                    <TableCell key={footer.id} {...footer.column.columnDef.meta}>
                      {footer.isPlaceholder ? null : flexRender(footer.column.columnDef.header, footer.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))} */}
            </TableFooter>
          </Table>
        </TableContainer>
        <Divider />
        <Box sx={{ p: 2 }}>
          <TablePagination
            {...{
              setPageSize: table.setPageSize,
              setPageIndex: table.setPageIndex,
              getState: table.getState,
              getPageCount: table.getPageCount
            }}
          />
        </Box>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| REACT TABLE - UMBRELLA ||============================== //

const PaymentLinkTable = () => {
  const db = getFirestore();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [openPaymentLinkModal, setOpenPaymenLinkModal] = useState(false);
  const [data, setData] = useState<PaymentLink[]>([]);

  const loadPaymentLinks = useCallback(async () => {
    try {
      setLoading(true);
      const user = auth.user;
      if (!user) throw new Error('User not authenticated');

      const payments = await getAllPaymentsByUserId(db, user.uid || '');
      setData(payments);
    } catch (error) {
      console.error('Error loading user settings:', error);
      enqueueSnackbar('Failed to load user settings.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [auth.user, db]);

  useEffect(() => {
    loadPaymentLinks();
  }, [loadPaymentLinks]);

  const columnsMemo = useMemo<ColumnDef<PaymentLink>[]>(() => {
    const columns: ColumnDef<PaymentLink>[] = [
      {
        id: 'id',
        header: '#',
        accessorKey: 'id'
      },
      {
        id: 'paymentId',
        header: 'Payment Link ID',
        accessorKey: 'invoiceId',
        enableGrouping: false,
        cell: ({ row }) => {
          return <span>{row.original.invoiceId.replace(/^(.{6}).*(.{6})$/, '$1....$2')}</span>;
        }
      },
      {
        id: 'orderId',
        header: 'Order ID',
        footer: 'Order ID',
        accessorKey: 'orderId',
        enableGrouping: false,
        cell: ({ row }) => {
          return <span>{row.original.orderId}</span>;
        }
      },
      {
        id: 'price',
        header: 'Price',
        footer: 'Price',
        accessorKey: 'price',
        enableGrouping: false,
        cell: ({ row }) => {
          return <span>{row.original.price}</span>;
        }
      },
      {
        id: 'token',
        header: 'Token',
        footer: 'Token',
        accessorKey: 'token',
        enableGrouping: false,
        cell: ({ row }) => {
          return <span>{row.original.token.symbol}</span>;
        }
      },
      {
        id: 'invoiceUrl',
        header: 'Invoice Url',
        footer: 'Invoice Url',
        accessorKey: 'invoiceUrl',
        enableGrouping: false,
        cell: ({ row }) => {
          const url = `${PAYMENT_SITE_URL}/?iid=${row.original.invoiceId}`;
          return (
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          );
        }
      },
      {
        id: 'createdAt',
        header: 'Created At',
        footer: 'Created At',
        accessorKey: 'createdAt',
        enableGrouping: false,
        cell: ({ row }) => {
          const formattedDate = new Date(row.original.createdAt)
            .toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
            .replace(',', '');
          return formattedDate;
        }
      }
    ];

    return loading
      ? columns.map((column) => ({
          ...column,
          cell: () => <Skeleton />
        }))
      : columns;
  }, [loading]);

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <ReactTable {...{ data, defaultColumns: columnsMemo, setData, openModal: () => setOpenPaymenLinkModal(true) }} />

      <CreatePaymentLinkForm
        open={openPaymentLinkModal}
        onClose={() => {
          setOpenPaymenLinkModal(false);
          loadPaymentLinks();
        }}
      />
    </DndProvider>
  );
};

export default PaymentLinkTable;
