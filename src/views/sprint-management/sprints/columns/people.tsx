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
  Zoom
} from '@mui/material'
import { debounce } from 'lodash'

import { useProject } from '@/context/project-context'
import type { ProjectUsers, User } from '@/services/modules/invite/types'
import type { AdditionalColumn } from '@/services/modules/sprint-item/types'
import type { Owner, SprintItem } from '@/services/modules/sprint-item/types'

interface TaskPeopleProps {
  rowData: SprintItem 
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
  const { users, role } = useProject()
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(rowData?.Owner ?? null)

  const [searchText, setSearchText] = useState('')

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const userFilter = useCallback(
    (user: ProjectUsers) => {
      return user?.User?.Name?.toLowerCase()?.includes(searchText?.toLowerCase())
    },
    [searchText]
  )

  const handleClear = () => {
    setSelectedOwner(null)
    handleClose()
  }

  const handleSelectUser = async (selected: User) => {
    // Design only - no API call
    handleClose()
  }

  const handleSelectOwner = async (selected: User) => {
    // Design only - no API call
    setSelectedOwner(selected)
    handleClose()
  }

  const debouncedClick = debounce(handleSelectUser, 500)
  const debouncedOwnerClick = debounce(handleSelectOwner, 500)

  useEffect(() => {
    setSelectedOwner(rowData?.Owner)
  }, [rowData])

  return (
    <Box display={'flex'} height={'100%'} width={'max-content'} alignItems={'center'}>
      {!!columnData?.AdditionalColumnID ? (
        <>
          <AvatarGroup max={2}>
            {dynamicValue?.map((item: any) => (
              <Tooltip key={item?.DynamicID} title={item?.User?.Email?.toLowerCase()}>
                <Avatar alt={item?.User?.Name} src={item?.User?.ProfilePicture} sx={{ width: 32, height: 32 }} />
              </Tooltip>
            ))}
          </AvatarGroup>
          {canEdit && (
            <IconButton onClick={handleOpen}>
              <Icon icon={'bi:plus-circle-dotted'} />
            </IconButton>
          )}
        </>
      ) : selectedOwner ? (
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
              {users?.length !== 0
                ? users?.filter(userFilter)?.map(user => (
                    <MenuItem
                      disabled={dynamicValue?.some((val: any) => val?.User?.UserID === user?.User?.UserID)}
                      onClick={() => {
                        if (!!dynamicValue || !!columnData) {
                          dynamicValue?.every((val: any) => val?.User?.UserID !== user?.User?.UserID) &&
                            canEdit &&
                            debouncedClick(user?.User)
                        } else {
                          selectedOwner?.UserID !== user?.User?.UserID &&
                            role?.RoleName === 'Admin' &&
                            debouncedOwnerClick(user?.User)
                        }
                      }}
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
