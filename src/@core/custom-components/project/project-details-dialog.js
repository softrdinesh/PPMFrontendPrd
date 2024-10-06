import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import React, { useState } from 'react'

// MUI Imports
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import { styled } from '@mui/styles'
import ProjectDetailsTab from './project-details-tab'
import ProjectActivityLogs from './project-activity'
import ProjectUpdates from './project-updates'

const StyledTabPanel = styled(TabPanel)(({ theme }) => ({
  padding: 0,
  paddingTop: theme.spacing(10),
  height: '60vh'
}))

const ProjectDetailsDialog = ({ open, close, projectData }) => {
  // States
  const [value, setValue] = useState('details')

  console.log('projectData :', projectData)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth='lg'>
      <DialogTitle>
        <Box>
          <Typography variant='h5' color={'primary.main'} fontWeight={700} mb={1}>
            {projectData?.ProjectName}
          </Typography>
          <Typography>Kindly update your information</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box>
          <TabContext value={value}>
            <TabList onChange={handleChange} aria-label='project details tabs'>
              <Tab value='details' label='Details' />
              <Tab value='updates' label='Updates' />
              <Tab value='activity' label='Activity Log' />
            </TabList>
            <StyledTabPanel value='details'>
              <ProjectDetailsTab projectData={projectData} />
            </StyledTabPanel>
            <StyledTabPanel value='updates'>
              <ProjectUpdates projectData={projectData} />
            </StyledTabPanel>
            <StyledTabPanel value='activity'>
              <ProjectActivityLogs projectData={projectData} />
            </StyledTabPanel>
          </TabContext>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectDetailsDialog
