import { useState } from 'react'

import { Box, Grow, IconButton, Menu, MenuItem, Typography } from '@mui/material'

import DeleteDialog from '@/components/dialog/delete-dialog'

const TaskGroupActions = () => {
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleMenuOpen = (e: any) => {
    e.stopPropagation()

    setAnchorEl(e?.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const onEditClick = (e: any) => {
    e.stopPropagation()
    handleMenuClose()
  }

  const onDeleteClick = (e: any) => {
    e.stopPropagation()
    setDeleteOpen(true)
    handleMenuClose()
  }

  const handleDelete = async () => {}

  return (
    <>
      <IconButton size='small' onClick={handleMenuOpen} onFocus={event => event.stopPropagation()}>
        <i className='ri-more-2-fill h-4 w-5' />
      </IconButton>
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleMenuClose} TransitionComponent={Grow}>
        <MenuItem onClick={onEditClick}>
          <Box display={'flex'} alignItems={'center'} gap={3}>
            <i className={'ri-pencil-line text-lg'} />
            <Typography fontSize={13}>Edit</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={onDeleteClick}>
          <Box display={'flex'} alignItems={'center'} gap={3}>
            <i className={'ri-delete-bin-5-line text-lg text-error'} />
            <Typography fontSize={13} className='text-error'>
              Delete
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      <DeleteDialog
        open={deleteOpen}
        setOpen={val => setDeleteOpen(!!val)}
        title={`Delete this taskgroup ?`}
        onConfirm={handleDelete}
        description={'You wont be able to revert this action'}
      />
    </>
  )
}

export default TaskGroupActions
