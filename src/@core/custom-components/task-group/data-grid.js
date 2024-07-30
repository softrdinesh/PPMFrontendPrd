import { addTask, updateTask } from '@api/task'
import CustomButton from '@components/button'
import NoRowsOverlay from '@custom-components/no-rows-overlay'
import { Icon } from '@iconify/react'
import { Box, Card, IconButton } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { debounce } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import TaskPeople from './task-list-items/task-people'
import TaskPriority from './task-list-items/task-priority'
import TaskStatus from './task-list-items/task-status'
import TaskTimeline from './task-list-items/task-timeline'
import AddColumnsMenu from './add-columns/menu'
import { useQuery } from 'react-query'
import { fetchColumnType } from '@api/column-type'

export default function DataTable({
  isLoading = false,
  isRefetching = false,
  taskList = [],
  taskGroupID = null,
  refetch = () => {},
  handleSelectedRows = () => {}
}) {
  // ** GET COLUMN TYPES
  const { data: additionalColumnsType } = useQuery('column-type', fetchColumnType)

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

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

  const handlePlusIconClick = e => {
    setAnchorEl(e.currentTarget)
  }

  const handlePlusMenuClose = () => {
    setAnchorEl(null)
  }

  const columns = useMemo(
    () => [
      {
        field: 'Taskname',
        headerName: 'Task',
        flex: 0.3,
        editable: true
      },
      {
        field: 'Taskowner',
        flex: 0.1,
        headerName: 'Owner',
        description: 'Person who created this task',
        minWidth: 100,
        renderCell: ({ row }) => {
          return <TaskPeople data={[row?.Owner]} refetch={refetch} />
        }
      },
      {
        field: 'Priority',
        flex: 0.15,
        headerName: 'Priority',
        valueGetter: (value, row) => row?.Priority?.PriorityName,
        renderCell: ({ row }) => {
          return <TaskPriority row={row} handlePriorityChange={handleTaskUpdate} />
        }
      },
      {
        field: 'Status',
        flex: 0.2,
        headerName: 'Status',
        valueGetter: (value, row) => row?.Status?.Statusname,
        renderCell: ({ row }) => {
          return <TaskStatus row={row} handleStatusChange={handleTaskUpdate} />
        }
      },
      {
        field: 'Timeline',
        flex: 0.2,
        headerName: 'Timeline',
        valueGetter: (value, row) => `${row?.TimelineStartDate || ''} ${row?.TimelineEndDate || ''}`,
        renderCell: ({ row }) => {
          return <TaskTimeline row={row} handleTimeLineChange={handleTaskUpdate} />
        }
      },
      {
        field: 'add column',
        flex: 0.1,
        sortable: false,
        headerAlign: 'center',
        headerName: (
          <IconButton onClick={handlePlusIconClick}>
            <Icon icon={'mdi:plus-circle-outline'} />
          </IconButton>
        )
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
        slotProps={{
          noRowsOverlay: { title: 'No Tasks Added' },
          loadingOverlay: {
            variant: isLoading ? 'skeleton' : 'linear-progress',
            noRowsVariant: isLoading ? 'skeleton' : 'linear-progress'
          }
        }}
        sx={{ '& .MuiDataGrid-overlay .MuiLinearProgress-root': { height: 2 } }}
        checkboxSelection
        onRowSelectionModelChange={handleSelectedRows}
        processRowUpdate={handleProcessRowUpdate}
        hideFooter
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnResize
      />
      <Box m={2}>
        <CustomButton variant='text' size='small' endIcon={<Icon icon={'mdi:plus'} />} onClick={debouncedHandleAddTask}>
          Add Task
        </CustomButton>
      </Box>
      <AddColumnsMenu open={anchorEl} close={handlePlusMenuClose} columns={additionalColumnsType} />
    </Card>
  )
}
