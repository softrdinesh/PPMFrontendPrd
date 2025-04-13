'use client'

import { useEffect } from 'react'

import { useWorkspace } from '@/context/workspace-context'

const SprintManagementPage = ({ workspaceID }: { workspaceID: string }) => {
  const { selected, setSelected, workspace } = useWorkspace()

  useEffect(() => {
    if (workspaceID && !selected) {
      const activeData = workspace?.find(value => value?.WorkspaceID?.toString() === workspaceID)

      if (activeData) setSelected(activeData)
    }
  }, [selected, setSelected, workspace, workspaceID])

  return <>!!! UNDER DEVELOPMENT !!! {workspaceID}</>
}

export default SprintManagementPage
