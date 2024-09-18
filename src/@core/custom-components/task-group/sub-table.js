// ** React Imports
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'

// ** Third Party Imports
import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { debounce } from 'lodash'
import { useQuery } from 'react-query'
import TaskPeople from './task-list-items/task-people'
import { addSubTask, deleteSubTask, fetchSubTaskList } from '@api/sub-task'
import DeleteDialog from '@custom-components/delete-dialog'

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
          '& .MuiInputBase-root::before': {
            borderBottom: 0
          },
          '& .MuiInputBase-root:hover::before': {
            borderBottom: 0
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

const SubTable = ({ row }) => {
  // ** States
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteData, setDeleteData] = useState(null)

  // ** API Calls
  const { data: subTaskList = [], refetch: refetchSubTask } = useQuery({
    queryKey: ['sub-task-list', row?.original?.TaskID],
    queryFn: () => fetchSubTaskList(row?.original?.TaskID)
  })

  // ** Functions
  const handleAddTask = useCallback(async () => {
    await addSubTask({ taskID: row?.original?.TaskID })
    refetchSubTask()
  }, [])

  const debouncedHandleAddTask = useMemo(() => debounce(handleAddTask, 300), [handleAddTask])

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
  }, [deleteData])

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
          return <TaskPeople data={[original?.Owner]} refetch={refetchSubTask} />
        },
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Owner
          </Typography>
        )
      },
      {
        accessorKey: 'Effort',
        id: 'effort',
        size: 200,
        maxSize: 200,
        cell: ({ row: { original } }) => {
          return (
            <Typography variant='body2' fontWeight={800}>
              {original?.Effort ?? '-'}
            </Typography>
          )
        },
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Planned Effort
          </Typography>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: subTaskList,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <Box py={4} ml={3} display={'flex'}>
      <Box display={'flex'} flexDirection={'column'} width={50} position={'relative'}>
        <Box height={45} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Box height={10} width={10} borderRadius={100} bgcolor={'secondary.light'} />
        </Box>
        {subTaskList?.map(i => (
          <Box height={64.44} display={'flex'} alignItems={'center'} justifyContent={'end'}>
            <Box width={22} borderTop={'2px dashed'} borderColor={'secondary.light'} position={'relative'}></Box>
          </Box>
        ))}
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
          // border: 1,
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
            {table.getRowModel().rows.map(row => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Box m={2}>
          <CustomButton
            variant='text'
            size='small'
            color='primary'
            endIcon={<Icon icon={'mdi:plus'} />}
            onClick={debouncedHandleAddTask}
          >
            Add Sub Task
          </CustomButton>
        </Box>
      </Box>
      <DeleteDialog
        open={deleteOpen && !!deleteData}
        setOpen={setDeleteOpen}
        description={`Subtask '${deleteData?.SubTaskName}' will be deleted`}
        onConfirm={handleDelete}
      />
    </Box>
  )
}

export default memo(SubTable)
