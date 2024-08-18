// ** React Imports
import { fetchProjectList, fetchProjectPriorityList, fetchProjectStatusList } from '@api/project'
import { fetchWorkspaceList } from '@api/workspace'
import { createContext, useContext, useEffect, useState } from 'react'
import { useQueries, useQuery } from 'react-query'
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
  const { data, refetch } = useQuery(['workspaces', auth?.user?.UserID], fetchWorkspaceList, {
    enabled: Boolean(auth?.user)
  })

  // ** States
  const [activeWorkspace, setActiveWorkspace] = useState(null)

  const { data: projects, refetch: refetchProjects } = useQuery(
    ['projects', auth?.user?.UserID],
    () => activeWorkspace?.WorkspaceID && fetchProjectList(activeWorkspace?.WorkspaceID),
    {
      enabled: Boolean(activeWorkspace?.WorkspaceID && auth?.user),
      retry: false
    }
  )

  const [{ data: projectPriorityList }, { data: projectStatusList }] = useQueries([
    {
      queryKey: 'project-priority-list',
      queryFn: fetchProjectPriorityList,
      retry: false,
      enabled: Boolean(auth?.user)
    },
    { queryKey: 'project-status-list', queryFn: fetchProjectStatusList, retry: false, enabled: Boolean(auth?.user) }
  ])

  useEffect(() => {
    if (auth?.user) {
      refetch()
      refetchProjects()
    }
  }, [auth?.user, refetch, refetchProjects])

  useEffect(() => {
    if (activeWorkspace) {
      refetchProjects()
    }
  }, [activeWorkspace, refetchProjects])

  const values = {
    workspace: data ?? defaultProvider?.workspace,
    projects: projects ?? [],
    priorityList: projectPriorityList,
    statusList: projectStatusList,
    refetchProjects: refetchProjects,
    selected: activeWorkspace ?? null,
    setSelected: setActiveWorkspace,
    refetchWorkspaces: refetch
  }

  return <WorkspaceContext.Provider value={values}>{children}</WorkspaceContext.Provider>
}

export { WorkspaceContext, WorkspaceProvider }

export const useWorkspace = () => {
  const value = useContext(WorkspaceContext)
  if (value === undefined) throw new Error('Tried to use context without a provider')

  return value
}
