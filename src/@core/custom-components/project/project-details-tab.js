import Avatar from '@components/avatar'
import CustomButton from '@components/button'
import HtmlEditor from '@components/html-editor'
import { Icon } from '@iconify/react'
import { useMediaQuery } from '@mui/material'
import { Box, Grid, IconButton, Typography, useTheme } from '@mui/material'
import { getInitials } from '@utils/get-initials'
import React from 'react'

const MobileProjectDetail = ({ theme, projectData }) => {
  return (
    <Box
      width={'100%'}
      position={'relative'}
      borderRadius={2}
      bgcolor={theme.palette.primary.light + 22}
      height={'100%'}
      display={'flex'}
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems={'center'}
      justifyContent={'space-between'}
      p={5}
      gap={4}
    >
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={4}>
        <Box position={'relative'} display={'flex'}>
          <Avatar
            skin='light'
            sx={{ height: 80, width: 80, boxShadow: theme.shadows[4] }}
            src={'/images/avatars/3.png'}
          >
            {getInitials(projectData?.CreatedBy?.Name)}
          </Avatar>
          <Box
            display={'flex'}
            alignItems={'center'}
            gap={1}
            position={'absolute'}
            bgcolor={'white'}
            borderRadius={100}
            top={-1}
            right={-1}
            boxShadow={theme => theme.shadows[4]}
          >
            <IconButton size='small'>
              <Icon icon={'mdi:favourite-outline'} />
            </IconButton>
          </Box>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={{ xs: 'start', lg: 'center' }}
          justifyContent={'center'}
        >
          <Typography variant='body1' fontWeight={600}>
            {projectData?.CreatedBy?.Name}
          </Typography>
          <Typography variant='body2'>Product Owner</Typography>
        </Box>
      </Box>
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={4}>
        <CustomButton variant='contained' size='small'>
          Sprint 1.1
        </CustomButton>
        <Box mt={{ lg: 5 }}>
          <CustomButton variant='outlined' circular size='small'>
            View All
          </CustomButton>
        </Box>
      </Box>
    </Box>
  )
}

const DesktopProjectDetail = ({ theme, projectData }) => {
  return (
    <Box
      width={'100%'}
      borderRadius={2}
      bgcolor={theme.palette.primary.light + 22}
      height={'100%'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      p={5}
      gap={1}
    >
      <Avatar skin='light' sx={{ height: 100, width: 100 }} src={'/images/avatars/3.png'}>
        {getInitials(projectData?.CreatedBy?.Name)}
      </Avatar>

      <Typography variant='body1' fontWeight={600}>
        {projectData?.CreatedBy?.Name}
      </Typography>
      <Typography variant='body2'>Product Owner</Typography>

      <Box display={'flex'} alignItems={'center '} gap={1} my={4}>
        <IconButton size='small'>
          <Icon icon={'mdi:favourite-outline'} />
        </IconButton>
        <Typography variant='subtitle2'>Add to favourites</Typography>
      </Box>
      <CustomButton variant='contained'>Sprint 1.1</CustomButton>
      <Box mt={{ lg: 5 }}>
        <CustomButton variant='outlined' circular size='small'>
          View All
        </CustomButton>
      </Box>
    </Box>
  )
}

const ProjectDetailsTab = ({ projectData }) => {
  const theme = useTheme()
  const lgBreakpoint = useMediaQuery(theme => theme.breakpoints.up('lg'))

  return (
    <Box height={'100%'}>
      <Grid container spacing={4} alignItems={'stretch'} height={'100%'}>
        <Grid item xs={12} lg={8} order={{ xs: 2, lg: 1 }}>
          <HtmlEditor placeholder={'Please enter a project description....'} />
        </Grid>
        <Grid item xs={12} lg={4} order={{ xs: 1, lg: 2 }}>
          {lgBreakpoint ? (
            <DesktopProjectDetail theme={theme} projectData={projectData} />
          ) : (
            <MobileProjectDetail theme={theme} projectData={projectData} />
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProjectDetailsTab
