import { fetchColumnType } from '@api/column-type'
import { updateTask } from '@api/task'
import { Icon } from '@iconify/react'
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useWorkspace } from 'src/context/workspace-context'
import AddColumnsMenu from './add-columns/menu'
import DynamicDate from './dynamic-task-values/dynamic-date'
import DynamicDropdown from './dynamic-task-values/dynamic-dropdown'
import DynamicPeople from './dynamic-task-values/dynamic-people'
import DynamicStatus from './dynamic-task-values/dynamic-status'
import DynamicText from './dynamic-task-values/dynamic-text'
import SubTable from './sub-table'
import TaskPeople from './task-list-items/task-people'
import TaskPriority from './task-list-items/task-priority'
import TaskStatus from './task-list-items/task-status'
import TaskTimeline from './task-list-items/task-timeline'

function useSkipper() {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip]
}

// Give our default column cell renderer editing superpowers!
const defaultColumn = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
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
          '&::before, &::before:hover': {
            borderBottom: '0px'
          }
        }}
        fullWidth
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
      />
    )
  }
}

const DataTable = ({
  isLoading = false,
  isRefetching = false,
  taskList = [],
  taskGroupData = null,
  taskGroupID = null,
  projectID = null,
  refetch = () => {},
  refetchTaskGroup = () => {},
  handleSelectedRows = () => {}
}) => {
  // ** GET COLUMN TYPES
  const { data: additionalColumnsType } = useQuery({ queryKey: 'column-type', queryFn: () => fetchColumnType() })

  // ** Hooks
  const { selected } = useWorkspace()
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

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
    console.log('filteredValues :', filteredValues)

    return filteredValues ?? null
  }

  const dynamicColumn = useCallback(() => {
    return taskGroupData?.additionalColumns?.map(i => {
      return {
        id: i?.AdditionalColumnID,
        minSize: 250, // Prevent shrinking
        size: 250, // Ensure column has fixed size
        sortable: false,
        header: () => i?.ColumnName,
        cell: ({ row: { original: row } }) => {
          const value = filterDynamicValue(i?.AdditionalColumnID, row?.additionalValues ?? [])
          switch (i?.ColumnType?.Keyname) {
            case 'DPK':
              return <DynamicDate columnData={i} rowData={row} dynamicValue={value ?? null} refetch={refetch} />
            case 'DDL':
              return <DynamicDropdown columnData={i} rowData={row} dynamicValue={value ?? null} refetch={refetch} />
            case 'LBL':
              return <DynamicStatus columnData={i} rowData={row} dynamicValue={value ?? null} refetch={refetch} />
            case 'USR':
              const usersList = row?.additionalValues?.filter(
                addVal => addVal?.AdditionalColumnID === i?.AdditionalColumnID
              )

              return <DynamicPeople columnData={i} rowData={row} dynamicValue={usersList ?? []} refetch={refetch} />
            default:
              return (
                <DynamicText
                  columnData={i}
                  rowData={row}
                  dynamicValue={value ?? null}
                  refetch={refetch}
                  number={i?.ColumnType?.Keyname === 'NUM'}
                />
              )
          }
        }
      }
    })
  }, [refetch, taskGroupData?.additionalColumns])

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
        )
      },
      {
        accessorFn: row => row.Owner.Name,
        id: 'owner',
        size: 150,
        maxSize: 150,
        cell: ({ row: { original } }) => {
          return <TaskPeople data={[original?.Owner]} refetch={refetch} />
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
          return <TaskPriority row={row} handlePriorityChange={handleTaskUpdate} refetch={refetch} />
        }
      },
      {
        accessorFn: row => row.Status.Name,
        id: 'Status',
        size: 200,
        maxSize: 200,
        headerName: 'Status',
        cell: ({ row: { original: row } }) => {
          return <TaskStatus row={row} handleStatusChange={handleTaskUpdate} refetch={refetch} />
        }
      },
      {
        accessorKey: 'Timeline',
        headerName: 'Timeline',
        cell: ({ row: { original: row } }) => {
          return <TaskTimeline row={row} handleTimeLineChange={handleTaskUpdate} refetch={refetch} />
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
    [dynamicColumn, handleTaskUpdate, refetch]
  )

  const table = useReactTable({
    data: taskList,
    columns,
    defaultColumn,
    getRowCanExpand: row => true,
    enableRowSelection: () => true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        console.log('rowIndex :', rowIndex)
        console.log('value :', value)
        console.log('columnId :', columnId)
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex()
        // setData(old =>
        //   old.map((row, index) => {
        //     if (index === rowIndex) {
        //       return {
        //         ...old[rowIndex],
        //         [columnId]: value
        //       }
        //     }
        //     return row
        //   })
        // )
      }
    }
  })

  const renderSubComponent = ({ row }) => {
    return <SubTable row={row} />
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', '&::-webkit-scrollbar': { height: '4px' } }}>
      <Table
        sx={{
          minWidth: 'max-content', // This ensures the table takes the required width based on content
          border: 1,
          borderRadius: 1,
          boxShadow: theme => theme.shadows[3],
          borderColor: theme => theme.palette.divider
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
          {table.getRowModel().rows.map(row => {
            return (
              <>
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    )
                  })}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    {/* 2nd row is a custom 1 cell row */}
                    <TableCell colSpan={row.getVisibleCells().length}>{renderSubComponent({ row })}</TableCell>
                  </TableRow>
                )}
              </>
            )
          })}
        </TableBody>
      </Table>
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
