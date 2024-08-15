import { fetchColumnType } from '@api/column-type'
import { addTask, updateTask } from '@api/task'
import CustomButton from '@components/button'
import NoRowsOverlay from '@custom-components/no-rows-overlay'
import { Icon } from '@iconify/react'
import { Box, Card, IconButton } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { debounce } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useWorkspace } from 'src/context/workspace-context'
import AddColumnsMenu from './add-columns/menu'
import DynamicDate from './dynamic-task-values/dynamic-date'
import DynamicDropdown from './dynamic-task-values/dynamic-dropdown'
import DynamicPeople from './dynamic-task-values/dynamic-people'
import DynamicStatus from './dynamic-task-values/dynamic-status'
import DynamicText from './dynamic-task-values/dynamic-text'
import TaskPeople from './task-list-items/task-people'
import TaskPriority from './task-list-items/task-priority'
import TaskStatus from './task-list-items/task-status'
import TaskTimeline from './task-list-items/task-timeline'

export default function DataTable({
  isLoading = false,
  isRefetching = false,
  taskList = [],
  taskGroupData = null,
  taskGroupID = null,
  projectID = null,
  refetch = () => {},
  refetchTaskGroup = () => {},
  handleSelectedRows = () => {}
}) {
  console.log('taskList :', taskList)

  // ** GET COLUMN TYPES
  const { data: additionalColumnsType } = useQuery('column-type', fetchColumnType)

  // ** Hooks
  const { selected } = useWorkspace()

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Functions
  const handleAddTask = useCallback(async () => {
    await addTask({ taskGroupID, projectID, workspaceID: selected?.WorkspaceID })
    refetch()
  }, [projectID, refetch, selected?.WorkspaceID, taskGroupID])

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

  const filterDynamicValue = (additionColumnID, additionalValues) => {
    const filteredValues = additionalValues.find(item => item.AdditionalColumnID === additionColumnID)

    return filteredValues ?? null
  }

  const dynamicColumn = useCallback(() => {
    return taskGroupData?.additionalColumns?.map(i => {
      return {
        field: i?.AdditionalColumnID,
        headerName: i?.ColumnName,
        minWidth: 250,
        renderCell: ({ row }) => {
          const value = filterDynamicValue(i?.AdditionalColumnID, row?.additionalValues ?? [])
          console.log('value :', value)
          switch (i?.ColumnType?.Keyname) {
            case 'DPK':
              return <DynamicDate columnData={i} rowData={row} dynamicValue={value ?? null} />
            case 'DDL':
              return <DynamicDropdown row={row} handleTimeLineChange={handleTaskUpdate} />
            case 'USR':
              return <DynamicPeople data={[row?.Owner]} refetch={refetch} />
            case 'LBL':
              return <DynamicStatus columnData={i} row={row} />
            default:
              return <DynamicText />
          }
        }
      }
    })
  }, [handleTaskUpdate, refetch, taskGroupData?.additionalColumns])

  const columns = useMemo(
    () => [
      {
        field: 'Taskname',
        headerName: 'Task',
        flex: 0.3,
        minWidth: 300,
        editable: true
      },
      {
        field: 'Taskowner',
        flex: 0.1,
        headerName: 'Owner',
        minWidth: 100,
        description: 'Person who created this task',
        minWidth: 100,
        renderCell: ({ row }) => {
          return <TaskPeople data={[row?.Owner]} refetch={refetch} />
        }
      },
      {
        field: 'Priority',
        flex: 0.15,
        minWidth: 150,
        headerName: 'Priority',
        valueGetter: (value, row) => row?.Priority?.PriorityName,
        renderCell: ({ row }) => {
          return <TaskPriority row={row} handlePriorityChange={handleTaskUpdate} />
        }
      },
      {
        field: 'Status',
        flex: 0.2,
        minWidth: 150,
        headerName: 'Status',
        valueGetter: (value, row) => row?.Status?.Statusname,
        renderCell: ({ row }) => {
          return <TaskStatus row={row} handleStatusChange={handleTaskUpdate} />
        }
      },
      {
        field: 'Timeline',
        flex: 0.2,
        minWidth: 220,
        headerName: 'Timeline',
        valueGetter: (value, row) => `${row?.TimelineStartDate || ''} ${row?.TimelineEndDate || ''}`,
        renderCell: ({ row }) => {
          return <TaskTimeline row={row} handleTimeLineChange={handleTaskUpdate} />
        }
      },
      ...dynamicColumn(),
      {
        field: 'add column',
        flex: 0.1,
        sortable: false,
        minWidth: 100,
        headerAlign: 'center',
        headerName: (
          <IconButton onClick={handlePlusIconClick}>
            <Icon icon={'mdi:plus-circle-outline'} />
          </IconButton>
        )
      }
    ],
    [dynamicColumn, handleTaskUpdate, refetch]
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
      <AddColumnsMenu
        open={anchorEl}
        close={handlePlusMenuClose}
        columns={additionalColumnsType}
        refetchTaskGroup={refetchTaskGroup}
        taskGroupAllData={{ taskGroupID, projectID, workspaceID: selected?.WorkspaceID }}
      />
    </Card>
  )
}
