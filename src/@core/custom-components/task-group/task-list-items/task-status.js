import { Box, Menu, MenuItem, Tooltip, Typography, Zoom } from '@mui/material'
import React, { useState } from 'react'
import { useWorkspace } from 'src/context/workspace-context'

const TaskStatus = ({ row, handleStatusChange }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { statusList } = useWorkspace()

  const handleOpen = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box display={'flex'} alignItems={'center'} height={'100%'}>
      <Tooltip title={row?.Status?.Statusname}>
        <Box
          bgcolor={row?.Status?.Colorcode ?? 'background.default'}
          borderRadius={1}
          maxWidth={'95%'}
          height={'60%'}
          display={'flex'}
          alignItems={'center'}
          px={2}
          justifyContent={'center'}
          border={1}
          borderColor={'divider'}
          onClick={handleOpen}
          sx={{ cursor: 'pointer' }}
        >
          <Typography fontSize={'0.85rem'} textOverflow={'ellipsis'} overflow={'hidden'}>
            {row?.Status?.Statusname ?? 'None'}
          </Typography>
        </Box>
      </Tooltip>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center' }}
        sx={{ '& .MuiList-root': { p: 0 } }}
      >
        {statusList?.map(item => (
          <Box
            component={MenuItem}
            bgcolor={item?.Colorcode}
            key={item?.StatusID}
            my={2}
            mx={1}
            borderRadius={1}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            onClick={() => {
              if (row?.StatusID != item?.StatusID) {
                handleStatusChange(row, { StatusID: item?.StatusID })
              }
              handleClose()
            }}
          >
            <Typography>{item?.Statusname}</Typography>
          </Box>
        ))}
      </Menu>
    </Box>
  )
}

export default TaskStatus
