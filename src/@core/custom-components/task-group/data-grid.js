import { addTask, updateTask } from '@api/task'
import CustomButton from '@components/button'
import NoRowsOverlay from '@custom-components/no-rows-overlay'
import { Icon } from '@iconify/react'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useCallback, useMemo } from 'react'
import TaskNameCell from './task-list-items/task-name'
import TaskPriority from './task-list-items/task-priority'
import TaskStatus from './task-list-items/task-status'
import TaskTimeline from './task-list-items/task-timeline'

export default function DataTable({ isLoading, taskList, taskGroupID, refetch }) {
  const handleAddTask = async () => {
    await addTask({ taskGroupID })
    refetch()
  }

  const handleTaskUpdate = useCallback(
    async (row, body) => {
      console.log('row, body :', row, body)
      await updateTask({ id: row?.TaskID, body })
      refetch()
    },
    [refetch]
  )

  const columns = useMemo(
    () => [
      { field: 'TaskID', headerName: 'Task ID', minWidth: 70 },
      { field: 'Taskowner', headerName: 'Owner', minWidth: 70 },
      {
        field: 'Taskname',
        headerName: 'Task',
        flex: 0.5,
        minWidth: 130,
        renderCell: ({ row }) => {
          return <TaskNameCell data={row} refetch={refetch} />
        }
      },
      {
        field: 'Priority',
        headerName: 'Priority',
        minWidth: 130,
        renderCell: ({ row }) => {
          return <TaskPriority row={row} handlePriorityChange={handleTaskUpdate} />
        }
      },
      {
        field: 'Status',
        headerName: 'Status',
        minWidth: 150,
        renderCell: ({ row }) => {
          return <TaskStatus row={row} handleStatusChange={handleTaskUpdate} />
        }
      },
      {
        field: 'Timeline',
        headerName: 'Timeline',
        minWidth: 250,
        valueGetter: (value, row) => `${row?.TimelineStartDate || ''} ${row?.TimelineEndDate || ''}`,
        renderCell: ({ row }) => {
          return <TaskTimeline row={row} handleTimeLineChange={handleTaskUpdate} />
        }
      }
    ],
    [handleTaskUpdate, refetch]
  )

  return (
    <Box>
      <DataGrid
        autoHeight
        rows={taskList}
        getRowId={v => v?.TaskID}
        columns={columns}
        loading={isLoading}
        slots={{ noRowsOverlay: NoRowsOverlay }}
        slotProps={{ noRowsOverlay: { title: 'No Tasks Added' } }}
        editMode='cell'
        checkboxSelection
        hideFooter
        disableColumnMenu
        disableAutosize
        disableRowSelectionOnClick
        disableColumnSelector
        disableVirtualization
        disableColumnResize
      />
      <CustomButton variant='text' size='small' endIcon={<Icon icon={'mdi:plus'} />} onClick={handleAddTask}>
        Add Task
      </CustomButton>
    </Box>
  )
}
