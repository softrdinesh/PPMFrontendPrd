'use client'

import { useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import Grid from '@mui/material/Grid2'

import { Divider, TextField } from '@mui/material'

import { Icon } from '@iconify/react'

import CustomButton from '@/components/button'
import FallbackSpinner from '@/components/spinner'
import { ProjectProvider } from '@/context/project-context'
import { useWorkspace } from '@/context/workspace-context'
import { viewProject } from '@/services/modules/project'
import { fetchTaskGroupList } from '@/services/modules/task-group'
import ProjectInvitePeople from './main-screen/invite-people'
import NewTask from './main-screen/new-task-group-button'
import ProjectTitle from './main-screen/project-title'
import { projectMembers } from '@/services/modules/invite'
import TaskGroupList from './task-group'
import ProjectFilterButton from './main-screen/filters'

const ProjectManagementPage = ({ projectID }: { projectID: string }) => {
  // ** Hooks
  const router = useRouter()

  const { selected, setSelected, workspace } = useWorkspace()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['project-view', projectID],
    queryFn: () =>
      viewProject(projectID).then(res => {
        if (res?.statusCode === 403) {
          router.replace('/401')

          return undefined
        } else {
          return res?.data
        }
      })
  })

  const { data: users } = useQuery({
    queryKey: ['members-list', projectID],
    queryFn: () => projectMembers(projectID),
    enabled: !!projectID
  })

  const role = useMemo(() => data?.userProjects?.Role, [data?.userProjects?.Role])

  const {
    data: taskGroups,
    isLoading: taskLoading,
    refetch: refetchTaskGroup
  } = useQuery({
    queryKey: ['task-group', projectID],
    queryFn: () => fetchTaskGroupList(projectID),
    retry: false
  })

  useEffect(() => {
    if (data && projectID && !selected) {
      const activeData = workspace?.find(value => value?.WorkspaceID === data?.WorkSpaceID)

      if (activeData) setSelected(activeData)
    }
  }, [data, projectID, selected, setSelected, workspace])

  if (isLoading) return <FallbackSpinner height={'80vh'} />

  if (data)
    return (
      <ProjectProvider
        project={data ?? null}
        refetchProject={refetch}
        taskGroups={taskGroups}
        users={users ?? []}
        role={role ?? null}
        refetchTaskGroup={refetchTaskGroup}
      >
        <Grid container spacing={6}>
          <Grid size={12}>
            <div className='flex items-center justify-between'>
              {/* Project Title */}
              <ProjectTitle data={data} refetch={refetch} role={role} />
            </div>
          </Grid>
          <Grid size={12}>
            <div className='flex items-center justify-between gap-5 flex-wrap-reverse'>
              {/* Search  */}
              <div className='flex-1 min-w-[300px]'>
                <TextField
                  fullWidth
                  size='small'
                  placeholder='Search ID, task, Project, Keywords...'
                  InputProps={{
                    startAdornment: <Icon icon={'ion:search'} style={{ marginRight: 10 }} fontSize={24} />
                  }}
                />
              </div>

              {/* Buttons */}
              <div className='flex items-center gap-5 flex-wrap justify-center'>
                {role?.RoleName === 'Admin' && <NewTask />}
                <ProjectInvitePeople IsOpen={data?.IsOpen} users={users} />
                <Divider
                  orientation='vertical'
                  sx={{ borderColor: 'primary.main', height: 25, borderRightWidth: 1.5 }}
                />
                <div className='flex items-center gap-3'>
                  <CustomButton variant='contained' sx={{ px: 2, minWidth: 'auto' }}>
                    <Icon icon={'fluent:pause-24-filled'} rotate={90} fontSize={20} />
                  </CustomButton>
                  <CustomButton variant='text' sx={{ px: 2, minWidth: 'auto' }}>
                    <Icon icon={'hugeicons:menu-circle'} rotate={90} fontSize={20} />
                  </CustomButton>
                </div>

                {/* Filter Button */}
                <ProjectFilterButton />

                <CustomButton
                  variant='outlined'
                  startIcon={<Icon icon={'solar:calendar-date-outline'} style={{ marginInline: 2 }} />}
                  endIcon={<Icon icon={'akar-icons:chevron-down'} style={{ marginInline: 5 }} />}
                  sx={{ px: 3.5 }}
                >
                  Today
                </CustomButton>
              </div>
            </div>
          </Grid>
          <Grid size={12}>
            <TaskGroupList isLoading={taskLoading} />
          </Grid>
        </Grid>
      </ProjectProvider>
    )
}

export default ProjectManagementPage
