// ** React Imports
import type { ReactNode } from 'react'
import { createContext, useContext, useState, useCallback } from 'react'

import { useQuery } from '@tanstack/react-query'

import { fetchSprintGroups } from '@/services/modules/sprint-group'
import type { SprintGroupItem } from '@/services/modules/sprint-group/type'



type ColumnVisibility = {
  Name:boolean
  Goals: boolean
  SprintTimeline: boolean
  SprintStatus: boolean
  ActiveSprint: boolean
  [key: string]: boolean
}





interface SprintManagementType {
  data: SprintGroupItem[]
  refetch: () => void
   columnVisibility: ColumnVisibility
  setColumnVisibility: (visibility: ColumnVisibility) => void
  toggleColumnVisibility: (columnKey: keyof ColumnVisibility) => void
  visibleColumns: string[]
}

const defaultColumnVisibility: ColumnVisibility = {
  Name:true,
  Owner:true,
  Goals: true,

  SprintTimeline: true,
  SprintStatus: true,
  ActiveSprint:true

}




// ** Defaults
const defaultProvider: SprintManagementType = {
  data: [],
  refetch: () => {},
  columnVisibility: defaultColumnVisibility,
  setColumnVisibility: () => {},
  toggleColumnVisibility: () => {},
  visibleColumns: Object.keys(defaultColumnVisibility).filter(key => defaultColumnVisibility[key])
}

const SprintManagement = createContext<SprintManagementType>(defaultProvider)

interface SprintManagementProviderProps {
  children: ReactNode
  workspaceID: string
}

const SprintManagementProvider = ({ children, workspaceID }: SprintManagementProviderProps) => {
  const { data = [], refetch } = useQuery({
    queryKey: ['sprint-groups', workspaceID],
    queryFn: () => fetchSprintGroups(workspaceID),
    enabled: !!workspaceID
  })

    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(defaultColumnVisibility)
    const toggleColumnVisibility = useCallback((columnKey: keyof ColumnVisibility) => {
      setColumnVisibility(prev => ({
        ...prev,
        [columnKey]: !prev[columnKey]
      }))
    }, [])
    const visibleColumns = Object.keys(columnVisibility).filter(key => columnVisibility[key])

  const values: SprintManagementType = {
    data,
refetch,
    columnVisibility,
    setColumnVisibility,
    toggleColumnVisibility,
    visibleColumns  }

  return <SprintManagement.Provider value={values}>{children}</SprintManagement.Provider>
}

export { SprintManagement, SprintManagementProvider }

export const useSprintManagement = () => {
  const value = useContext(SprintManagement)

  if (!value) throw new Error('Tried to use context without a provider')

  return value
}
