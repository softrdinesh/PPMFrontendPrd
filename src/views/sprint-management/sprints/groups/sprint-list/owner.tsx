import React, { useCallback, useEffect, useState } from 'react'

import { Icon } from '@iconify/react'
import {
  Avatar,
  AvatarGroup,
  Box,
  Grid2 as Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material'
import { debounce } from 'lodash'
import axios from 'axios'
import { useProject } from '@/context/project-context'
import type { ProjectUsers, User } from '@/services/modules/invite/types'
import type { AdditionalColumn } from '@/services/modules/project/types'
import { updateSubTask } from '@/services/modules/sub-task'
import type { AdditionalSubTaskListItem } from '@/services/modules/sub-task/types'
import { updateTasks } from '@/services/modules/task'
import type { Owner, TaskListItemType } from '@/services/modules/task/types'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'react-hot-toast'

interface TaskPeopleProps {
  rowData: TaskListItemType | AdditionalSubTaskListItem
  refetch: () => void
  isSubTask?: boolean
  dynamicValue?: any
  columnData?: AdditionalColumn
  canEdit?: boolean
}

const TaskPeople = ({
  rowData,
  isSubTask = false,
  refetch,
  dynamicValue,
  columnData,
  canEdit = false
}: TaskPeopleProps) => {
  // ** Hooks
  const { users: contextUsers, role } = useProject()
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(rowData?.Owner ?? null)
  const [searchText, setSearchText] = useState('')
  const { profile, user } = useAuth()
  
  // ** State for API users
  const [apiUsers, setApiUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // New state for user list popover
  const [userListAnchor, setUserListAnchor] = useState<HTMLElement | null>(null)

  // ** Fetch users from API
  const fetchUsers = useCallback(async () => {
    if (!user?.id) return
    
    setLoading(true)
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL1
      const response = await axios.get(`${BASE_URL}/GetUserList?LoginuserID=${user.id}`)
      
      // ** Map the API response to match your User type structure
      const mappedUsers = response.data.map((apiUser: any) => ({
        UserProjectID: apiUser.userID,
        User: {
          UserID: apiUser.userID,
          Name: apiUser.name,
          Email: apiUser.email.toLowerCase(),
          ProfilePicture: apiUser.profilepicture || ''
        }
      }))
      
      setApiUsers(mappedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // ** Fetch users when component mounts
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // New handlers for user list popover
  const handleUserListOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserListAnchor(event.currentTarget)
  }

  const handleUserListClose = () => {
    setUserListAnchor(null)
  }

  const userFilter = useCallback(
    (user: any) => {
      return user?.User?.Name?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
             user?.User?.Email?.toLowerCase()?.includes(searchText?.toLowerCase())
    },
    [searchText]
  )

  const handleClear = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL1

    try {
      if (columnData?.additionalColumnID) {
        // Handle dynamic column clear
        await axios.post(
          `${BASE_URL}/AssignDyamicUserTask`,
          null,
          {
            params: {
              TaskID: rowData?.TaskID?.toString(),
              LoginuserID: user?.id,
              UserID: selectedOwner?.UserID,
              IsRemove: true,
              AdditionalColumnID: columnData?.additionalColumnID
            }
          }
        )
        toast.success('Owner removed successfully')
        setSelectedOwner(null)
        refetch()
      } else {
        // Handle regular task clear
        const payload = {
          TaskID: rowData?.TaskID,
          Owner: null
        }
        const response = await updateTasks(payload)
        if (response) {
          toast.success('Owner removed successfully')
          setSelectedOwner(null)
          refetch()
        }
      }
    } catch (error) {
      console.error('Error removing owner:', error)
      toast.error('Failed to remove owner')
    }
  }
  
  const handleSelectUser = async (selected: any) => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL1
      
      if (columnData?.additionalColumnID) {
        // Handle dynamic column user assignment
        const response = await axios.post(
          `${BASE_URL}/InsertDynamicValues`,
          null,
          {
            params: {
              DynamicColumnID: columnData?.additionalColumnID,
              LoginuserID: user?.id,
              SprintID: (rowData as any)?.SprintID || '',
              SprintGroupID: (rowData as any)?.SprintGroupID || '',
              DynamicValue: selected?.UserID
            }
          }
        )
        
        if (response) {
          console.log('Dynamic value inserted:', response.data)
          toast.success('User assigned successfully')
          refetch()
          handleClose()
        }
      } else {
        // Handle regular task owner assignment
        const payload = {
          TaskID: rowData?.TaskID,
          Owner: selected
        }
        const response = await updateTasks(payload)
        if (response) {
          setSelectedOwner(selected)
          toast.success('Owner assigned successfully')
          refetch()
          handleClose()
        }
      }
    } catch (error) {
      console.error('Error in handleSelectUser:', error)
      toast.error('Failed to assign user')
    }
  }

  const debouncedClick = debounce(handleSelectUser, 500)

  useEffect(() => {
    setSelectedOwner(rowData?.Owner)
  }, [rowData])

  // people remove
  const handleremove = async (item: any, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL1

    try {
      const response = await axios.post(
        `${BASE_URL}/AssignDyamicUserTask`,
        null,
        {
          params: {
            TaskID: rowData?.TaskID?.toString(),
            LoginuserID: user?.id,
            UserID: item?.User?.UserID,
            IsRemove: true,
            AdditionalColumnID: columnData?.AdditionalColumnID
          }
        }
      )
      
      if (response.data) {
        console.log(response.data)
        toast.success('User removed successfully')
        refetch()
        if (userListAnchor) {
          handleUserListClose()
        }
      }
    } catch (error) {
      console.error('Error removing user:', error)
      toast.error('Failed to remove user')
    }
  }

  // ** Combine context users with API users
  const users = apiUsers.length > 0 ? apiUsers : contextUsers || []

  // Get the users to display - for dynamic columns use dynamicValue, for regular tasks use AssignedUsers
  const displayUsers = columnData?.additionalColumnID ? dynamicValue : (rowData as any)?.AssignedUsers || []

  return (
    <Box display={'flex'} height={'100%'} width={'max-content'} alignItems={'center'}>
      {columnData?.additionalColumnID ? (
        <>
          <Box onClick={handleUserListOpen} sx={{ cursor: 'pointer' }}>
            <AvatarGroup max={2}>
              {displayUsers?.map((item: any) => (
                <div key={item?.User?.UserID || item?.UserID} style={{ position: 'relative', display: 'inline-block' }}>
                  <Tooltip title={item?.User?.Email?.toLowerCase() || item?.Email?.toLowerCase()}>
                    <Avatar 
                      alt={item?.User?.Name || item?.Name} 
                      src={item?.User?.ProfilePicture || item?.ProfilePicture} 
                      sx={{ width: 32, height: 32 }} 
                    />
                  </Tooltip>

                  {/* Small close button */}
                  {canEdit && (
                    <button
                      onClick={(e) => handleremove(item, e)}
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        padding: 0,
                        zIndex: 1
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </AvatarGroup>
          </Box>

          {/* Popover to show full user list */}
          <Popover
            open={Boolean(userListAnchor)}
            anchorEl={userListAnchor}
            onClose={handleUserListClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            TransitionComponent={Zoom}
          >
            <Box sx={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant='body1' fontWeight={500} color="white">
                  Assigned Users ({displayUsers?.length || 0})
                </Typography>
                <IconButton size='small' onClick={handleUserListClose} sx={{ color: 'white' }}>
                  <Icon icon='mdi:close' />
                </IconButton>
              </Box>
              <List sx={{ pt: 0 }}>
                {displayUsers?.map((item: any, index: number) => (
                  <React.Fragment key={item?.User?.UserID || item?.UserID}>
                    <ListItem
                      sx={{
                        py: 2,
                        position: 'relative',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar 
                            alt={item?.User?.Name || item?.Name} 
                            src={item?.User?.ProfilePicture || item?.ProfilePicture} 
                            sx={{ width: 40, height: 40 }} 
                          />
                          {/* Small close button on avatar */}
                          {canEdit && (
                            <button
                              onClick={(e) => handleremove(item, e)}
                              style={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                padding: 0,
                                zIndex: 1
                              }}
                            >
                              ✕
                            </button>
                          )}
                        </Box>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant='body1' fontWeight={500}>
                            {item?.User?.Name || item?.Name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.875rem' }}>
                            {item?.User?.Email?.toLowerCase() || item?.Email?.toLowerCase()}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < displayUsers.length - 1 && <Divider variant='inset' component='li' />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Popover>

          {canEdit && (
            <IconButton onClick={handleOpen}>
              <Icon icon={'bi:plus-circle-dotted'} />
            </IconButton>
          )}
        </>
      ) : selectedOwner ? (
        <Box position={'relative'}>
          <Tooltip key={selectedOwner?.UserID} title={selectedOwner?.Email?.toLowerCase()}>
            <Avatar alt={selectedOwner?.Name} src={selectedOwner?.ProfilePicture} sx={{ width: 32, height: 32 }} />
          </Tooltip>
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
      
      <Menu 
        open={!!anchorEl} 
        anchorEl={anchorEl} 
        onClose={handleClose} 
        TransitionComponent={Zoom}
      >
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
                  onChange={e => setSearchText(e?.target?.value)}
                  InputProps={{ startAdornment: <Icon icon={'ion:search'} style={{ marginRight: 6 }} /> }}
                />
              </Box>
            </Grid>
            <Grid size={12}>
              {loading ? (
                <Box px={3} py={2}>
                  <Typography>Loading users...</Typography>
                </Box>
              ) : users?.length !== 0 ? (
                users
                  ?.filter(userFilter)
                  ?.filter(user => {
                    // For dynamic columns, filter out already assigned users
                    if (columnData?.additionalColumnID && displayUsers) {
                      return !displayUsers?.some((val: any) => 
                        val?.User?.UserID === user?.User?.UserID || 
                        val?.UserID === user?.User?.UserID
                      )
                    }
                    return true
                  })
                  ?.map(user => (
                    <MenuItem
                      onClick={() => {
                        if (canEdit) {
                          debouncedClick(user?.User)
                        }
                      }}
                      key={user?.UserProjectID || user?.User?.UserID}
                    >
                      <Box display={'flex'} alignItems={'center'} gap={3} py={1} overflow={'hidden'}>
                        <Avatar alt={user?.User?.Name} src={user?.User?.ProfilePicture} sx={{ width: 32, height: 32 }} />
                        <Typography overflow={'hidden'} textOverflow={'ellipsis'} whiteSpace={'nowrap'}>
                          {user?.User?.Name}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
              ) : (
                <Box px={3} py={2}>
                  <Typography>No Users Added to Group</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </Box>
  )
}

export default TaskPeople
