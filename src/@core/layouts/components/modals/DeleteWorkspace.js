import { Icon } from '@iconify/react'
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Typography, Zoom } from '@mui/material'

function DeleteWorkspaceDialog({ open, setOpen, onConfirm }) {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Zoom} fullWidth maxWidth='sm'>
      <Box
        px={5}
        py={5}
        bgcolor={'background.default'}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Typography variant='h6' fontWeight={600}>
          Delete Workspace ?
        </Typography>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={theme => ({
            height: 35,
            width: 35,
            border: '1px solid ',
            borderColor: `${theme.palette.common.lightGrayishBlue}`,
            borderRadius: 1
          })}
        >
          <Icon icon={'mdi:close'} color={`common.black`} fontSize={24} />
        </IconButton>
      </Box>
      <DialogContent sx={{ bgcolor: 'background.default' }}>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={2}>
          <Typography variant='caption' fontSize={13} textAlign={'center'}>
            Are you sure you want to delete this workspace?
          </Typography>
          <Typography variant='caption' fontSize={13} textAlign={'center'}>
            ** You wont be able to revert the changes
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 4, py: 3, bgcolor: 'background.default' }}>
        <Button
          sx={{
            borderRadius: 30,
            fontWeight: 400,
            fontSize: '14px',
            textTransform: 'capitalize'
          }}
          variant='outlined'
          size='large'
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          sx={{
            borderRadius: 30,
            fontWeight: 400,
            fontSize: '14px',
            textTransform: 'capitalize'
          }}
          variant='contained'
          size='large'
          onClick={onConfirm}
        >
          {'Confirm Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteWorkspaceDialog
