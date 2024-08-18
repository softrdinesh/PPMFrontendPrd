import { updateTask } from '@api/task'
import { Box, Menu, MenuItem, Typography, Zoom } from '@mui/material'
import React, { useState } from 'react'
import { useWorkspace } from 'src/context/workspace-context'
import { getContrastingTextColor } from 'src/utils/functions'

const DynamicDropdown = ({ columnData = null, rowData = null, dynamicValue = null, refetch }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { priorityList } = useWorkspace()

  const handleOpen = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelectStatus = async ID => {
    try {
      const body = {
        DynamicID: dynamicValue?.DynamicID ?? null,
        AdditionalColumnID: columnData?.AdditionalColumnID,
        value: ID
      }
      const response = await updateTask({ id: rowData?.TaskID, body })
      if (response) {
        refetch()
        handleClose()
      }
    } catch (error) {
      console.error('error :', error)
    }
  }

  return (
    <Box display={'flex'} alignItems={'center'} height={'100%'}>
      <Box
        bgcolor={dynamicValue?.Priority?.Colorcode ?? 'background.default'}
        width={'80%'}
        borderRadius={1}
        height={'60%'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        color={dynamicValue?.Priority?.Colorcode && getContrastingTextColor(dynamicValue?.Priority?.Colorcode)}
        border={1}
        borderColor={'divider'}
        onClick={handleOpen}
        sx={{ cursor: 'pointer' }}
      >
        <Typography fontSize={'0.85rem'} textOverflow={'ellipsis'} overflow={'hidden'} color={'inherit'}>
          {dynamicValue?.Priority?.PriorityName ?? 'None'}
        </Typography>
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
            color={getContrastingTextColor(item?.Colorcode)}
            justifyContent={'center'}
            alignItems={'center'}
            onClick={() => {
              handleSelectStatus(item?.PriorityID)
            }}
          >
            <Typography color={'inherit'}>{item?.PriorityName}</Typography>
          </Box>
        ))}
      </Menu>
    </Box>
  )
}

export default DynamicDropdown
