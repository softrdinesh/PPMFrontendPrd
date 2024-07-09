// ** React Imports
import { fetchProjectList } from '@api/project'
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
  const { data } = useQuery('workspaces', fetchWorkspaceList)
  const { data: projects, refetch: refetchProjects } = useQuery('projects', fetchProjectList)

  // ** States
  const [activeWorkspace, setActiveWorkspace] = useState(null)

  const values = {
    workspace: data ?? defaultProvider?.workspace,
    projects: projects ?? [],
    refetchProjects: refetchProjects,
    selected: activeWorkspace ?? null,
    setSelected: setActiveWorkspace
  }

  return <WorkspaceContext.Provider value={values}>{children}</WorkspaceContext.Provider>
}

export { WorkspaceContext, WorkspaceProvider }
