import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { Box, Dialog, DialogContent, IconButton, Menu, MenuItem, Zoom } from '@mui/material'

const menuItems = [
  {
    title: 'Computer',
    type: 'file',
    prefix: '',
    hasBottomBorder: true
  },
  {
    title: 'Form Link',
    type: 'link',
    prefix: '',
    hasBottomBorder: true
  },
  {
    title: 'Google Drive',
    type: 'link',
    prefix: 'drive.google',
    hasBottomBorder: false
  },
  {
    title: 'One Drive',
    type: 'link',
    prefix: '',
    hasBottomBorder: false
  },
  {
    title: 'Share point',
    type: 'file',
    prefix: '',
    hasBottomBorder: false
  }
]

const DynamicFiles = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)

  const handleOpen = event => setAnchorEl(event?.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <Box display={'flex'} height={'100%'} alignItems={'center'}>
        <IconButton onClick={handleOpen}>
          <Icon icon={'bi:plus-circle-dotted'} />
        </IconButton>
      </Box>

      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose} TransitionComponent={Zoom}>
        {menuItems?.map(item => (
          <MenuItem key={item.title} sx={{ borderBottom: item?.hasBottomBorder && 1, borderColor: 'divider' }}>
            {item?.title}
          </MenuItem>
        ))}
      </Menu>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogContent></DialogContent>
      </Dialog>
    </>
  )
}

export default DynamicFiles
