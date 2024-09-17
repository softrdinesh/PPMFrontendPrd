// ** React Imports
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ** MUI Imports
import { Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'

// ** Third Party Imports
import { flexRender, useReactTable, getCoreRowModel } from '@tanstack/react-table'

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
  // ** Hooks
  const [skipAutoResetPageIndex] = useSkipper()

  // ** Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'Taskname',
        minSize: 300,
        size: 300,
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Task
          </Typography>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: [row?.original],
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: async (rowIndex, columnId, value) => {
        return
        if (columnId === 'Taskname') {
          try {
            const body = { Taskname: value }

            const response = await updateTask({ id: taskList?.[rowIndex]?.TaskID, body })
            if (response) {
              refetch()
            }
          } catch (error) {
            console.error('error :', error)
          }
        }
      }
    }
  })

  return (
    <Box>
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
      </Box>
    </Box>
  )
}

export default SubTable
