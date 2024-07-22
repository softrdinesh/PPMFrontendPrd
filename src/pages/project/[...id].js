// ** React Imports
import React, { useContext, useEffect } from 'react'

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

// ** API Imports
import { viewProject } from '@api/project'
import { fetchTaskGroupList } from '@api/task-group'
import ProjectTitle from '@custom-components/project/title'
import TaskGroupList from '@custom-components/task-group/list'
import NewTask from '@custom-components/task-group/new-task'
import { useQuery } from 'react-query'
import { WorkspaceContext } from 'src/context/workspace-context'

function ProjectView() {
  // ** Hooks
  const router = useRouter()
  const { selected, setSelected, workspace } = useContext(WorkspaceContext)
  const { id } = router.query

  const projectID = id?.[0]

  const { data, isLoading, refetch } = useQuery(`project-view-${projectID}`, () => viewProject(projectID))

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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          {/* Project Title */}
          <ProjectTitle data={data} refetch={refetch} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={10} flexWrap={'wrap-reverse'}>
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
            <NewTask projectID={projectID} refetch={refetchTaskGroup} />
            <CustomButton
              variant='outlined'
              startIcon={<Icon icon={'solar:users-group-rounded-linear'} style={{ marginInline: 2 }} />}
              sx={{ px: 3.5 }}
            >
              Group
            </CustomButton>
            <Divider orientation='vertical' sx={{ borderColor: 'primary.main', height: 25, borderRightWidth: 1.5 }} />
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <CustomButton variant='contained' sx={{ px: 2, minWidth: 'auto' }}>
                <Icon icon={'fluent:pause-24-filled'} rotate={'90deg'} fontSize={20} />
              </CustomButton>
              <CustomButton variant='text' sx={{ px: 2, minWidth: 'auto' }}>
                <Icon icon={'hugeicons:menu-circle'} rotate={'90deg'} fontSize={20} />
              </CustomButton>
            </Box>
            <CustomButton
              variant='outlined'
              startIcon={<Icon icon={'hugeicons:filter'} style={{ marginInline: 2 }} />}
              endIcon={<Icon icon={'akar-icons:chevron-down'} style={{ marginInline: 5 }} />}
              sx={{ px: 3.5 }}
            >
              Filter
            </CustomButton>
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
        <TaskGroupList id={projectID} refetch={refetchTaskGroup} taskGroups={taskGroups} isLoading={taskLoading} />
      </Grid>
    </Grid>
  )
}

export default ProjectView
