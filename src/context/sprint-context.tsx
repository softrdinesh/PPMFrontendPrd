// ** React Imports
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import { useQuery } from '@tanstack/react-query'

import { fetchSprintGroups } from '@/services/modules/sprint-group'
import type { SprintGroupItem } from '@/services/modules/sprint-group/type'

interface SprintManagementType {
  data: SprintGroupItem[]
  refetch: () => void
}

// ** Defaults
const defaultProvider: SprintManagementType = {
  data: [],
  refetch: () => {}
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

  const values: SprintManagementType = {
    data,
    refetch
  }

  return <SprintManagement.Provider value={values}>{children}</SprintManagement.Provider>
}

export { SprintManagement, SprintManagementProvider }

export const useSprintManagement = () => {
  const value = useContext(SprintManagement)

  if (!value) throw new Error('Tried to use context without a provider')

  return value
}
