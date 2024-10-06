import Avatar from '@components/avatar'
import { Icon } from '@iconify/react'
import { Box, Checkbox, Grid, Menu, Table, TableBody, TableCell, TableRow, Typography, Zoom } from '@mui/material'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { getInitials } from '@utils/get-initials'
import moment from 'moment'
import React, { useMemo, useState } from 'react'

const DATA = [
  {
    id: 0,
    created_at: new Date(),
    created_by: {
      image: '/images/avatars/3.png',
      Name: 'Vidya Balan'
    },
    subject: 'Added Owner',
    previousValue: 'vidya@domain.com',
    newValue: 'Tested as mail'
  },
  {
    id: 0,
    created_at: new Date(),
    created_by: {
      image: '/images/avatars/2.png',
      Name: 'Cody Fisher'
    },
    subject: 'Like',
    previousValue: '-',
    newValue: '-'
  },
  {
    id: 0,
    created_at: new Date(),
    created_by: {
      image: '/images/avatars/5.png',
      Name: 'Esther Howard'
    },
    subject: 'Date Changed',
    previousValue: 'May 20, 2015',
    newValue: 'May 23, 2015'
  },
  {
    id: 0,
    created_at: new Date(),
    created_by: {
      image: null,
      Name: 'Marvin McKinney'
    },
    subject: 'Subscribed',
    previousValue: '+',
    newValue: '-'
  }
]

const FilterMenuItem = () => {
  return (
    <Box pl={2} display={'flex'} alignItems={'center'} justifyContent={'space-between'} minWidth={140}>
      <Typography>People</Typography>
      <Checkbox size='small' />
    </Box>
  )
}

const ActivityTable = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'created_at',
        cell: ({ row: { original } }) => {
          return (
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <Icon icon={'mingcute:parking-fill'} fontSize={20} />
              <Typography variant='subtitle2'>{moment(original).fromNow()}</Typography>
            </Box>
          )
        }
      },
      {
        accessorKey: 'image',
        cell: ({ row: { original } }) => {
          return (
            <Avatar variant='circle' skin='light' sx={{ width: 40, height: 40 }} src={original?.created_by?.image}>
              {getInitials(original?.created_by?.Name)}
            </Avatar>
          )
        }
      },
      {
        accessorKey: 'Name',
        cell: ({ row: { original } }) => {
          return <Typography variant='body1'>{original?.created_by?.Name}</Typography>
        }
      },
      {
        accessorKey: 'subject',
        cell: ({ row: { original } }) => {
          return <Typography variant='body1'>{original?.subject}</Typography>
        }
      },
      {
        accessorKey: 'previousValue',
        cell: ({ row: { original } }) => {
          return <Typography variant='body1'>{original?.previousValue}</Typography>
        }
      },
      {
        accessorKey: 'newValue',
        cell: ({ row: { original } }) => {
          return <Typography variant='body1'>{original?.newValue}</Typography>
        }
      }
    ],
    []
  )

  const table = useReactTable({
    data: DATA,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <>
      <Table
        sx={{
          minWidth: 'max-content'
        }}
      >
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
    </>
  )
}

const ProjectActivityLogs = () => {
  const [filterMenu, setFilterMenu] = useState(null)

  const handleFilterMenuOpen = e => {
    setFilterMenu(e.currentTarget)
  }

  const handleFilterMenuClose = () => {
    setFilterMenu(null)
  }

  return (
    <Box px={4} sx={{ overflowY: 'auto' }}>
      <Grid container spacing={5}>
        {/* Filters */}
        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'} gap={1} sx={{ cursor: 'pointer' }} onClick={handleFilterMenuOpen}>
            <Typography>Filter Log</Typography>
            <Icon icon={'mdi:caret-down'} fontSize={18} />
          </Box>
          <Menu open={!!filterMenu} anchorEl={filterMenu} TransitionComponent={Zoom} onClose={handleFilterMenuClose}>
            <FilterMenuItem />
          </Menu>
        </Grid>
        {/* Table */}
        <Grid item xs={12}>
          <ActivityTable />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProjectActivityLogs
