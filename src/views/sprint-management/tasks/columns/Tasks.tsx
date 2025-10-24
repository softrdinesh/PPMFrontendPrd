import React, { useCallback, useState } from 'react'
import { Icon } from '@iconify/react'
import {
  Avatar,
  Box,
  Grid2 as Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Zoom
} from '@mui/material'
import { debounce } from 'lodash'

const NewTask = ({}) => {
  // Mock users for design only
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      profile: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      profile: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 3,
      name: 'Robert Brown',
      email: 'robert@example.com',
      profile: 'https://i.pravatar.cc/150?img=3'
    }
  ]

  const [anchorEl, setAnchorEl] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [dynamicValue] = useState([])

  const handleOpen = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleSelectUser = user => {
    console.log('User selected:', user)
    handleClose()
  }

  const userFilter = useCallback(
    user => user?.name?.toLowerCase()?.includes(searchText?.toLowerCase()),
    [searchText]
  )

  const debouncedClick = debounce(handleSelectUser, 500)

  return (
    <Box display='flex' alignItems='center'>
      <IconButton onClick={handleOpen}>
        <Icon icon='bi:plus-circle-dotted' />
      </IconButton>

      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose} TransitionComponent={Zoom}>
        <Box width={280}>
          <Grid container spacing={4}>
            <Grid size={12}>
              <Box px={3}>
                <TextField
                  fullWidth
                  color='secondary'
                  value={searchText}
                  size='small'
                  autoComplete='off'
                  placeholder='Search User...'
                  onChange={e => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: <Icon icon='ion:search' style={{ marginRight: 6 }} />
                  }}
                />
              </Box>
            </Grid>

            <Grid size={12}>
              {users.length !== 0 ? (
                users
                  .filter(userFilter)
                  .map(user => (
                    <MenuItem
                      disabled={dynamicValue.some(val => val.id === user.id)}
                      onClick={() => debouncedClick(user)}
                      key={user.id}
                    >
                      <Box display='flex' alignItems='center' gap={3} py={1}>
                        <Avatar alt={user.name} src={user.profile} sx={{ width: 32, height: 32 }} />
                        <Typography noWrap>{sprintdata.}</Typography>
                      </Box>
                    </MenuItem>
                  ))
              ) : (
                <Box px={3} py={2}>
                  <Typography variant='body2' color='text.secondary'>
                    No Users Added to Group
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </Box>
  )
}

export default NewTask
