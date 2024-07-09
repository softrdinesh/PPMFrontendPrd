// ** React Imports
import React, { useContext, useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Custom Imports
import FallbackSpinner from '@components/spinner'
import CustomButton from '@components/button'
import CustomizedAccordions from 'src/@core/custom-components/task-accordian'
import { Icon } from '@iconify/react'

// ** API Imports
import { updateProject, viewProject } from '@api/project'
import { useQuery } from 'react-query'
import { ClickAwayListener } from '@mui/material'
import { WorkspaceContext } from 'src/context/workspace-context'

function ProjectView() {
  // ** Hooks
  const { refetchProjects } = useContext(WorkspaceContext)
  const router = useRouter()
  const { id } = router.query

  const projectID = id?.[0]

  const { data, isLoading, refetch } = useQuery(`project-view-${projectID}`, () => viewProject(projectID))

  const [isEditing, setIsEditing] = useState(false)
  const [projectName, setProjectName] = useState('')

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    const body = {
      ProjectName: projectName
    }

    updateProject({ id: data?.ID, body }).then(() => {
      setIsEditing(false)
      refetchProjects()
      refetch()
    })
  }

  const handleChange = event => {
    setProjectName(event.target.value)
  }

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      handleSave()
    }
  }

  const handleClickAway = () => {
    handleSave()
  }

  useEffect(() => {
    setProjectName(data?.ProjectName)
  }, [data])

  if (isLoading) return <FallbackSpinner height={'80vh'} />

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          {/* Project Title */}
          <Box display={'flex'} flexDirection={'column'}>
            <Box display={'flex'} alignItems={'end'} gap={2}>
              {isEditing ? (
                <ClickAwayListener onClickAway={handleClickAway}>
                  <TextField
                    variant='standard'
                    value={projectName ?? data?.ProjectName}
                    onChange={handleChange}
                    inputProps={{ style: { fontSize: 27, fontWeight: 700, width: 'auto' } }}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                </ClickAwayListener>
              ) : (
                <>
                  <Typography fontWeight={700} fontSize={'1.75rem'}>
                    {projectName}
                  </Typography>
                  <IconButton onClick={handleEditClick}>
                    <Icon icon={'mdi:pencil'} />
                  </IconButton>
                </>
              )}
            </Box>
            <Typography variant='subtitle2'>Add your board's description here</Typography>
          </Box>
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
              InputProps={{ startAdornment: <Icon icon={'mdi:search'} style={{ marginRight: 10 }} fontSize={24} /> }}
            />
          </Box>

          {/* Buttons */}
          <Box display={'flex'} alignItems={'center'} gap={4} flexWrap={'wrap'} justifyContent={'center'}>
            <CustomButton
              variant='contained'
              startIcon={<Icon icon={'simple-line-icons:plus'} style={{ marginInline: 2 }} />}
              endIcon={<Icon icon={'akar-icons:chevron-down'} style={{ marginInline: 5 }} />}
              sx={{ px: 3.5 }}
            >
              New Task
            </CustomButton>
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
        <Card>
          <Box px={3} py={4}>
            <CustomizedAccordions />
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProjectView
