// ** React Imports
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import { useQuery } from '@tanstack/react-query'

import { fetchBugQueueList } from '@/services/modules/bug-queue'
import type { BugQueueListAPI } from '@/services/modules/bug-queue/types'

interface BugQueueContextType {
  data: BugQueueListAPI[]
  refetch: () => void
}

// ** Defaults
const defaultProvider: BugQueueContextType = {
  data: [],
  refetch: () => {}
}

const BugQueueContext = createContext<BugQueueContextType>(defaultProvider)

interface BugQueueProviderProps {
  children: ReactNode
  workspaceID: string
}

const BugQueueProvider = ({ children, workspaceID }: BugQueueProviderProps) => {
  const { data = [], refetch } = useQuery({
    queryKey: ['bug-list', workspaceID],
    queryFn: () => fetchBugQueueList(workspaceID),
    enabled: !!workspaceID
  })

  const values: BugQueueContextType = {
    data,
    refetch
  }

  return <BugQueueContext.Provider value={values}>{children}</BugQueueContext.Provider>
}

export { BugQueueContext, BugQueueProvider }

export const useBugQueue = () => {
  const value = useContext(BugQueueContext)

  if (!value) throw new Error('Tried to use context without a provider')

  return value
}
