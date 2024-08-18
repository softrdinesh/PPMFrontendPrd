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

  const generateBGColor = colorCode => {
    if (!colorCode) return 'background.default'

    const hexColor = getHexColor(colorCode)
    const luminance = getLuminance(hexColor)

    if (luminance < 0.5) {
      return `${hexColor}33`
    }

    return colorCode
  }

  const generateTextColor = colorCode => {
    if (!colorCode) return null

    const hexColor = getHexColor(colorCode)
    const luminance = getLuminance(hexColor)

    if (luminance < 0.5) {
      return `${hexColor}`
    }

    return getContrastingTextColor(colorCode)
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
      <Tooltip title={dynamicValue?.Status?.Statusname}>
        <Box
          bgcolor={generateBGColor(dynamicValue?.Status?.Colorcode)}
          borderRadius={1}
          maxWidth={'95%'}
          height={'60%'}
          display={'flex'}
          alignItems={'center'}
          color={generateTextColor(dynamicValue?.Status?.Colorcode)}
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
            bgcolor={generateBGColor(item?.Colorcode)}
            key={item?.StatusID}
            my={2}
            mx={1}
            borderRadius={1}
            color={generateTextColor(item?.Colorcode)}
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
