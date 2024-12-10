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
import React, { useCallback, useEffect, useState } from 'react'

const TaskPeople = ({ rowData = null, refetch, data, isSubTask, role, users }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedOwner, setSelectedOwner] = useState(data)

  const [searchText, setSearchText] = useState('')

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const userFilter = useCallback(
    user => {
      return user?.User?.Name?.toLowerCase()?.includes(searchText?.toLowerCase())
    },
    [searchText]
  )

  const handleClear = () => {
    setSelectedOwner(null)
  }

  const handleSelectUser = async selected => {
    try {
      if (isSubTask) {
        const body = {
          SubtaskOwner: selected?.UserID,
          Title: data ? 'Task Owner Updated' : 'Task Owner Added!',
          PreviousState: data?.Name,
          NewState: selected?.Name
        }
        body.TaskID = rowData?.TaskMasterID
        const response = await updateSubTask({ id: rowData?.SubTaskID, body })
        if (response) {
          refetch()
          handleClose()
        }
      } else {
        const body = {
          Taskowner: selected?.UserID,
          Title: data ? 'Task Owner Updated' : 'Task Owner Added!',
          PreviousState: data?.Name,
          NewState: selected?.Name
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
          {role?.RoleName === 'Admin' && (
            <IconButton size='small' onClick={handleClear} sx={{ position: 'absolute', top: -11, right: -12 }}>
              <Icon icon={'icon-park-twotone:close-one'} color='red' />
            </IconButton>
          )}
        </Box>
      ) : role?.RoleName === 'Admin' ? (
        <IconButton onClick={handleOpen}>
          <Icon icon={'bi:plus-circle-dotted'} />
        </IconButton>
      ) : (
        <Icon icon={'ph:question-duotone'} fontSize={24} />
      )}
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose} TransitionComponent={Zoom}>
        <Box width={280}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box px={3}>
                <TextField
                  fullWidth
                  color='secondary'
                  value={searchText}
                  size='small'
                  autoComplete='off'
                  placeholder='Search User...'
                  onChange={e => setSearchText(e?.target?.value)}
                  InputProps={{ startAdornment: <Icon icon={'ion:search'} style={{ marginRight: 6 }} /> }}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              {users?.length !== 0
                ? users?.filter(userFilter)?.map(user => (
                    <MenuItem
                      onClick={() =>
                        selectedOwner?.UserID !== user?.User?.UserID &&
                        role?.RoleName === 'Admin' &&
                        debouncedClick(user?.User)
                      }
                      key={user?.UserProjectID}
                    >
                      <Box display={'flex'} alignItems={'center'} gap={3} py={1} overflow={'hidden'}>
                        <Avatar
                          alt={user?.User?.Name}
                          src={user?.User?.ProfilePicture}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography overflow={'hidden'} textOverflow={'ellipsis'} whiteSpace={'nowrap'}>
                          {user?.User?.Name}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                : 'No Users Added to Group'}
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </Box>
  )
}

export default TaskPeople
