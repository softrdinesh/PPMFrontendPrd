import { useMemo, useState,useCallback, useContext, useEffect } from 'react'

import {
  Box,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'

import type { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'

import { debounce } from 'lodash'
import { useAuth } from '@/hooks/useAuth'

import CustomButton from '@/components/button'
import type { SprintGroupItem } from '@/services/modules/sprint-group/type'
import { createSprint, fetchSprintList, updateSprint,createSprintItems,UpdateSrpintItem } from '@/services/modules/sprint-item'
import type { SprintItem } from '@/services/modules/sprint-item/types'
import SprintTimelineManagement from './timeline'
import { ColumnTextField } from '@/views/project/task-group/task/columns/default-column'
import { GoalsTextfiled } from '@/views/project/task-group/task/columns/GoalsDefaultcolum'
import { SprintManagement } from 'src/context/sprint-context'
import DeleteTasksComponent from '../../components/Delete-sprint'
import CreateColumnMenu from '@/views/sprint-management/tasks/create-column'
import { useProject } from '@/context/project-context'
import DynamicTableHeader from '../../columns/dynamic/header'


const SprintList = ({ 
  sg, 
  selectedSprint, 
  sprintSearchTerm 
}: { 
  sg: SprintGroupItem;
  selectedSprint?: any;
  sprintSearchTerm?: string;
}) => {
// ** States
  const [selectedRows, setSelectedRows] = useState<any>({})
  const [adding, setAdding] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [selectedSprint1, setSelectedSprint1] = useState<any>(null)
  const [addColumnAnchor, setAddColumnAnchor] = useState<any>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [sprintDynamicColumns, setSprintDynamicColumns] = useState<any[]>([])
  
  const { role, users } = useProject()

  const showSelected = useMemo(() => Object?.keys(selectedRows)?.length !== 0, [selectedRows])
  const { profile,user } = useAuth()
  const canEdit = useMemo(() => role?.RoleName === 'Admin' || role?.RoleName === 'Member', [role?.RoleName])

  // Get column visibility from sprint context
  const { columnVisibility: sprintColumnVisibility } = useContext(SprintManagement)

  const sprintListApi = useQuery({
    queryKey: ['sprint-list', sg?.SprintGroupID],
    queryFn: () => fetchSprintList({ SprintGroupID: sg?.SprintGroupID })
  })

  const { data: sprintListData = [], refetch: refetchSprints } = useQuery({
    queryKey: ['sprint-list',  sg?.SprintGroupID],
    queryFn: () => fetchSprintList({SprintGroupID:  sg?.SprintGroupID}),
    enabled: !! sg?.SprintGroupID
  })

  useEffect(() => {
    if (showSelected) {
      setShowCard(true)
    } else {
      const timeout = setTimeout(() => setShowCard(false), 200)
      return () => clearTimeout(timeout)
    }
  }, [showSelected])
 
  useEffect(() => {
    if (sg?.WorkspaceID && user?.id) {
      getSprintDynamicColumns()
    }
  }, [sg?.WorkspaceID, user?.id])

  const getSprintDynamicColumns = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL1;

    try {
      const response = await axios.get(
        `${BASE_URL}/GetSprintDynamiccolumnLlist`,
        {
          params: {
            WorkspaceID: sg?.WorkspaceID,
            LoginuserID: user?.id
          }
        }
      );
      
      setSprintDynamicColumns(response.data?.data || response.data || []);
      return response.data;

    } catch (error) {
      console.error('Error fetching sprint dynamic columns:', error);
      setSprintDynamicColumns([]);
      throw error;
    }
  };

  // Helper function to filter dynamic values
  const filterDynamicValue = (columnId: string, additionalValues: any[]) => {
    return additionalValues?.find(val => val?.AdditionalColumnID?.toString() === columnId?.toString())
  }

  // Dynamic columns with custom headers only
  const dynamicColumns = useMemo((): ColumnDef<SprintItem>[] => {
    if (!sprintDynamicColumns || sprintDynamicColumns.length === 0) return []

    return sprintDynamicColumns.map((column, index) => {
      const columnId = column?.AdditionalColumnID || column?.ColumnID || `dynamic-${index}`
      return {
        id: columnId?.toString(),
        accessorFn: row =>
          filterDynamicValue(columnId, row?.additionalValues ?? [])?.DynamicColumnValues,
        minSize: 250,
        size: 250,
        sortable: false,
        header: () => {
          return <DynamicTableHeader column={column} refetch={getSprintDynamicColumns} />
        },
        cell: ({ getValue }) => {
          const value = getValue()
          return <Typography variant='body2'>{value || '-'}</Typography>
        }
      }
    })
  }, [sprintDynamicColumns])

  // Filter sprint data based on selected sprint and search term
  const filteredSprintData = useMemo(() => {
    const originalData = sprintListApi?.data?.data ?? []
    
    if (!selectedSprint && !sprintSearchTerm?.trim()) {
      return originalData
    }
    
    return originalData.filter((sprint: SprintItem) => {
      if (selectedSprint) {
        return sprint.SprintID === selectedSprint.SprintID
      }
      
      if (sprintSearchTerm?.trim()) {
        const searchLower = sprintSearchTerm.toLowerCase()
        return (
          sprint?.Name?.toLowerCase().includes(searchLower) ||
          sprint?.SprintID?.toString().toLowerCase().includes(searchLower) ||
          sprint?.Goals?.toLowerCase().includes(searchLower)
        )
      }
      
      return true
    })
  }, [sprintListApi?.data?.data, selectedSprint, sprintSearchTerm])

  // Define static columns
  const staticColumns: ColumnDef<SprintItem>[] = useMemo(
    () => [
      {
        id: 'select',
        accessorKey: 'select',
        size: 20,
        maxSize: 20,
        header: ({ table }) => {
          return (
            <div className='flex justify-start ml-1 !w-20'>
              <Checkbox
                checked={!!table?.getIsAllRowsSelected?.()}
                indeterminate={!!table?.getIsSomeRowsSelected?.()}
                onChange={table?.getToggleAllRowsSelectedHandler?.()}
              />
            </div>
          )
        },
        cell: ({ row }) => (
          <div className='flex px-1 !w-20'>
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          </div>
        )
      },
      {
        accessorKey: 'Name',
        size: 200,
        maxSize: 1000,
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Sprint
          </Typography>
        ),
        cell: ({ getValue, row: { index }, column: { id }, table }) => {
          return <ColumnTextField canEdit={true} getValue={getValue} index={index} id={id} table={table} />
        }
      },
      {
        accessorKey: 'Goals',
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Goals
          </Typography>
        ),
        cell: ({ getValue, row: { index }, column: { id }, table }) => {
          return <GoalsTextfiled canEdit={true} getValue={getValue} index={index} id={id} table={table} />
        }
      },
      {
        accessorKey: 'ActiveSprint',
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Active Sprint
          </Typography>
        ),
        cell: ({ row: { original } }) => {
          if (original?.SprintStatus === 'Active') return <i className='ri-check-line' />
          return <></>
        }
      },
      {
        accessorKey: 'SprintTimeline',
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Sprint Timeline
          </Typography>
        ),
        cell: ({ row: { original } }) => (
          <SprintTimelineManagement original={original} refetch={sprintListApi?.refetch} />
        )
      },
      {
        accessorKey: 'Completed',
        header: () => (
          <Typography variant='body2' fontWeight={800}>
            Completed 
          </Typography>
        ),
        cell: ({ row: { original } }) => {
          if (original?.SprintStatus === 'Completed') return <i className='ri-check-line' />
          return <></>
        }
      }
    ],
    [sprintListApi?.refetch]
  )

  // Combine static and dynamic columns
  const allColumns: ColumnDef<SprintItem>[] = useMemo(() => {
    return [...staticColumns, ...dynamicColumns]
  }, [staticColumns, dynamicColumns])

  // Filter columns based on visibility from sprint context
  const visibleColumns = useMemo(() => {
    const columnVisibilityMap: Record<string, string> = {
      'Name': 'Name',
      'Goals': 'Goals',
      'SprintTimeline': 'SprintTimeline',
      'ActiveSprint': 'ActiveSprint',
      'Completed': 'SprintStatus'
    }

    return allColumns.filter(column => {
      const accessorKey = column.accessorKey as string
      
      if (accessorKey === 'select') return true
      
      const contextKey = columnVisibilityMap[accessorKey]
      
      if (!contextKey) return true
      
      return sprintColumnVisibility[contextKey] !== false
    })
  }, [allColumns, sprintColumnVisibility])

  const table = useReactTable({
    data: filteredSprintData as SprintItem[],
    columns: visibleColumns,
    initialState: { columnPinning: { left: ['select', 'Taskname'], right: ['add-column'] } },
    state: {
      rowSelection: selectedRows
    },
    getRowCanExpand: () => true,
    enableRowSelection: true,
    onRowSelectionChange: setSelectedRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: {
      updateData: async (rowIndex: number, columnId: any, value: { AdditionalColumnID: string }) => {
        if (columnId === 'Name' && filteredSprintData?.[rowIndex]?.SprintID) {
          try {
            const formattedData = filteredSprintData.map(item => ({
              ...item,
              formattedSprintTimelineStart: moment(item.SprintTimelineStart).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
              formattedSprintTimelineEnd: moment(item.SprintTimelineEnd).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            }));
            
            const value1 = localStorage.getItem('userData')
            const data1 = JSON.parse(value1);
            const userId = data1.userData.UserID;

            const bodyvalue = {
              Sprintname:value,
              Goals:formattedData[0].Goals ?? "-",
              LoginuserID:userId,
              SprintgroupID:formattedData[0].SprintGroupID,
              WorkspaceID:formattedData[0].WorkSpaceID,
              sprintID:filteredSprintData?.[rowIndex]?.SprintID?.toString()
            }

            const response = await UpdateSrpintItem(bodyvalue)
            if (response) {
              sprintListApi?.refetch()
            }
          } catch (error) {
            console.error('error :', error)
          }
        }

        if (columnId === 'Goals' && filteredSprintData?.[rowIndex]?.SprintID) {
          try {
            const value1 = localStorage.getItem('userData')
            const data = JSON.parse(value1);
            const userId = data.userData.UserID;

            const formattedData = filteredSprintData.map(item => ({
              ...item,
              formattedSprintTimelineStart: moment(item.SprintTimelineStart).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
              formattedSprintTimelineEnd: moment(item.SprintTimelineEnd).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            }));

            const bodyvalue = {
              Sprintname: filteredSprintData?.[rowIndex]?.Name || "New Sprint",
              Goals: value || "New Goal",
              LoginuserID: userId,
              SprintgroupID: filteredSprintData?.[rowIndex]?.SprintGroupID,
              WorkspaceID: filteredSprintData?.[rowIndex]?.WorkSpaceID,
              sprintID: filteredSprintData?.[rowIndex]?.SprintID?.toString()
            }

            const response = await UpdateSrpintItem(bodyvalue)
            if (response) {
              sprintListApi?.refetch()
            }
          } catch (error) {
            console.error('error :', error)
          }
        }
      }
    }
  })

  const handleAddSprint = async () => {
    setAdding(true)

    const body={
      Sprintname: "New Sprint",
      LoginuserID: user?.id,
      SprintgroupID:sg?.SprintGroupID,
      WorkspaceID:sg?.WorkspaceID
    }
    await createSprintItems(body)
    sprintListApi.refetch()

    setAdding(false)
  }

  const debouncedHandleAddSprint = debounce(handleAddSprint, 500)

  if (sprintListApi?.isLoading)
    return (
      <div className='w-full flex justify-center'>
        <CircularProgress />
      </div>
    )

  if (sprintListApi?.isError) return <div>Error</div>

  return (
    <div className='px-3'>
      <Table
        sx={{
          minWidth: 'max-content'
        }}
      >
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableCell
                  key={header.id}
                  colSpan={header.colSpan}
                  sx={{ fontWeight: 600, pb: 1, height: 67.5, textTransform: 'uppercase' }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => {
              const isSelectedSprint = selectedSprint && row.original.SprintID === selectedSprint.SprintID
              
              return (
                <TableRow 
                  key={row.id}
                  sx={isSelectedSprint ? { 
                    backgroundColor: 'none',
                    '& td': { }
                  } : {}}
                >
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
              <TableCell colSpan={visibleColumns?.length}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={70} width={'100%'}>
                  <Typography>
                    {selectedSprint || sprintSearchTerm ? 'No matching sprints found' : 'No Data Found'}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='flex justify-between items-center gap-2 m-2'>
        <CustomButton
          variant='text'
          size='small'
          endIcon={<i className='ri-add-line' />}
          onClick={debouncedHandleAddSprint}
        >
          {adding ? 'Adding...' : 'Add Sprint'}
        </CustomButton>
         
        <CustomButton
          variant='outlined'
          circular
          size='small'
          color='secondary'
          startIcon={<i className='ri-add-line' />}
          onClick={e => {
            setAnchorEl(e?.currentTarget)
          }}
        >
          Add New Column
        </CustomButton>
      </div>
      {showCard &&
        <DeleteTasksComponent
          showCard={showCard}
          selectedRows={selectedRows}
          sprintlist={sprintListApi.data?.data}
          refetch={refetchSprints}
          setSelectedRows={setSelectedRows}
        />}

      <CreateColumnMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        onSubmit={(data) => {
          getSprintDynamicColumns()
        }}
        spintid={sg.WorkspaceID}
      />

    </div>
  )
}

export default SprintList
