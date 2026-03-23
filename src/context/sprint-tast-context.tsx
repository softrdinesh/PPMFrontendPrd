// ** React Imports
import type { ReactNode } from 'react'
import { createContext, useContext, useState, useCallback } from 'react'

import { useQuery } from '@tanstack/react-query'

import { fetchSprintListBasic } from '@/services/modules/sprint-item'
import type { SprintItem } from '@/services/modules/sprint-item/types'
import type { SprintTaskItem } from '@/services/modules/sprint-tasks/types'

type ColumnVisibility = {
  Taskname: boolean
  ActualSP: boolean
  IsUnplanned: boolean
  EstimatedSP: boolean
  [key: string]: boolean
}

interface SprintTaskManagementType {
  data: SprintItem[]
  refetch: () => void
  columnVisibility: ColumnVisibility
  setColumnVisibility: (visibility: ColumnVisibility) => void
  toggleColumnVisibility: (columnKey: keyof ColumnVisibility) => void
  visibleColumns: string[]
}

// ** Defaults
const defaultColumnVisibility: ColumnVisibility = {
  Taskname: true,
  ActualSP: true,
  Description:true,
  Owner:true,
  IsUnplanned: true,
  EstimatedSP: true
}

const defaultProvider: SprintTaskManagementType = {
  data: [],
  refetch: () => {},
  columnVisibility: defaultColumnVisibility,
  setColumnVisibility: () => {},
  toggleColumnVisibility: () => {},
  visibleColumns: Object.keys(defaultColumnVisibility).filter(key => defaultColumnVisibility[key])
}

const SprintTaskManagement = createContext<SprintTaskManagementType>(defaultProvider)

interface SprintTaskManagementProviderProps {
  children: ReactNode
  workspaceID: string
}

const SprintTaskManagementProvider = ({ children, workspaceID }: SprintTaskManagementProviderProps) => {
  const { data = [], refetch } = useQuery({
    queryKey: ['sprint-list-basic', workspaceID],
    queryFn: () => fetchSprintListBasic(workspaceID),
    enabled: !!workspaceID
  })

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(defaultColumnVisibility)

  // Toggle visibility for a specific column
  const toggleColumnVisibility = useCallback((columnKey: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }))
  }, [])

  // Get array of visible column keys
  const visibleColumns = Object.keys(columnVisibility).filter(key => columnVisibility[key])

  const values: SprintTaskManagementType = {
    data,
    refetch,
    columnVisibility,
    setColumnVisibility,
    toggleColumnVisibility,
    visibleColumns
  }

  return <SprintTaskManagement.Provider value={values}>{children}</SprintTaskManagement.Provider>
}

export { SprintTaskManagement, SprintTaskManagementProvider }

export const useSprintTaskManagement = () => {
  const value = useContext(SprintTaskManagement)

  if (!value) throw new Error('Tried to use context without a provider')

  return value
}
