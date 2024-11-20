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
import React, { useCallback, useState } from 'react'

const DynamicPeople = ({
  columnData = null,
  rowData = null,
  dynamicValue = [],
  refetch,
  isSubTask,
  canEdit,
  users
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
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

  const handleSelectUser = async selected => {
    try {
      const body = {
        DynamicID: dynamicValue?.DynamicID ?? null,
        AdditionalColumnID: columnData?.AdditionalColumnID,
        value: selected?.UserID,
        Title: `Column '${columnData?.ColumnName}' was updated`,
        PreviousState: `${dynamicValue?.length} users`,
        NewState: `${dynamicValue?.length + 1} users`
      }
      if (isSubTask) {
        body.TaskID = rowData?.TaskMasterID
        const response = await updateSubTask({ id: rowData?.SubTaskID, body })
        if (response) {
          refetch()
          handleClose()
        }
      } else {
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

  return (
    <Box display={'flex'} height={'100%'} alignItems={'center'}>
      {dynamicValue && dynamicValue?.length !== 0 ? (
        <>
          <AvatarGroup max={2}>
            {dynamicValue?.map(item => (
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
      ) : canEdit ? (
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
                  value={searchText}
                  color='secondary'
                  size='small'
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
                      disabled={dynamicValue?.some(val => val?.User?.UserID === user?.User?.UserID)}
                      onClick={() =>
                        dynamicValue?.every(val => val?.User?.UserID !== user?.User?.UserID) &&
                        canEdit &&
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

export default DynamicPeople
