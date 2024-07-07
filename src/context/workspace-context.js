// ** React Imports
import { fetchWorkspaceList } from '@api/workspace'
import { createContext } from 'react'
import { useQuery } from 'react-query'

// ** Defaults
const defaultProvider = {
  workspace: []
}
const WorkspaceContext = createContext(defaultProvider)

const WorkspaceProvider = ({ children }) => {
  // ** API calls
  const { data } = useQuery('workspaces', fetchWorkspaceList)

  const values = {
    workspace: data ?? []
  }

  return <WorkspaceContext.Provider value={values}>{children}</WorkspaceContext.Provider>
}

export { WorkspaceContext, WorkspaceProvider }
