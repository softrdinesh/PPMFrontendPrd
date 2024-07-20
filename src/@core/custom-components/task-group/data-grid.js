import { addTask, updateTask } from '@api/task'
import CustomButton from '@components/button'
import NoRowsOverlay from '@custom-components/no-rows-overlay'
import { Icon } from '@iconify/react'
import { Box, Card } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { debounce } from 'lodash'
import { useCallback, useMemo } from 'react'
import TaskPeople from './task-list-items/task-people'
import TaskPriority from './task-list-items/task-priority'
import TaskStatus from './task-list-items/task-status'
import TaskTimeline from './task-list-items/task-timeline'

export default function DataTable({
  isLoading = false,
  isRefetching = false,
  taskList = [],
  taskGroupID = null,
  refetch = () => {},
  handleSelectedRows = () => {}
}) {
  // ** Functions
  const handleAddTask = useCallback(async () => {
    await addTask({ taskGroupID })
    refetch()
  }, [refetch, taskGroupID])

  const debouncedHandleAddTask = useMemo(() => debounce(handleAddTask, 300), [handleAddTask])

  const handleTaskUpdate = useCallback(
    async (row, body) => {
      await updateTask({ id: row?.TaskID, body })
      refetch()

      return null
    },
    [refetch]
  )

  const handleProcessRowUpdate = useCallback(
    updatedRow => {
      const taskID = updatedRow?.TaskID
      const body = { Taskname: updatedRow?.Taskname }
      handleTaskUpdate({ TaskID: taskID }, body)

      return updatedRow
    },
    [handleTaskUpdate]
  )

  const columns = useMemo(
    () => [
      { field: 'TaskID', headerName: 'Task ID', minWidth: 70 },
      {
        field: 'Taskname',
        headerName: 'Task',
        flex: 0.5,
        minWidth: 350,
        editable: true
      },
      {
        field: 'Taskowner',
        headerName: 'Owner',
        description: 'Person who created this task',
        minWidth: 100,
        renderCell: ({ row }) => {
          return <TaskPeople data={[row?.Owner]} refetch={refetch} />
        }
      },
      {
        field: 'Priority',
        headerName: 'Priority',
        valueGetter: (value, row) => row?.Priority?.PriorityName,
        minWidth: 130,
        renderCell: ({ row }) => {
          return <TaskPriority row={row} handlePriorityChange={handleTaskUpdate} />
        }
      },
      {
        field: 'Status',
        headerName: 'Status',
        minWidth: 160,
        valueGetter: (value, row) => row?.Status?.Statusname,
        renderCell: ({ row }) => {
          return <TaskStatus row={row} handleStatusChange={handleTaskUpdate} />
        }
      },
      {
        field: 'Timeline',
        headerName: 'Timeline',
        minWidth: 280,
        valueGetter: (value, row) => `${row?.TimelineStartDate || ''} ${row?.TimelineEndDate || ''}`,
        renderCell: ({ row }) => {
          return <TaskTimeline row={row} handleTimeLineChange={handleTaskUpdate} />
        }
      }
    ],
    [handleTaskUpdate, refetch]
  )

  return (
    <Card>
      <DataGrid
        autoHeight
        rows={taskList}
        getRowId={v => v?.TaskID}
        columns={columns}
        loading={isLoading || isRefetching}
        slots={{ noRowsOverlay: NoRowsOverlay }}
        editMode='cell'
        slotProps={{ noRowsOverlay: { title: 'No Tasks Added' } }}
        checkboxSelection
        onRowSelectionModelChange={handleSelectedRows}
        processRowUpdate={handleProcessRowUpdate}
        hideFooter
        disableColumnMenu
        disableAutosize
        disableRowSelectionOnClick
        disableColumnSelector
        disableColumnResize
      />
      <Box m={2}>
        <CustomButton variant='text' size='small' endIcon={<Icon icon={'mdi:plus'} />} onClick={debouncedHandleAddTask}>
          Add Task
        </CustomButton>
      </Box>
    </Card>
  )
}
