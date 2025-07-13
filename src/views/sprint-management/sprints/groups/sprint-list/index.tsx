import IconifyIcon from '@/components/icon'
import { SprintGroupItem } from '@/services/modules/sprint-group/type'
import { fetchSprintList } from '@/services/modules/sprint-item'
import { SprintItem } from '@/services/modules/sprint-item/types'
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useState } from 'react'
import { useMemo } from 'react'

const SprintList = ({ sg }: { sg: SprintGroupItem }) => {
  // ** States
  const [selectedRows, setSelectedRows] = useState<any>({})

  const sprintListApi = useQuery({
    queryKey: ['sprint-list', sg?.SprintGroupID],
    queryFn: () => fetchSprintList({ SprintGroupID: sg?.SprintGroupID })
  })

  const columns: ColumnDef<SprintItem>[] = useMemo(
    () => [
      {
        id: 'select',
        accessorKey: 'select',
        size: 20,
        maxSize: 20,
        header: ({ table }) => {
          return (
            <div className='flex justify-start ml-1 !w-20'>
              <Checkbox
                checked={!!table?.getIsAllRowsSelected?.()} // ✅ Avoids undefined error
                indeterminate={!!table?.getIsSomeRowsSelected?.()}
                onChange={table?.getToggleAllRowsSelectedHandler?.()}
              />
            </div>
          )
        },
        cell: ({ row }) => (
          <div className='flex px-1 !w-20'>
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          </div>
        )
      },
      {
        accessorKey: 'Name',
        size: 200,
        maxSize: 1000,
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Sprint
          </Typography>
        ),
        cell: ({ row: { original } }) => {
          return <>{original?.Name}</>
        }
      },
      {
        accessorKey: 'Goals',
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Goals
          </Typography>
        ),
        cell: ({ row: { original } }) => {
          return <>{original?.Goals || '-'}</>
        }
      },
      {
        accessorKey: 'ActiveSprint',
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Active Sprint
          </Typography>
        ),
        cell: ({ row: { original } }) => {
          if (original?.SprintStatus === 'Active')
            return (
              <>
                <i className='ri-check-line' />
              </>
            )
          return (
            <>
              <i className='ri-check-line' />
            </>
          )
        }
      }
    ],
    []
  )

  const table = useReactTable({
    data: (sprintListApi?.data?.data ?? []) as SprintItem[],
    columns,
    initialState: { columnPinning: { left: ['select', 'Taskname'], right: ['add-column'] } },
    state: {
      rowSelection: selectedRows
    },
    getRowCanExpand: () => true,
    enableRowSelection: true,
    onRowSelectionChange: setSelectedRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  })

  if (sprintListApi?.isLoading || sprintListApi?.isFetching)
    return (
      <div>
        <CircularProgress />
      </div>
    )

  if (sprintListApi?.isError) return <div>Error</div>

  return (
    <div className='px-3'>
      <Table
        sx={{
          minWidth: 'max-content'
        }}
      >
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableCell
                  key={header.id}
                  colSpan={header.colSpan}
                  sx={{ fontWeight: 600, pb: 1, height: 67.5, textTransform: 'uppercase' }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    )
                  })}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns?.length}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={70} width={'100%'}>
                  <Typography>No Data Found</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default SprintList
