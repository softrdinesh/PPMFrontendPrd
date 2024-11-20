import { fetchColumnType } from '@api/column-type'
import { addTask, updateTask } from '@api/task'
import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useWorkspace } from 'src/context/workspace-context'
import useWebSocket from 'src/hooks/useWebSocket'
import AddColumnsMenu from './add-columns/menu'
import DynamicDate from './dynamic-task-values/dynamic-date'
import DynamicDropdown from './dynamic-task-values/dynamic-dropdown'
import DynamicFiles from './dynamic-task-values/dynamic-files'
import DynamicPeople from './dynamic-task-values/dynamic-people'
import DynamicStatus from './dynamic-task-values/dynamic-status'
import TaskTextValues from './dynamic-task-values/dynamic-value'
import SubTable from './sub-table'
import TaskNameCell from './task-list-items/task-name'
import TaskPeople from './task-list-items/task-people'
import TaskPriority from './task-list-items/task-priority'
import TaskStatus from './task-list-items/task-status'
import TaskTimeline from './task-list-items/task-timeline'

const ColumnTextField = ({ table, getValue, index, id }) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    table.options.meta?.updateData(index, id, value)
  }

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <TextField
      variant='standard'
      sx={{
        border: 0,
        '& .MuiInputBase-root::before': {
          borderBottom: 0
        },
        '& .MuiInputBase-root:hover::before': {
          borderBottom: 0
        }
      }}
      fullWidth
      inputProps={{ maxLength: 50 }}
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
    />
  )
}

// Give our default column cell renderer editing superpowers!
const defaultColumn = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    return <ColumnTextField getValue={getValue} index={index} id={id} table={table} />
  }
}

const DataTable = ({
  users,
  role,
  isLoading = false,
  taskList = [],
  selectedRows = [],
  taskGroupData = null,
  taskGroupID = null,
  projectID = null,
  projectData,
  refetch = () => {},
  refetchTaskGroup = () => {},
  setSelectedRows
}) => {
  // ** User

  // ** Socket function
  const handleUpdate = data => {
    if (data?.value === 'updateTaskList') {
      refetch()
    }
  }

  // ** Web Socket Setup
  useWebSocket(projectID, handleUpdate)

  // ** GET COLUMN TYPES
  const { data: additionalColumnsType } = useQuery({ queryKey: 'column-type', queryFn: () => fetchColumnType() })

  // ** Hooks
  const { selected } = useWorkspace()

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  const canEdit = useMemo(() => role?.RoleName === 'Admin' || role?.RoleName === 'Member', [role?.RoleName])

  const handleTaskUpdate = useCallback(
    async (row, body) => {
      await updateTask({ id: row?.TaskID, body })
      refetch()

      return null
    },
    [refetch]
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

  // ** Functions
  const handleAddTask = useCallback(async () => {
    await addTask({ taskGroupID, projectID, workspaceID: selected?.WorkspaceID })
    refetch()
  }, [projectID, refetch, selected?.WorkspaceID, taskGroupID])

  const debouncedHandleAddTask = useMemo(() => debounce(handleAddTask, 300), [handleAddTask])

  const dynamicColumn = useCallback(() => {
    return taskGroupData?.additionalColumns?.map(i => {
      return {
        accessorFn: row => filterDynamicValue(i?.AdditionalColumnID, row?.additionalValues ?? [])?.DynamicColumnValues,
        id: i?.AdditionalColumnID,
        minSize: 250,
        size: 250,
        sortable: false,
        header: () => i?.ColumnName,
        cell: ({ getValue, row: { index, original: row }, column: { id }, table }) => {
          const value = filterDynamicValue(i?.AdditionalColumnID, row?.additionalValues ?? [])
          switch (i?.ColumnType?.Keyname) {
            case 'DPK':
              return (
                <DynamicDate
                  canEdit={canEdit}
                  columnData={i}
                  rowData={row}
                  dynamicValue={value ?? null}
                  refetch={refetch}
                />
              )
            case 'DDL':
              const dropdownList = row?.additionalValues?.filter(
                addVal => addVal?.AdditionalColumnID === i?.AdditionalColumnID
              )

              return (
                <DynamicDropdown
                  canEdit={canEdit}
                  columnData={i}
                  rowData={row}
                  dynamicValue={dropdownList ?? null}
                  refetch={refetch}
                />
              )
            case 'LBL':
              return (
                <DynamicStatus
                  canEdit={canEdit}
                  columnData={i}
                  rowData={row}
                  dynamicValue={value ?? null}
                  refetch={refetch}
                />
              )
            case 'USR':
              const usersList = row?.additionalValues?.filter(
                addVal => addVal?.AdditionalColumnID === i?.AdditionalColumnID
              )

              return (
                <DynamicPeople
                  canEdit={canEdit}
                  columnData={i}
                  rowData={row}
                  dynamicValue={usersList ?? []}
                  refetch={refetch}
                  users={users}
                />
              )

            case 'FLE':
              return <DynamicFiles columnData={i} rowData={row} dynamicValue={value} refetch={refetch} />

            default:
              return (
                <TaskTextValues
                  canEdit={canEdit}
                  getValue={getValue}
                  index={index}
                  id={id}
                  table={table}
                  columnData={i}
                  dynamicValue={value ?? null}
                />
              )
          }
        }
      }
    })
  }, [canEdit, refetch, taskGroupData?.additionalColumns, users])

  // ** Columns
  const columns = useMemo(
    () => [
      {
        id: 'select',
        maxSize: 20,
        align: 'right',
        header: ({ table }) => (
          <Box display={'flex'} justifyContent={'end'} pr={0.2}>
            <Checkbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            />
          </Box>
        ),
        cell: ({ row }) => (
          <Box display={'flex'} className='px-1'>
            {row.getCanExpand() ? (
              <IconButton
                size='small'
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: 'pointer' }
                }}
              >
                {row.getIsExpanded() ? <Icon icon={'line-md:chevron-down'} /> : <Icon icon={'line-md:chevron-right'} />}
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
          </Box>
        )
      },
      {
        accessorKey: 'Taskname',
        minSize: 300,
        size: 300,
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Task
          </Typography>
        ),
        cell: ({ getValue, row: { original, index }, column: { id }, table }) => {
          return (
            <TaskNameCell
              renderTextField={
                canEdit ? (
                  <ColumnTextField getValue={getValue} index={index} id={id} table={table} />
                ) : (
                  <Typography width={'100%'}>{original?.Taskname}</Typography>
                )
              }
              rowData={original}
              projectData={projectData}
              refetch={refetch}
            />
          )
        }
      },
      {
        accessorFn: row => row.Owner.Name,
        id: 'owner',
        size: 150,
        maxSize: 150,
        cell: ({ row: { original } }) => {
          return <TaskPeople users={users} data={original?.Owner} refetch={refetch} rowData={original} role={role} />
        },
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Owner
          </Typography>
        )
      },
      {
        accessorFn: row => row.Priority.Name,
        id: 'Priority',
        size: 200,
        maxSize: 200,
        headerName: 'Priority',
        cell: ({ row: { original: row } }) => {
          return <TaskPriority row={row} handlePriorityChange={handleTaskUpdate} refetch={refetch} canEdit={canEdit} />
        }
      },
      {
        accessorFn: row => row.Status.Name,
        id: 'Status',
        size: 200,
        maxSize: 200,
        headerName: 'Status',
        cell: ({ row: { original: row } }) => {
          return <TaskStatus row={row} handleStatusChange={handleTaskUpdate} refetch={refetch} canEdit={canEdit} />
        }
      },
      {
        accessorKey: 'Timeline',
        headerName: 'Timeline',
        cell: ({ row: { original: row } }) => {
          return <TaskTimeline row={row} handleTimeLineChange={handleTaskUpdate} refetch={refetch} canEdit={canEdit} />
        }
      },
      ...dynamicColumn(),
      {
        id: 'add-column',
        size: 20,
        maxSize: 20,
        align: 'right',
        header: () => (
          <IconButton onClick={handlePlusIconClick}>
            <Icon icon={'mdi:plus-circle-outline'} fontSize={27} />
          </IconButton>
        ),
        cell: () => null
      }
    ],
    [canEdit, dynamicColumn, handleTaskUpdate, projectData, refetch, role, users]
  )

  const table = useReactTable({
    data: taskList,
    columns,
    state: {
      rowSelection: selectedRows,
      columnVisibility: {
        'add-column': canEdit
      }
    },
    defaultColumn,
    getRowCanExpand: () => true,
    enableRowSelection: () => true,
    onRowSelectionChange: setSelectedRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: {
      updateData: async (rowIndex, columnId, value) => {
        if (columnId === 'Taskname') {
          try {
            const body = {
              Taskname: value,
              Title: 'Task Name Changed',
              PreviousState: taskList?.[rowIndex]?.Taskname,
              NewState: value
            }

            const response = await updateTask({ id: taskList?.[rowIndex]?.TaskID, body })
            if (response) {
              refetch()
            }
          } catch (error) {
            console.error('error :', error)
          }
        }
        if (value?.AdditionalColumnID) {
          const body = { ...value }
          const response = await updateTask({ id: taskList?.[rowIndex]?.TaskID, body })
          if (response) {
            refetch()
          }
        }
      }
    }
  })

  const renderSubComponent = ({ row }) => {
    return (
      <SubTable
        taskRow={row}
        key={row?.original?.TaskID}
        additionalColumnsType={additionalColumnsType}
        taskGroupData={{ taskGroupID, projectID, workspaceID: selected?.WorkspaceID }}
      />
    )
  }

  if (isLoading) {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'center '} height={'20vh'} width={'100%'}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        '&::-webkit-scrollbar': { height: '1px' },
        border: 1,
        borderRadius: 1,
        boxShadow: theme => theme.shadows[3],
        borderColor: theme => theme.palette.divider
      }}
    >
      <Table
        sx={{
          minWidth: 'max-content'
        }}
      >
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    align={header?.align ?? 'left'}
                    sx={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                      fontWeight: 600,
                      pb: 2
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => {
              return (
                <>
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell, index) => {
                      return (
                        <TableCell key={index}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      )
                    })}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow key={row.id}>
                      {/* 2nd row is a custom 1 cell row */}
                      <TableCell colSpan={row.getVisibleCells().length}>{renderSubComponent({ row })}</TableCell>
                    </TableRow>
                  )}
                </>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns?.length}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={70} width={'100%'}>
                  <Typography>No Tasks Added</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {role?.RoleName !== 'Viewer' && (
        <Box m={2}>
          <CustomButton
            variant='text'
            size='small'
            endIcon={<Icon icon={'mdi:plus'} />}
            onClick={debouncedHandleAddTask}
          >
            Add Task
          </CustomButton>
        </Box>
      )}
      <AddColumnsMenu
        open={anchorEl}
        close={handlePlusMenuClose}
        columns={additionalColumnsType}
        refetchTaskGroup={refetchTaskGroup}
        taskGroupAllData={{ taskGroupID, projectID, workspaceID: selected?.WorkspaceID }}
      />
    </Box>
  )
}

export default DataTable
