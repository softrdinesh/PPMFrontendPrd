import { useMemo, useState, useContext } from 'react'

import {
  Box,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

import { useQuery } from '@tanstack/react-query'

import type { ColumnDef } from '@tanstack/react-table'

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'

import { debounce } from 'lodash'

import CustomButton from '@/components/button'
import type { SprintItem } from '@/services/modules/sprint-item/types'
import { createSprintTasks, fetchSprintTaskList, updateSprintTask } from '@/services/modules/sprint-tasks'
import { ColumnTextField } from '@/views/project/task-group/task/columns/default-column'
import type { SprintTaskItem } from '@/services/modules/sprint-tasks/types'
import { SprintTaskManagement } from 'src/context/sprint-tast-context' // Update import path as needed

const TaskTableSprint = ({ 
  enabled, 
  sp, 
  selectedTask 
}: { 
  enabled: boolean; 
  sp: SprintItem;
  selectedTask?: { id: string; name: string; sprintID: string; Taskname: string; SprintTaskID: string } | null
}) => {
  // ** States
  const [selectedRows, setSelectedRows] = useState<any>({})
  const [adding, setAdding] = useState(false)

  // Get column visibility from sprint context
  const { columnVisibility: sprintColumnVisibility } = useContext(SprintTaskManagement)

  const sprintListApi = useQuery({
    queryKey: ['sprint-list', sp?.SprintID],
    queryFn: () => fetchSprintTaskList({ sprintID: sp?.SprintID }),
    enabled
  })

  // Filter data based on selected task
  const filteredData = useMemo(() => {
    const rawData = (sprintListApi?.data?.data ?? []) as SprintTaskItem[]
    
    if (selectedTask && selectedTask.SprintTaskID) {
      return rawData.filter(task => task.SprintTaskID === selectedTask.SprintTaskID)
    }
    
    return rawData
  }, [sprintListApi?.data?.data, selectedTask])

  const columns: ColumnDef<SprintTaskItem>[] = useMemo(
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
        accessorKey: 'Taskname',
        size: 200,
        maxSize: 1000,
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Taskname
          </Typography>
        ),
        cell: ({ getValue, row: { index }, column: { id }, table }) => {
          return <ColumnTextField canEdit={true} getValue={getValue} index={index} id={id} table={table} />
        }
      },
      {
        accessorKey: 'ActualSP',
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Actual SP
          </Typography>
        ),
        cell: ({ row: { original } }) => {
          return <>{original?.ActualSP || '-'}</>
        }
      },
      {
        accessorKey: 'IsUnplanned',
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Is Unplanned
          </Typography>
        ),
        cell: ({ row: { original } }) => {
          if (original?.IsUnplanned) return <i className='ri-check-line' />

          return <></>
        }
      },
      {
        accessorKey: 'EstimatedSP',
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Estimated SP
          </Typography>
        ),
        cell: ({ row: { original } }) => {
          return <>{original?.EstimatedSP || '-'}</>
        }
      }
    ],
    []
  )

  // Filter columns based on visibility from sprint context
  const visibleColumns = useMemo(() => {
    return columns.filter(column => {
      const accessorKey = column.accessorKey as string
      // Always show select column, filter others based on visibility
      return accessorKey === 'select' || sprintColumnVisibility[accessorKey]
    })
  }, [columns, sprintColumnVisibility])

  const table = useReactTable({
    data: filteredData, // Use filtered data instead of raw data
    columns: visibleColumns, // Use filtered columns
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
    getExpandedRowModel: getExpandedRowModel(),
    meta: {
      updateData: async (rowIndex: number, columnId: any, value: { AdditionalColumnID: string }) => {
        if (columnId === 'Taskname' && sprintListApi?.data?.data?.[rowIndex]?.SprintTaskID) {
          try {
            const response = await updateSprintTask({
              id: sprintListApi?.data?.data?.[rowIndex]?.SprintTaskID?.toString(),
              body: { Taskname: value }
            })

            if (response) {
              sprintListApi?.refetch()
            }
          } catch (error) {
            console.error('error :', error)
          }
        }
      }
    }
  })

  const handleAddSprint = async () => {
    setAdding(true)

    const body = {
      sprintID: sp?.SprintID
    }

    await createSprintTasks(body)
    sprintListApi.refetch()

    setAdding(false)
  }

  const debouncedHandleAddSprint = debounce(handleAddSprint, 500)

  if (sprintListApi?.isLoading)
    return (
      <div className='w-full flex justify-center'>
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
              <TableCell colSpan={visibleColumns?.length}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={70} width={'100%'}>
                  <Typography>No Data Found</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='flex justify-between items-center gap-2 m-2'>
        <CustomButton
          variant='text'
          size='small'
          startIcon={<i className='ri-add-line' />}
          onClick={debouncedHandleAddSprint}
        >
          {adding ? 'Adding...' : 'Add Task'}
        </CustomButton>
      </div>
    </div>
  )
}

export default TaskTableSprint
