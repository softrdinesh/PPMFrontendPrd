import { updateTask } from '@api/task'
import { Box, Menu, MenuItem, Tooltip, Typography, Zoom } from '@mui/material'
import React, { useState } from 'react'
import { useWorkspace } from 'src/context/workspace-context'
import { getContrastingTextColor, getHexColor, getLuminance } from 'src/utils/functions'

const TaskStatus = ({ columnData = null, rowData = null, dynamicValue = null, refetch }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { statusList } = useWorkspace()

  const handleOpen = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const generateBGColor = () => {
    if (!dynamicValue?.Status?.Colorcode) return 'background.default'

    const hexColor = getHexColor(dynamicValue?.Status?.Colorcode)
    const luminance = getLuminance(hexColor)

    if (luminance < 0.5) {
      return `${hexColor}33`
    }

    return dynamicValue?.Status?.Colorcode
  }

  const generateTextColor = () => {
    if (!dynamicValue?.Status?.Colorcode) return null

    const hexColor = getHexColor(dynamicValue?.Status?.Colorcode)
    const luminance = getLuminance(hexColor)

    if (luminance < 0.5) {
      return `${hexColor}`
    }

    return getContrastingTextColor(dynamicValue?.Status?.Colorcode)
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
      console.log('error :', error)
    }
  }

  return (
    <Box display={'flex'} alignItems={'center'} height={'100%'}>
      <Tooltip title={dynamicValue?.Status?.Statusname}>
        <Box
          bgcolor={generateBGColor()}
          borderRadius={1}
          maxWidth={'95%'}
          height={'60%'}
          display={'flex'}
          alignItems={'center'}
          color={generateTextColor()}
          px={2}
          justifyContent={'center'}
          border={1}
          borderColor={'divider'}
          onClick={handleOpen}
          sx={{ cursor: 'pointer' }}
        >
          <Typography
            fontSize={'0.85rem'}
            fontWeight={500}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            color={'inherit'}
          >
            {dynamicValue?.Status?.Statusname ?? 'None'}
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
            color={getContrastingTextColor(item?.Colorcode)}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            onClick={() => {
              handleSelectStatus(item?.StatusID)
            }}
          >
            <Typography color={'inherit'}>{item?.Statusname}</Typography>
          </Box>
        ))}
      </Menu>
    </Box>
  )
}

export default TaskStatus
