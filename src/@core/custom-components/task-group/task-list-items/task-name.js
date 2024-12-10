// ** React Imports
import React, { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** API Imports
import { Icon } from '@iconify/react'
import { IconButton } from '@mui/material'
import ProjectDetailsDialog from '@custom-components/project/project-details-dialog'

const TaskNameCell = ({ renderTextField, rowData, projectData, refetch }) => {
  const [openTaskView, setOpenTaskView] = useState(false)

  const handleTaskViewClick = () => {
    setOpenTaskView(true)
  }

  const handleClose = () => setOpenTaskView(false)

  return (
    <>
      <Box display={'flex'} gap={3} alignItems={'center'}>
        {renderTextField}
        <IconButton size='small' onClick={handleTaskViewClick}>
          <Icon icon={'lucide:message-circle-more'} fontSize={22} />
        </IconButton>
      </Box>
      <ProjectDetailsDialog
        open={openTaskView}
        close={handleClose}
        projectData={projectData}
        taskData={rowData}
        refetchTasks={refetch}
      />
    </>
  )
}

export default TaskNameCell
