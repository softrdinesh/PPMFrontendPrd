// ** React Imports
import { fetchWorkspaceList } from '@api/workspace'
import { createContext, useState } from 'react'
import { useQuery } from 'react-query'

// ** Defaults
const defaultProvider = {
  workspace: [],
  activeWorkspace: null
}
const WorkspaceContext = createContext(defaultProvider)

const WorkspaceProvider = ({ children }) => {
  // ** API calls
  const { data, refetch } = useQuery('workspaces', fetchWorkspaceList)

  // ** States
  const [activeWorkspace, setActiveWorkspace] = useState(null)

  const values = {
    workspace: data ?? defaultProvider?.workspace,
    selected: activeWorkspace ?? null,
    setSelected: setActiveWorkspace,
    refetchWorkspaces: refetch
  }

  return <WorkspaceContext.Provider value={values}>{children}</WorkspaceContext.Provider>
}

export { WorkspaceContext, WorkspaceProvider }
