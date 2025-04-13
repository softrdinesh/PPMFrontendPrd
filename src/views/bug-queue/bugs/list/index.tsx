'use client'

import { Fragment, memo, useMemo } from 'react'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'

import { fetchBugQueueList } from '@/services/modules/bug-queue'

const BugList = () => {
  const { data } = useQuery({ queryKey: ['bug-list'], queryFn: () => fetchBugQueueList(), retry: false })

  console.log('data :', data)

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'Taskname',
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Task
          </Typography>
        ),
        cell: ({ row: { original } }) => {
          return <Typography width={'100%'}>{original?.Taskname ?? '—'}</Typography>
        }
      }
    ],
    []
  )

  const table = useReactTable({
    data: [
      {
        Taskname: 'Fix login bug',
        Owner: { Name: 'Alice', Email: 'email', ProfilePicture: 'profile.jpg', UserID: 1 }
      },
      {
        Taskname: '2 Fix login bug',
        Owner: { Name: 'Alice', Email: 'email', ProfilePicture: 'profile.jpg', UserID: 1 }
      }
    ] as any[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <div>
      <TableContainer>
        <Table className='min-w-[700px]'>
          <TableHead sx={{ backgroundColor: 'background.default' }}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    sx={{ fontWeight: 600, pb: 2, textTransform: 'uppercase' }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <Fragment key={row.id}>
                  <TableRow>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className='flex items-center justify-center h-20 w-full'>
                    <Typography>No Tasks Added</Typography>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default memo(BugList)
