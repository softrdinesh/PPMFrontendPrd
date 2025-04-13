// ** React Imports
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

interface BugQueueContextType {}

// ** Defaults
const defaultProvider: BugQueueContextType = {}

const BugQueueContext = createContext<BugQueueContextType>(defaultProvider)

interface BugQueueProviderProps {
  children: ReactNode
}

const BugQueueProvider = ({ children }: BugQueueProviderProps) => {
  const values: BugQueueContextType = {}

  return <BugQueueContext.Provider value={values}>{children}</BugQueueContext.Provider>
}

export { BugQueueContext, BugQueueProvider }

export const useBugQueue = () => {
  const value = useContext(BugQueueContext)

  if (!value) throw new Error('Tried to use context without a provider')

  return value
}
