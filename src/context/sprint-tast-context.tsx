// ** React Imports
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import { useQuery } from '@tanstack/react-query'

import { fetchSprintListBasic } from '@/services/modules/sprint-item'
import type { SprintItem } from '@/services/modules/sprint-item/types'

interface SprintTaskManagementType {
  data: SprintItem[]
  refetch: () => void
}

// ** Defaults
const defaultProvider: SprintTaskManagementType = {
  data: [],
  refetch: () => {}
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

  const values: SprintTaskManagementType = {
    data,
    refetch
  }

  return <SprintTaskManagement.Provider value={values}>{children}</SprintTaskManagement.Provider>
}

export { SprintTaskManagement, SprintTaskManagementProvider }

export const useSprintTaskManagement = () => {
  const value = useContext(SprintTaskManagement)

  if (!value) throw new Error('Tried to use context without a provider')

  return value
}
