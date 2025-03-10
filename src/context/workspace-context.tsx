// ** React Imports
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import { useQueries, useQuery } from '@tanstack/react-query'

import { fetchProjectList } from '@/services/modules/project'
import { fetchWorkspaceList } from '@/services/modules/workspace'

import type { WorkspaceListItem } from '@/services/modules/workspace/type'
import { useAuth } from 'src/hooks/useAuth'
import type { ProjectListItem } from '@/services/modules/project/types'
import { fetchProjectPriorityList } from '@/services/modules/project-priority'
import type { ProjectPriorityList } from '@/services/modules/project-priority/types'
import { fetchProjectStatusList } from '@/services/modules/project-status'
import type { ProjectStatusList } from '@/services/modules/project-status/types'

interface WorkspaceContextType {
  workspace: WorkspaceListItem[]
  projects: ProjectListItem[]
  priorityList: ProjectPriorityList[]
  statusList: ProjectStatusList[]
  refetchProjects: () => void
  selected: WorkspaceListItem | null
  setSelected: (workspace: any | null) => void
  refetchWorkspaces: () => void
}

const defaultProvider: WorkspaceContextType = {
  workspace: [],
  projects: [],
  priorityList: [],
  statusList: [],
  refetchProjects: () => {},
  selected: null,
  setSelected: () => {},
  refetchWorkspaces: () => {}
}

const WorkspaceContext = createContext<WorkspaceContextType>(defaultProvider)

interface WorkspaceProviderProps {
  children: ReactNode
}

const WorkspaceProvider: FC<WorkspaceProviderProps> = ({ children }) => {
  // ** Auth Imports
  const auth = useAuth()

  // ** API calls
  const { data, refetch } = useQuery({
    queryKey: ['workspaces', auth?.user?.userData?.UserID],
    queryFn: () => fetchWorkspaceList(),
    enabled: !!auth?.user
  })

  // ** States
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceListItem | null>(null)

  const { data: projects, refetch: refetchProjects } = useQuery({
    queryKey: ['projects', auth?.user?.userData?.UserID],
    queryFn: () =>
      activeWorkspace?.WorkspaceID ? fetchProjectList(activeWorkspace?.WorkspaceID?.toString() || '') : [],
    enabled: !!activeWorkspace?.WorkspaceID
  })

  const [{ data: projectPriorityList }, { data: projectStatusList }] = useQueries({
    queries: [
      {
        queryKey: ['project-priority-list', auth?.user],
        queryFn: () => fetchProjectPriorityList({}),
        retry: false,
        enabled: !!auth?.user
      },
      {
        queryKey: ['project-status-list'],
        queryFn: () => fetchProjectStatusList({}),
        retry: false,
        enabled: Boolean(auth?.user)
      }
    ]
  })

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
  }, [activeWorkspace, data, refetchProjects])

  const values = {
    workspace: data ?? defaultProvider?.workspace,
    projects: projects ?? [],
    priorityList: projectPriorityList ?? [],
    statusList: projectStatusList ?? [],

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
