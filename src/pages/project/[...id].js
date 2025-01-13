// ** React Imports
import React, { useContext, useEffect, useMemo } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

// ** Custom Imports
import CustomButton from '@components/button'
import FallbackSpinner from '@components/spinner'
import { Icon } from '@iconify/react'
import useWebSocket from 'src/hooks/useWebSocket'

// ** API Imports
import { projectMembers, viewProject } from '@api/project'
import { fetchTaskGroupList } from '@api/task-group'
import ProjectTitle from '@custom-components/project/title'
import TaskGroupList from '@custom-components/task-group/list'
import NewTask from '@custom-components/task-group/new-task'
import { useQuery } from 'react-query'
import { WorkspaceContext } from 'src/context/workspace-context'
import ProjectInvitePeople from '@custom-components/project/project-invite'
import { ProjectProvider } from 'src/context/project-context'
import ProjectFilterButton from '@custom-components/project/project-filter'

function ProjectView() {
  // ** Hooks
  const router = useRouter()
  const { selected, setSelected, workspace } = useContext(WorkspaceContext)
  const { id } = router.query

  const projectID = useMemo(() => id?.[0], [id])

  const { data, isLoading, refetch } = useQuery(`project-view-${projectID}`, () =>
    viewProject(projectID).then(res => {
      if (res?.statusCode === 403) {
        router.replace('/401')
      } else {
        return res
      }
    })
  )

  const { data: users } = useQuery({
    queryKey: ['members-list', projectID],
    queryFn: () => projectMembers(projectID),
    enabled: !!projectID
  })

  const role = useMemo(() => data?.userProjects.Role, [data?.userProjects?.Role])

  const handleUpdate = data => {
    if (data?.value === 'titleUpdate') {
      refetch()
    }
  }

  // ** Web Socket Setup
  useWebSocket(projectID, handleUpdate)

  const {
    data: taskGroups,
    isLoading: taskLoading,
    refetch: refetchTaskGroup
  } = useQuery(`taskGroup-${id}`, () => fetchTaskGroupList(projectID), { retry: false })

  useEffect(() => {
    if (data && projectID && !selected) {
      const activeData = workspace?.find(value => value?.WorkspaceID === data?.WorkSpaceID)
      if (activeData) setSelected(activeData)
    }
  }, [data, projectID, selected, setSelected, workspace])

  if (isLoading) return <FallbackSpinner height={'80vh'} />

  return (
    <ProjectProvider
      project={data}
      refetchProject={refetch}
      taskGroups={taskGroups}
      role={role}
      refetchTaskGroup={refetchTaskGroup}
    >
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            {/* Project Title */}
            <ProjectTitle data={data} refetch={refetch} role={role} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            gap={10}
            flexWrap={'wrap-reverse'}
          >
            {/* Search  */}
            <Box flex={1} minWidth={300}>
              <TextField
                fullWidth
                size='small'
                placeholder='Search ID, task, Project, Keywords...'
                InputProps={{ startAdornment: <Icon icon={'ion:search'} style={{ marginRight: 10 }} fontSize={24} /> }}
              />
            </Box>

            {/* Buttons */}
            <Box display={'flex'} alignItems={'center'} gap={4} flexWrap={'wrap'} justifyContent={'center'}>
              {role?.RoleName === 'Admin' && <NewTask projectID={projectID} refetch={refetchTaskGroup} />}
              <ProjectInvitePeople
                projectID={projectID}
                workspaceID={data?.WorkSpaceID}
                IsOpen={data?.IsOpen}
                role={role}
                users={users}
              />
              <Divider orientation='vertical' sx={{ borderColor: 'primary.main', height: 25, borderRightWidth: 1.5 }} />
              <Box display={'flex'} alignItems={'center'} gap={2}>
                <CustomButton variant='contained' sx={{ px: 2, minWidth: 'auto' }}>
                  <Icon icon={'fluent:pause-24-filled'} rotate={'90deg'} fontSize={20} />
                </CustomButton>
                <CustomButton variant='text' sx={{ px: 2, minWidth: 'auto' }}>
                  <Icon icon={'hugeicons:menu-circle'} rotate={'90deg'} fontSize={20} />
                </CustomButton>
              </Box>

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
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TaskGroupList users={users} taskGroups={taskGroups} isLoading={taskLoading} role={role} />
        </Grid>
      </Grid>
    </ProjectProvider>
  )
}

export default ProjectView
