import CustomButton from '@components/button'
import { Box, Menu, MenuItem, Typography, Zoom } from '@mui/material'
import React, { useState } from 'react'
import { useWorkspace } from 'src/context/workspace-context'

const TaskPriority = ({ row, handlePriorityChange }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { priorityList } = useWorkspace()

  const handleOpen = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box display={'flex'} alignItems={'center'} height={'100%'}>
      <Box
        bgcolor={row?.Priority?.Colorcode ?? 'background.default'}
        component={CustomButton}
        width={'80%'}
        borderRadius={1}
        height={'60%'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        border={1}
        borderColor={'divider'}
        onClick={handleOpen}
      >
        <Typography fontSize={'0.85rem'}>{row?.Priority?.PriorityName ?? 'None'}</Typography>
      </Box>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center' }}
        sx={{ '& .MuiList-root': { p: 0 } }}
      >
        {priorityList?.map(item => (
          <Box
            component={MenuItem}
            bgcolor={item?.Colorcode}
            key={item?.PriorityID}
            my={2}
            mx={1}
            borderRadius={1}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            onClick={() => {
              handlePriorityChange(row, { PriorityID: item?.PriorityID })
              handleClose()
            }}
          >
            <Typography>{item?.PriorityName}</Typography>
          </Box>
        ))}
      </Menu>
    </Box>
  )
}

export default TaskPriority
