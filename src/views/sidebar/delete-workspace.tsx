import { Icon } from '@iconify/react'
import { Box, Dialog, DialogActions, DialogContent, IconButton, Typography, Zoom } from '@mui/material'

import CustomButton from '@/components/button'

type DeleteWorkspaceDialogProps = {
  open: boolean
  setOpen: (value: boolean) => void
  onConfirm: () => void
}

function DeleteWorkspaceDialog({ open, setOpen, onConfirm }: DeleteWorkspaceDialogProps) {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Zoom} fullWidth maxWidth='sm'>
      <div className='flex flex-1 items-center justify-between px-5 py-4 bg-backgroundDefault'>
        <Typography className='text-xl font-medium'>Delete Workspace ?</Typography>
        <IconButton aria-label='close' onClick={handleClose} className='h-10 w-10 rounded-md border border-black'>
          <Icon icon={'mdi:close'} color={`common.black`} fontSize={24} />
        </IconButton>
      </div>
      <DialogContent className='bg-backgroundDefault py-7'>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={2}>
          <Typography variant='caption' className='text-sm font-normal text-center'>
            Are you sure you want to delete this workspace?
          </Typography>
          <Typography variant='caption' className='text-sm font-normal text-center'>
            ** You wont be able to revert the changes
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions className='justify-between px-4 py-4 bg-backgroundDefault'>
        <CustomButton circular variant='outlined' size='large' onClick={handleClose}>
          Cancel
        </CustomButton>
        <CustomButton circular variant='contained' size='large' onClick={onConfirm}>
          {'Confirm Delete'}
        </CustomButton>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteWorkspaceDialog
