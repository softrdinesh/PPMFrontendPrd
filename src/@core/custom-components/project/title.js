// ** React Imports
import React, { useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Custom Imports
import { Icon } from '@iconify/react'

// ** API Imports
import { updateProject } from '@api/project'
import { ClickAwayListener } from '@mui/material'
import { WorkspaceContext } from 'src/context/workspace-context'

function ProjectTitle({ data, refetch }) {
  // ** Hooks
  const { refetchProjects } = useContext(WorkspaceContext)

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

  return (
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
  )
}

export default ProjectTitle
