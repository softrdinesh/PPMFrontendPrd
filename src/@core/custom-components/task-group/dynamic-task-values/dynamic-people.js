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
import React, { useState } from 'react'

const DynamicPeople = ({ columnData = null, rowData = null, dynamicValue = [], refetch, isSubTask }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelectUser = async () => {
    try {
      const body = {
        DynamicID: dynamicValue?.DynamicID ?? null,
        AdditionalColumnID: columnData?.AdditionalColumnID,
        value: 56
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
                <Avatar alt={item?.User?.Name} src='/images/avatars/3.png' sx={{ width: 32, height: 32 }} />
              </Tooltip>
            ))}
          </AvatarGroup>
          <IconButton onClick={handleOpen}>
            <Icon icon={'bi:plus-circle-dotted'} />
          </IconButton>
        </>
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

export default DynamicPeople
