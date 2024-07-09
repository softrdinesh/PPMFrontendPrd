// ** React Imports
import { fetchProjectList } from '@api/project'
import { fetchWorkspaceList } from '@api/workspace'
import { createContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useAuth } from 'src/hooks/useAuth'

// ** Defaults
const defaultProvider = {
  workspace: [],
  activeWorkspace: null
}
const WorkspaceContext = createContext(defaultProvider)

const WorkspaceProvider = ({ children }) => {
  // ** Auth Imports
  const auth = useAuth()

  // ** API calls
  const { data, refetch } = useQuery('workspaces', fetchWorkspaceList, { enabled: Boolean(auth?.user) })

  const { data: projects, refetch: refetchProjects } = useQuery('projects', fetchProjectList, {
    enabled: Boolean(auth?.user)
  })

  // ** States
  const [activeWorkspace, setActiveWorkspace] = useState(null)

  useEffect(() => {
    if (auth?.user) {
      refetch()
      refetchProjects()
    }
  }, [auth?.user, refetch, refetchProjects])

  const values = {
    workspace: data ?? defaultProvider?.workspace,
    projects: projects ?? [],
    refetchProjects: refetchProjects,
    selected: activeWorkspace ?? null,
    setSelected: setActiveWorkspace,
    refetchWorkspaces: refetch
  }

  return <WorkspaceContext.Provider value={values}>{children}</WorkspaceContext.Provider>
}

export { WorkspaceContext, WorkspaceProvider }
