import { viewProject } from '@api/project'
import CustomButton from '@components/button'
import FallbackSpinner from '@components/spinner'
import { Icon } from '@iconify/react'
import { Box, Card, Divider, Grid, IconButton, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query'
import CustomizedAccordions from 'src/@core/custom-components/task-accordian'

function ProjectView() {
  const router = useRouter()
  const { id } = router.query

  const projectID = id?.[0]

  const { data, isLoading } = useQuery(`project-view-${projectID}`, () => viewProject(projectID))

  if (isLoading) return <FallbackSpinner height={'80vh'} />

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          {/* Project Title */}
          <Box display={'flex'} flexDirection={'column'}>
            <Box display={'flex'} alignItems={'end'} gap={2}>
              <Typography fontWeight={700} fontSize={'1.75rem'}>
                {data?.ProjectName}
              </Typography>
              <IconButton>
                <Icon icon={'mdi:pencil'} />
              </IconButton>
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
