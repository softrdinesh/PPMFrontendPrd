// ** React Imports
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** API Imports
import { updateTask } from '@api/task'
import { ClickAwayListener } from '@mui/material'

const TaskNameCell = ({ data, refetch }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [taskName, setTaskName] = useState('')

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    const body = {
      Taskname: taskName
    }
    console.log('=======> body===>', body)

    updateTask({ id: data?.TaskID, body }).then(() => {
      setIsEditing(false)
      refetch()
    })
  }

  const handleChange = event => {
    setTaskName(event.target.value)
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
    setTaskName(data?.Taskname)
  }, [data?.Taskname])

  return (
    <Box display={'flex'} alignItems={'center'} height={'100%'}>
      {isEditing ? (
        <ClickAwayListener onClickAway={handleClickAway}>
          <TextField
            variant='standard'
            value={taskName ?? data?.Taskname}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </ClickAwayListener>
      ) : (
        <Typography onClick={handleEditClick}>{taskName}</Typography>
      )}
    </Box>
  )
}

export default TaskNameCell
