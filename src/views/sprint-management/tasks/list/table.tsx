import { useMemo, useState, useContext, useEffect } from 'react'

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

import { useQuery } from '@tanstack/react-query'

import type { ColumnDef } from '@tanstack/react-table'

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'

import { debounce } from 'lodash'
import axios from 'axios'

import CustomButton from '@/components/button'
import type { SprintItem } from '@/services/modules/sprint-item/types'
import { createSprintTasks, CREATESPRINTTASKS, updateSprintTask } from '@/services/modules/sprint-tasks'
import { ColumnTextField } from '@/views/project/task-group/task/columns/default-column'
import type { SprintTaskItem } from '@/services/modules/sprint-tasks/types'
import { SprintTaskManagement } from 'src/context/sprint-tast-context'
import { useAuth } from '@/hooks/useAuth'
import CreateColumnMenu from '../../tasks/components/create-column'
// Import dynamic column components
import DynamicTableHeader from '../columns/dynamic/header'
import SprintDynamicCell from '../columns/dynamic/cell'
import toast, { Toaster } from 'react-hot-toast'

// Define proper types for the taskgroup array
interface TaskGroup {
  id: string | number;
  name: string;
  sprintID?: string | number;
  taskGroupID?: string | number;
  [key: string]: any; // For other properties
}

interface SprintTaskGroupInfo {
  sprintID: string | number;
  groupname: string;
  [key: string]: any;
}

// Updated interface for the API response
interface SprintTaskInfoResponse {
  colList?: Array<{
    additionalColumnID: number;
    colname: string;
    typeID: number;
    dynamicColumnTypeInfo: string;
    lookups: {
      id: number;
      title: string;
      key: string;
    };
  }>;
  detailList?: Array<{
    taskID: number;
    taskname: string;
    description: string;
    ownername: string;
    ownerID: number;
    statusID: number;
    statusname: string;
    statusColorCode: string;
    actualSP: number;
    estimatedSP: number;
    isUnplanned: boolean;
    sprintID: number;
    taskGroupID?: number;
    dynamicColumnList: any | null;
  }>;
  colvalueList?: Array<{
    id: number;
    taskID: number;
    sprintID: number;
    additionalColumnID: number;
    value: string;
    [key: string]: any;
  }>;
}

// Add the API function directly in the component file
const fetchSprintTaskGroupInfo = async (workspaceID: string | number) => {
  const response = await fetch(`https://uat.ppmbackend.projectpulse360.com/GetSprintTaskGroupInfoList?WorkspaceID=${workspaceID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sprint task group info');
  }

  return response.json();
};

// New API function to fetch sprint task info
const fetchSprintTaskInfoList = async (taskGroupID: string | number) => {
  const response = await axios.get(`https://uat.ppmbackend.projectpulse360.com/GetSprintTaskInfoList?TaskGroupID=${taskGroupID}`);
  return response.data;
};

interface TaskTableSprintProps {
  enabled: boolean;
  sp: SprintItem;
  selectedTask?: { 
    id: string; 
    name: string; 
    sprintID: string; 
    Taskname: string; 
    SprintTaskID: string 
  } | null;
  taskgroup: TaskGroup[];
}

const TaskTableSprint = ({ 
  enabled, 
  sp, 
  selectedTask,
  taskgroup
}: TaskTableSprintProps) => {
  // ** States
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({})
  const [adding, setAdding] = useState(false)
  const [addColumnAnchor, setAddColumnAnchor] = useState<null | HTMLElement>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [sprintTaskInfoData, setSprintTaskInfoData] = useState<any>(null)
  const [sprintDynamicColumns, setSprintDynamicColumns] = useState<any[]>([])
  
  const { profile, user } = useAuth()
  
  // Get column visibility from sprint context
  const { columnVisibility: sprintColumnVisibility } = useContext(SprintTaskManagement)

  // Add this new query for fetching group info
  const sprintTaskGroupInfoApi = useQuery<SprintTaskGroupInfo[]>({
    queryKey: ['sprint-task-group-info', sp?.WorkspaceID],
    queryFn: () => fetchSprintTaskGroupInfo(sp?.WorkspaceID || 54),
    enabled: enabled && !!sp?.WorkspaceID
  })

  // Get groupname for the current sprint
  const currentSprintGroupInfo = useMemo(() => {
    const groupInfo = sprintTaskGroupInfoApi?.data || []
    return groupInfo.find((group: SprintTaskGroupInfo) => group.sprintID === sp?.SprintID)
  }, [sprintTaskGroupInfoApi?.data, sp?.SprintID])

  // Get taskgroup IDs from the taskgroup prop - DYNAMIC, NO HARDCODED VALUES
  const taskGroupIds = useMemo(() => {
    if (taskgroup && taskgroup.length > 0) {
      // Extract IDs from the taskgroup array
      const ids = taskgroup
        .map(item => {
          // Try to get taskGroupID first, then fallback to id
          const idValue = item.taskGroupID || item.id;
          // Convert to number if possible
          return idValue ? Number(idValue) : null;
        })
        .filter(id => id !== null && !isNaN(Number(id))); // Remove null/undefined/NaN values
      
      // Return the extracted IDs
      return ids;
    }
    
    // If no taskgroup data, return empty array
    return [];
  }, [taskgroup]);

  // Get the current taskGroupId based on the selected sprint
  const currentTaskGroupId = useMemo(() => {
    // Find the taskgroup that belongs to the current sprint
    const currentGroup = taskgroup.find(group => group.sprintID === sp?.SprintID);
    if (currentGroup) {
      const idValue = currentGroup.taskGroupID || currentGroup.id;
      return idValue ? Number(idValue) : null;
    }
    // Fallback to first ID if no match found
    return taskGroupIds.length > 0 ? taskGroupIds[0] : null;
  }, [taskgroup, sp?.SprintID, taskGroupIds]);

  // Only fetch if we have valid taskGroupIds
  const sprintTaskInfoApi = useQuery({
    queryKey: ['sprint-task-info', taskGroupIds.sort().join(','), sp?.SprintID, currentTaskGroupId],
    queryFn: async () => {
      if (!taskGroupIds.length) {
        return [];
      }
      
      // Fetch data for all taskGroupIds in parallel
      const promises = taskGroupIds.map(id => fetchSprintTaskInfoList(id));
      const results = await Promise.all(promises);
      
      // Find the response for the current taskGroupId
      if (results && results.length > 0) {
        // Find the index of current taskGroupId
        const currentIndex = taskGroupIds.findIndex(id => Number(id) === Number(currentTaskGroupId));
        
        if (currentIndex !== -1 && results[currentIndex]) {
          const currentResponse = results[currentIndex];
          // Process and store the response data for current group
          if (currentResponse && currentResponse.length > 0 && currentResponse[0]?.colList) {
            setSprintTaskInfoData(currentResponse[0]);
            if (currentResponse[0].colList && currentResponse[0].colList.length > 0) {
              setSprintDynamicColumns(currentResponse[0].colList);
            } else {
              setSprintDynamicColumns([]);
            }
          } else if (currentResponse && currentResponse.colList) {
            setSprintTaskInfoData(currentResponse);
            if (currentResponse.colList && currentResponse.colList.length > 0) {
              setSprintDynamicColumns(currentResponse.colList);
            } else {
              setSprintDynamicColumns([]);
            }
          }
        } else {
          // Fallback to first response if current not found
          for (const response of results) {
            if (response && response.length > 0 && response[0]?.colList) {
              setSprintTaskInfoData(response[0]);
              if (response[0].colList && response[0].colList.length > 0) {
                setSprintDynamicColumns(response[0].colList);
              } else {
                setSprintDynamicColumns([]);
              }
              break;
            } else if (response && response.colList) {
              setSprintTaskInfoData(response);
              if (response.colList && response.colList.length > 0) {
                setSprintDynamicColumns(response.colList);
              } else {
                setSprintDynamicColumns([]);
              }
              break;
            }
          }
        }
      }
      
      return results;
    },
    enabled: enabled && taskGroupIds.length > 0 && currentTaskGroupId !== null, // Only enable if we have IDs and current group
    retry: 2
  });

  // Helper function to get dynamic values from colvalueList
  const getDynamicValueForTask = (taskId: number | string, columnId: string) => {
    if (!sprintTaskInfoData?.colvalueList || !Array.isArray(sprintTaskInfoData.colvalueList)) {
      return null;
    }
    
    // Find the dynamic value for this task and column
    const dynamicValue = sprintTaskInfoData.colvalueList.find(
      (item: any) => 
        item?.taskID?.toString() === taskId?.toString() && 
        item?.additionalColumnID?.toString() === columnId?.toString()
    );
    
    return dynamicValue || null;
  };

  // Get the detailList from the response
  const getTaskDetailList = useMemo(() => {
    if (sprintTaskInfoData?.detailList && Array.isArray(sprintTaskInfoData.detailList)) {
      return sprintTaskInfoData.detailList;
    }
    return [];
  }, [sprintTaskInfoData]);

  // Transform the API response to match SprintTaskItem format correctly
  const transformedData = useMemo(() => {
    const detailList = getTaskDetailList;
    
    return detailList.map((task: any) => ({
      SprintTaskID: task.taskID ? String(task.taskID) : '',
      taskID: task.taskID,
      Taskname: task.taskname || '',
      Description: task.description || '',
      Ownername: task.ownername || '',
      OwnerID: task.ownerID || 0,
      StatusID: task.statusID || 0,
      Statusname: task.statusname || '',
      StatusColorCode: task.statusColorCode || '',
      ActualSP: typeof task.actualSP === 'number' ? task.actualSP : 0,
      EstimatedSP: typeof task.estimatedSP === 'number' ? task.estimatedSP : 0,
      IsUnplanned: Boolean(task.isUnplanned),
      SprintID: task.sprintID || sp?.SprintID || 0,
      sprintID: task.sprintID || sp?.SprintID || 0,
      taskGroupID: currentTaskGroupId, // Add taskGroupID to each task
      DynamicColumnList: task.dynamicColumnList || null,
      colvalueList: sprintTaskInfoData?.colvalueList || [] // Add colvalueList to each task item
    }));
  }, [getTaskDetailList, sp?.SprintID, sprintTaskInfoData, currentTaskGroupId]);

  // Filter data based on selected task
  const filteredData = useMemo(() => {
    const rawData = transformedData
    
    if (selectedTask && selectedTask.SprintTaskID) {
      return rawData.filter(task => task.SprintTaskID === selectedTask.SprintTaskID)
    }
    
    return rawData
  }, [transformedData, selectedTask])

  // Static columns definition
  const staticColumns: ColumnDef<any>[] = useMemo(
    () => [
      {
        id: 'select',
        accessorKey: 'select',
        size: 20,
        maxSize: 20,
        header: function SelectHeader({ table }) {
          return (
            <div className='flex justify-start ml-1 !w-20'>
              <Checkbox
                checked={table?.getIsAllRowsSelected?.() ?? false}
                indeterminate={table?.getIsSomeRowsSelected?.()}
                onChange={table?.getToggleAllRowsSelectedHandler?.()}
              />
            </div>
          )
        },
        cell: ({ row }) => (
          <div className='flex px-1 !w-20'>
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        )
      },
      {
        id: 'Taskname',
        accessorKey: 'Taskname',
        size: 200,
        maxSize: 1000,
        header: function TasknameHeader() {
          return (
            <Typography variant='body2' fontWeight={800}>
              Taskname
            </Typography>
          )
        },
        cell: ({ getValue, row: { index }, column: { id }, table }) => {
          const value = getValue() as string;
          return <ColumnTextField canEdit={true} getValue={() => value} index={index} id={id} table={table} />
        }
      },
      {
        id: 'groupname',
        accessorKey: 'groupname',
        header: function GroupNameHeader() {
          return (
            <Typography variant='body2' fontWeight={800}>
              Group Name
            </Typography>
          )
        },
        cell: () => {
          return <>{currentSprintGroupInfo?.groupname || '-'}</>
        }
      },
      {
        id: 'ActualSP',
        accessorKey: 'ActualSP',
        header: function ActualSPHeader() {
          return (
            <Typography variant='body2' fontWeight={800}>
              Actual SP
            </Typography>
          )
        },
        cell: ({ row: { original } }) => {
          return <>{original?.ActualSP || '-'}</>
        }
      },
      {
        id: 'IsUnplanned',
        accessorKey: 'IsUnplanned',
        header: function IsUnplannedHeader() {
          return (
            <Typography variant='body2' fontWeight={800}>
              Is Unplanned
            </Typography>
          )
        },
        cell: ({ row: { original } }) => {
          if (original?.IsUnplanned) return <i className='ri-check-line' />
          return <></>
        }
      },
      {
        id: 'EstimatedSP',
        accessorKey: 'EstimatedSP',
        header: function EstimatedSPHeader() {
          return (
            <Typography variant='body2' fontWeight={800}>
              Estimated SP
            </Typography>
          )
        },
        cell: ({ row: { original } }) => {
          return <>{original?.EstimatedSP || '-'}</>
        }
      }
    ],
    [currentSprintGroupInfo]
  );

  // Dynamic columns from colList with custom headers and dynamic cells
  const dynamicColumns = useMemo((): ColumnDef<any>[] => {
    if (!sprintDynamicColumns || sprintDynamicColumns.length === 0) return [];

    return sprintDynamicColumns.map((column, index) => {
      // Get the column ID - this should match what's in the context
      const columnId = column?.additionalColumnID?.toString() || 
                      column?.ColumnID?.toString() || 
                      `dynamic-${index}`;
      
      return {
        id: columnId,
        accessorKey: columnId, // Use columnId as accessorKey for dynamic columns
        accessorFn: (row) => {
          // Get the dynamic value for this task from colvalueList
          return getDynamicValueForTask(row?.SprintTaskID || row?.taskID, columnId);
        },
        minSize: 250,
        size: 250,
        sortable: false,
        header: () => {
          // Use DynamicTableHeader but pass the column data from colList
          return <DynamicTableHeader column={column} refetch={() => sprintTaskInfoApi.refetch()} />
        },
        cell: ({ getValue, row: { original, index }, column: { id }, table }) => {
          // Get the full dynamic value object
          const dynamicValue = getDynamicValueForTask(original?.SprintTaskID || original?.taskID, columnId);

          return (
            <SprintDynamicCell
              getValue={getValue}
              columnItem={column}
              index={index}
              row={original}
              id={id}
              table={table}
              value={dynamicValue} // Pass the full dynamic value object
              refetch={sprintTaskInfoApi.refetch}
            />
          );
        }
      }
    });
  }, [sprintDynamicColumns, sprintTaskInfoData, sprintTaskInfoApi.refetch]);

  // Combine static and dynamic columns
  const allColumns: ColumnDef<any>[] = useMemo(() => {
    return [...staticColumns, ...dynamicColumns]
  }, [staticColumns, dynamicColumns])

  // Filter columns based on visibility from sprint context
  const visibleColumns = useMemo(() => {
    return allColumns.filter(column => {
      const columnId = column.id as string;
      
      // Always show select column
      if (columnId === 'select') {
        return true;
      }
      
      // Check if this column exists in visibility
      const isVisible = sprintColumnVisibility[columnId];
      
      // If the column doesn't exist in visibility, default to showing it
      if (isVisible === undefined) {
        return true;
      }
      
      // Return the visibility value (should be true/false)
      return isVisible;
    });
  }, [allColumns, sprintColumnVisibility]);

  const table = useReactTable({
    data: filteredData,
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
      updateData: async (rowIndex: number, columnId: string, value: string | { AdditionalColumnID: string }) => {
        // Handle Taskname column update
        if (columnId === 'Taskname' && filteredData[rowIndex]?.SprintTaskID) {
          try {
            const response = await updateSprintTask({
              id: filteredData[rowIndex]?.SprintTaskID?.toString(),
              body: { Taskname: value }
            })

            if (response) {
              sprintTaskInfoApi?.refetch()
            }
          } catch (error) {
            console.error('error :', error)
          }
        }
        
        // Handle dynamic column updates
        if (typeof value === 'object' && value !== null && 'AdditionalColumnID' in value && filteredData[rowIndex]?.SprintTaskID) {
          try {
            // This is for dynamic column updates - you'll need to implement the API call
            // based on your backend structure
            console.log('Dynamic column update:', { rowIndex, columnId, value });
            
            // After update, refetch to get latest data
            sprintTaskInfoApi?.refetch();
          } catch (error) {
            console.error('error updating dynamic column:', error);
          }
        }
      }
    }
  })
  
  const handleAddSprint = async () => {
    setAdding(true)

    try {
      // Use the currentTaskGroupId for creating task
      if (!currentTaskGroupId) {
        console.error('No current task group ID available to create task');
        setAdding(false);
        return;
      }

      const baseUrl = 'https://uat.ppmbackend.projectpulse360.com/SprintTaskcreate'
      const params = new URLSearchParams({
        taskname: 'New Task',
        TaskGroupID: String(currentTaskGroupId), // Use the current task group ID
        LoginuserID: String(user?.id)
      })
      const apiUrl = `${baseUrl}?${params.toString()}`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
toast.success("Task Added Successfully")
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`)
      }

      const result = await response.json()
      
      // Refetch the task info list to show the new task
      sprintTaskInfoApi.refetch()
      
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setAdding(false)
    }
  }

  const debouncedHandleAddSprint = debounce(handleAddSprint, 500)

  // Force refetch when component mounts or enabled changes
  useEffect(() => {
    if (enabled && taskGroupIds.length > 0 && currentTaskGroupId) {
      sprintTaskInfoApi.refetch();
    }
  }, [enabled, taskGroupIds.join(','), currentTaskGroupId]);

  // Add loading state
  if (sprintTaskInfoApi?.isLoading || sprintTaskGroupInfoApi?.isLoading) {
    return (
      <div className='w-full flex justify-center'>
        <CircularProgress />
      </div>
    )
  }

  // Add error state
  if (sprintTaskInfoApi?.isError) {
    return <div>Error: {sprintTaskInfoApi.error?.message || 'Failed to load data'}</div>
  }

  return (
    <div className='px-3'>
      <div style={{ overflowX: 'auto', width: '100%' }}>
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
                <TableCell colSpan={visibleColumns?.length}>
                  <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={70} width={'100%'}>
                    <Typography>No Data Found</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex justify-between items-center gap-2 m-2'>
        <CustomButton
          variant='text'
          size='small'
          startIcon={<i className='ri-add-line' />}
          onClick={debouncedHandleAddSprint}
        >
          {adding ? 'Adding...' : 'Add Task'}
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
      <CreateColumnMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        onSubmit={(data) => {
          // After adding a new column, refetch to get updated colList
          sprintTaskInfoApi.refetch();
        }}
        spintid={sp?.WorkspaceID}
        groupid={currentTaskGroupId} // Use currentTaskGroupId instead of taskGroupIds[0]
      />
    </div>
  )
}

export default TaskTableSprint
