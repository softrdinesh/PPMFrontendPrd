// ** React Imports
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import { ClickAwayListener } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Custom Imports
import { Icon } from '@iconify/react'

// ** API Imports
import { updateTaskGroup } from '@api/task-group'

function TaskGroupTitle({ data, refetch }) {
  // ** Hooks

  const [isEditing, setIsEditing] = useState(false)
  const [taskGroupName, setTaskGroupName] = useState('')

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    const body = {
      groupName: taskGroupName
    }

    updateTaskGroup({ id: data?.TaskGroupID, body }).then(() => {
      setIsEditing(false)

      refetch()
    })
  }

  const handleChange = event => {
    setTaskGroupName(event.target.value)
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
    setTaskGroupName(data?.TaskGroupName)
  }, [data])

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box display={'flex'} alignItems={'center'} gap={2}>
        {isEditing ? (
          <ClickAwayListener onClickAway={handleClickAway}>
            <TextField
              variant='standard'
              value={taskGroupName ?? data?.TaskGroupName}
              onChange={handleChange}
              inputProps={{ style: { fontSize: 17, fontWeight: 700, width: 'auto' } }}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </ClickAwayListener>
        ) : (
          <>
            <Typography ml={3} fontWeight={700}>
              {taskGroupName ?? '-'}
            </Typography>
            <IconButton onClick={handleEditClick}>
              <Icon icon={'mdi:pencil'} fontSize={16} />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  )
}

export default TaskGroupTitle
