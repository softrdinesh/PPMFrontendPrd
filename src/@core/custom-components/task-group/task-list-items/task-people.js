import { updateSubTask } from '@api/sub-task'
import { updateTask } from '@api/task'
import { Icon } from '@iconify/react'
import {
  Avatar,
  AvatarGroup,
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  Zoom
} from '@mui/material'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'

const TaskPeople = ({ rowData = null, refetch, data, isSubTask }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedOwner, setSelectedOwner] = useState(data)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClear = () => {
    setSelectedOwner(null)
  }

  const handleSelectUser = async () => {
    try {
      if (isSubTask) {
        const body = {
          SubtaskOwner: 56,
          Title: data ? 'Task Owner Updated' : 'Task Owner Added!',
          PreviousState: data?.Name,
          NewState: 'Samad Saiyed'
        }
        body.TaskID = rowData?.TaskMasterID
        const response = await updateSubTask({ id: rowData?.SubTaskID, body })
        if (response) {
          refetch()
          handleClose()
        }
      } else {
        const body = {
          Taskowner: 56,
          Title: data ? 'Task Owner Updated' : 'Task Owner Added!',
          PreviousState: data?.Name,
          NewState: 'Samad Saiyed'
        }
        const response = await updateTask({ id: rowData?.TaskID, body })
        if (response) {
          refetch()
          handleClose()
        }
      }
    } catch (error) {
      console.error('error :', error)
    }
  }

  const debouncedClick = debounce(handleSelectUser, 500)

  useEffect(() => {
    setSelectedOwner(data)
  }, [data, rowData])

  return (
    <Box display={'flex'} height={'100%'} alignItems={'center'}>
      {selectedOwner ? (
        <Box position={'relative'}>
          <AvatarGroup max={2}>
            <Tooltip key={selectedOwner?.UserID} title={selectedOwner?.Email?.toLowerCase()}>
              <Avatar alt={selectedOwner?.Name} src={selectedOwner?.ProfilePicture} sx={{ width: 32, height: 32 }} />
            </Tooltip>
          </AvatarGroup>
          <IconButton size='small' onClick={handleClear} sx={{ position: 'absolute', top: -11, right: -12 }}>
            <Icon icon={'icon-park-twotone:close-one'} color='red' />
          </IconButton>
        </Box>
      ) : (
        <IconButton onClick={handleOpen}>
          <Icon icon={'bi:plus-circle-dotted'} />
        </IconButton>
      )}
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose} TransitionComponent={Zoom}>
        <Box width={280}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box px={3}>
                <TextField
                  fullWidth
                  color='secondary'
                  size='small'
                  placeholder='Search User...'
                  InputProps={{ startAdornment: <Icon icon={'ion:search'} style={{ marginRight: 6 }} /> }}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box px={3}>
                <MenuItem onClick={debouncedClick}>
                  <Box display={'flex'} alignItems={'center'} gap={3} overflow={'hidden'}>
                    <Avatar alt={'samad'} src='/images/avatars/3.png' sx={{ width: 32, height: 32 }} />
                    <Typography overflow={'hidden'} textOverflow={'ellipsis'} whiteSpace={'nowrap'}>
                      Samad Saiyed
                    </Typography>
                  </Box>
                </MenuItem>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </Box>
  )
}

export default TaskPeople
