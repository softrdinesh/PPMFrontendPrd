'use client'

import { useMemo, memo, useContext } from 'react'
import {
  Avatar,
  Button,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import IconifyIcon from '@/components/icon'
import { useBugQueue } from '@/context/bug-queue-context'
import { createBugAPI } from '@/services/modules/bug-queue'
import type { BugQueueListAPI } from '@/services/modules/bug-queue/types'
import BugPriority from './columns/priority'
import TimeResolutionColumn from './columns/time-resolution'
import { BugQueueContext } from 'src/context/bug-queue-context'

interface BugListProps {
  selectedRows: any
  setSelectedRows: (a: any) => void
  workspaceID: number
}

const BugList = ({ selectedRows, setSelectedRows, workspaceID }: BugListProps) => {
  const { data, refetch } = useBugQueue()
  const { columnVisibility: sprintColumnVisibility } = useContext(BugQueueContext)

  const columns: ColumnDef<BugQueueListAPI>[] = useMemo(
    () => [
      {
        id: 'select',
        accessorKey: 'select',
        size: 20,
        maxSize: 20,
        header: ({ table }) => {
          return (
            <div className='flex px-1 w-11'>
              <Checkbox
                checked={!!table?.getIsAllRowsSelected?.()}
                indeterminate={!!table?.getIsSomeRowsSelected?.()}
                onChange={table?.getToggleAllRowsSelectedHandler?.()}
              />
            </div>
          )
        },
        cell: ({ row }) => (
          <div className='flex px-1 !w-11'>
            {row.getCanExpand() ? (
              <IconButton
                size='small'
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: 'pointer' }
                }}
              >
                {row.getIsExpanded() ? (
                  <IconifyIcon icon={'line-md:chevron-down'} />
                ) : (
                  <IconifyIcon icon={'line-md:chevron-right'} />
                )}
              </IconButton>
            ) : null}
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
        id: 'BugID',
        accessorKey: 'BugID',
        header: 'Bug ID',
        cell: ({ row }) => {
          return <>{row?.original?.BugID}</>
        }
      },
      {
        id: 'Reporter',
        accessorKey: 'Reporter',
        header: 'Reporter',
        cell: ({ row }) => {
          return (
            <Avatar
              alt={row?.original?.createdBy?.Name}
              src={row?.original?.createdBy?.ProfilePicture}
              sx={{ width: 32, height: 32 }}
            />
          )
        }
      },
      {
        id: 'BugDescription',
        accessorKey: 'BugName',
        header: 'Bug Details',
        cell: ({ row }) => {
          return <>{row?.original?.BugName}</>
        }
      },
      {
        id: 'TimeResolution',
        accessorKey: 'time',
        header: 'Time until resolution',
        cell: ({ row: { original } }) => {
          return <TimeResolutionColumn bug={original} refetch={refetch} />
        }
      },
      {
        id: 'Priority',
        accessorFn: row => row.PriorityID,
        size: 200,
        maxSize: 200,
        header: 'Priority',
        cell: ({ row: { original: row } }) => {
          return <BugPriority row={row} refetch={refetch} canEdit={true} workspaceID={workspaceID} />
        }
      }
    ],
    [refetch, workspaceID]
  )

  // Filter columns based on visibility from sprint context
  const visibleColumns = useMemo(() => {
    return columns.filter(column => {
      const columnId = column.id as string
      // Always show select column, filter others based on visibility
      // Default to true if visibility setting is not found
      return columnId === 'select' || sprintColumnVisibility[columnId] !== false
    })
  }, [columns, sprintColumnVisibility])

  const table = useReactTable({
    data: (data ?? []) as BugQueueListAPI[],
    columns: visibleColumns,
    state: {
      rowSelection: selectedRows
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setSelectedRows,
    getPaginationRowModel: getPaginationRowModel()
  })

  const handleBugCreate = async () => {
    if (workspaceID) {
      await createBugAPI({ workspaceID })
      refetch()
    }
  }

  return (
    <div>
      <TableContainer>
        <Table className='min-w-[700px]'>
          <TableHead sx={{ backgroundColor: 'background.default' }}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    sx={{ fontWeight: 600, pb: 2, textTransform: 'uppercase' }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row?.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length}>
                  <div className='flex items-center justify-center h-20 w-full'>
                    <Typography>No Tasks Added</Typography>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button startIcon={<i className='ri-add-line' />} onClick={handleBugCreate}>
        Add Bug
      </Button>
    </div>
  )
}

export default memo(BugList)
