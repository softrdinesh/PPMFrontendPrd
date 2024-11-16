// ** React Imports
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import {
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'

// ** Third Party Imports
import { addSubTask, deleteSubTask, fetchSubTaskColumns, fetchSubTaskList, updateSubTask } from '@api/sub-task'
import CustomButton from '@components/button'
import DeleteDialog from '@custom-components/delete-dialog'
import { Icon } from '@iconify/react'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { debounce } from 'lodash'
import { useQuery } from 'react-query'
import AddColumnsMenu from './add-columns/menu'
import DynamicDate from './dynamic-task-values/dynamic-date'
import DynamicDropdown from './dynamic-task-values/dynamic-dropdown'
import DynamicPeople from './dynamic-task-values/dynamic-people'
import DynamicStatus from './dynamic-task-values/dynamic-status'
import TaskTextValues from './dynamic-task-values/dynamic-value'
import SubTaskStatus from './sub-task-list-items/sub-task-status'
import TaskEffortCell from './task-list-items/task-effort'
import TaskPeople from './task-list-items/task-people'
import DynamicFiles from './dynamic-task-values/dynamic-files'

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
      value={value}
      inputProps={{ maxLength: 50 }}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
    />
  )
}

const defaultColumn = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    return <ColumnTextField getValue={getValue} index={index} id={id} table={table} />
  }
}

const SubTable = ({ taskRow, additionalColumnsType, taskGroupData }) => {
  // ** States
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteData, setDeleteData] = useState(null)
  const [adding, setAdding] = useState(false)

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  const { data: additionalSubColumns = [], refetch: refetchDyColumns } = useQuery({
    queryKey: ['sub-task-columns', taskRow?.original?.TaskID],
    queryFn: () => fetchSubTaskColumns({ taskID: taskRow?.original?.TaskID })
  })

  // ** API Calls
  const {
    data: subTaskList = [],
    isLoading,
    refetch: refetchSubTask
  } = useQuery({
    queryKey: ['sub-task-list', taskRow?.original?.TaskID],
    queryFn: () => fetchSubTaskList(taskRow?.original?.TaskID)
  })

  const filterDynamicValue = (additionColumnID, additionalValues) => {
    const filteredValues = additionalValues.find(item => item.AdditionalColumnID === additionColumnID)

    return filteredValues ?? null
  }

  const dynamicColumn = useCallback(() => {
    try {
      return additionalSubColumns?.map(i => {
        return {
          accessorFn: row =>
            filterDynamicValue(i?.AdditionalColumnID, row?.additionalValues ?? [])?.DynamicColumnValues,
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
                    columnData={i}
                    rowData={row}
                    dynamicValue={value ?? null}
                    refetch={refetchSubTask}
                    isSubTask
                  />
                )
              case 'DDL':
                const dropdownList = row?.additionalValues?.filter(
                  addVal => addVal?.AdditionalColumnID === i?.AdditionalColumnID
                )

                return (
                  <DynamicDropdown
                    columnData={i}
                    rowData={{ ...row, TaskGroupID: taskGroupData?.taskGroupID, TaskID: row?.TaskMasterID }}
                    dynamicValue={dropdownList ?? null}
                    refetch={refetchSubTask}
                    isSubTask={true}
                  />
                )
              case 'LBL':
                return (
                  <DynamicStatus
                    columnData={i}
                    rowData={{ ...row, TaskGroupID: taskGroupData?.taskGroupID }}
                    dynamicValue={value ?? null}
                    refetch={refetchSubTask}
                    isSubTask={true}
                  />
                )
              case 'USR':
                const usersList = row?.additionalValues?.filter(
                  addVal => addVal?.AdditionalColumnID === i?.AdditionalColumnID
                )

                return (
                  <DynamicPeople
                    columnData={i}
                    rowData={row}
                    dynamicValue={usersList ?? []}
                    refetch={refetchSubTask}
                    isSubTask={true}
                  />
                )
              case 'FLE':
                return (
                  <DynamicFiles
                    columnData={i}
                    rowData={row}
                    dynamicValue={value}
                    refetch={refetchSubTask}
                    isSubTask={true}
                  />
                )
              default:
                return (
                  <TaskTextValues
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
    } catch (error) {
      console.error('error :', error)

      return [{}]
    }
  }, [additionalSubColumns, refetchSubTask, taskGroupData?.taskGroupID])

  // ** Functions
  const handleTaskUpdate = useCallback(
    async (row, body) => {
      await updateSubTask({ id: row?.SubTaskID, body })
      refetchSubTask()

      return null
    },
    [refetchSubTask]
  )

  // ** Add Task
  const handleAddTask = useCallback(async () => {
    setAdding(true)
    await addSubTask({ taskID: taskRow?.original?.TaskID })
    refetchSubTask()
    setAdding(false)
  }, [refetchSubTask, taskRow?.original?.TaskID])

  const debouncedHandleAddTask = useMemo(() => debounce(handleAddTask, 300), [handleAddTask])

  // ** Delete Sub Task
  const handleDeleteSubTask = rowData => {
    setDeleteOpen(true)
    setDeleteData(rowData)
  }

  const handleDelete = useCallback(async () => {
    const response = await deleteSubTask(deleteData?.SubTaskID)
    if (response?.status) {
      refetchSubTask()
      setDeleteData(null)
      setDeleteOpen(false)
    }
  }, [deleteData?.SubTaskID, refetchSubTask])

  // ** Create Columns
  const handlePlusIconClick = e => {
    setAnchorEl(e.currentTarget)
  }

  const handlePlusMenuClose = () => {
    setAnchorEl(null)
  }

  // ** Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'SubTaskID',
        minSize: 30,
        size: 30,
        header: () => <></>,
        cell: ({ row: { original } }) => {
          return (
            <IconButton sx={{ p: 0 }} size='small' onClick={() => handleDeleteSubTask(original)}>
              <Icon icon={'mingcute:delete-fill'} color='#D02B20' />
            </IconButton>
          )
        }
      },
      {
        accessorKey: 'SubTaskName',
        minSize: 300,
        size: 300,
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Sub Task
          </Typography>
        )
      },
      {
        accessorFn: row => row.Owner.Name,
        id: 'owner',
        size: 160,
        maxSize: 160,
        cell: ({ row: { original } }) => {
          return <TaskPeople data={original?.Owner} refetch={refetchSubTask} rowData={original} isSubTask={true} />
        },
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Owner
          </Typography>
        )
      },
      {
        accessorFn: row => row?.Effort,
        id: 'effort',
        size: 200,
        maxSize: 200,
        cell: ({ getValue, row: { index }, column: { id }, table }) => {
          return <TaskEffortCell getValue={getValue} index={index} id={id} table={table} />
        },
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Planned Effort
          </Typography>
        )
      },
      {
        accessorFn: row => row.Status.Name,
        id: 'Status',
        size: 200,
        maxSize: 200,
        headerName: 'Status',
        cell: ({ row: { original: row } }) => {
          return (
            <SubTaskStatus row={row} taskRow={taskRow} handleStatusChange={handleTaskUpdate} refetch={refetchSubTask} />
          )
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
    [dynamicColumn, handleTaskUpdate, refetchSubTask, taskRow]
  )

  const table = useReactTable({
    data: subTaskList,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: async (rowIndex, columnId, value) => {
        if (columnId === 'SubTaskName' || columnId === 'effort') {
          try {
            let body = {
              TaskID: taskRow?.original?.TaskID
            }

            if (columnId === 'SubTaskName') {
              body.SubTaskName = value

              body.Title = 'Sub-task name changed'
              body.PreviousState = subTaskList?.[rowIndex]?.SubTaskName
              body.NewState = value
            }

            if (columnId === 'effort') {
              body.Effort = value
              body.Title = 'Sub-task Effort changed'
              body.PreviousState = subTaskList?.[rowIndex]?.Effort
              body.NewState = value
            }

            const response = await updateSubTask({ id: subTaskList?.[rowIndex]?.SubTaskID, body })
            if (response) {
              refetch()
            }
          } catch (error) {
            console.error('error :', error)
          }
        }
        if (value?.AdditionalColumnID) {
          const body = { ...value, TaskID: taskRow?.original?.TaskID }
          const response = await updateSubTask({ id: subTaskList?.[rowIndex]?.SubTaskID, body })
          if (response) {
            refetchSubTask()
          }
        }
      }
    }
  })

  if (isLoading) {
    return (
      <Box display={'flex'} alignItems={'center'} ml={40} justifyContent={'start'} height={'20vh'} width={'100%'}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  return (
    <Box py={4} ml={3} display={'flex'}>
      <Box display={'flex'} flexDirection={'column'} width={50} position={'relative'}>
        <Box height={67.5} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Box height={10} width={10} borderRadius={100} bgcolor={'secondary.light'} />
        </Box>
        {subTaskList?.length ? (
          subTaskList?.map(i => (
            <Box height={69} display={'flex'} alignItems={'center'} justifyContent={'end'} key={i?.SubTaskID}>
              <Box width={22} borderTop={'2px dashed'} borderColor={'secondary.light'} position={'relative'}></Box>
            </Box>
          ))
        ) : (
          <Box height={100} display={'flex'} alignItems={'center'} justifyContent={'end'}>
            <Box width={22} borderTop={'2px dashed'} borderColor={'secondary.light'} position={'relative'}></Box>
          </Box>
        )}
        <Box height={50} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Box height={10} width={10} borderRadius={100} bgcolor={'secondary.light'} />
        </Box>
        <Box
          position={'absolute'}
          borderRight={`2px dashed`}
          borderColor={'secondary.light'}
          sx={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', height: 'calc(100% - 60px)' }}
        />
      </Box>
      <Box
        sx={{
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: '1px' },
          borderRadius: 1,
          border: 1,
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
        <Box m={2}>
          <CustomButton
            variant='text'
            size='small'
            color='primary'
            disabled={adding}
            endIcon={<Icon icon={'mdi:plus'} />}
            onClick={debouncedHandleAddTask}
          >
            {adding ? 'Adding' : 'Add Sub Task'}
          </CustomButton>
        </Box>
      </Box>
      <DeleteDialog
        open={deleteOpen && !!deleteData}
        setOpen={setDeleteOpen}
        description={`Subtask '${deleteData?.SubTaskName}' will be deleted`}
        onConfirm={handleDelete}
      />
      <AddColumnsMenu
        open={anchorEl}
        close={handlePlusMenuClose}
        columns={additionalColumnsType}
        refetchTaskGroup={refetchDyColumns}
        taskGroupAllData={{
          ...taskGroupData,
          taskID: taskRow?.original?.TaskID
        }}
        isSubTask={true}
      />
    </Box>
  )
}

export default memo(SubTable)
