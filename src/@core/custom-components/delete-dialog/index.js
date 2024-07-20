// ** React Imports
import { forwardRef, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'
import { Alert, AlertTitle, CircularProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles } from '@mui/styles'

// ** Iconify Icon Imports
import { Icon } from '@iconify/react'

// ** Styles and Styled Components
import * as styles from './styles'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />
})

const useStyles = makeStyles(styles?.makeStylesObject)

export default function DeleteDialog({ open, setOpen, title, description, onConfirm, confirmText, ...props }) {
  // ** Vars
  const theme = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const classes = useStyles()

  // ** States
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    setIsDeleting(true)
    await onConfirm()
    setIsDeleting(false)
  }

  return (
    <Dialog
      classes={{
        paper: theme ? classes.dialogHiddenDrawer : classes.dialog
      }}
      open={open}
      fullWidth
      maxWidth='sm'
      onClose={handleClose}
      TransitionComponent={Transition}
      {...props}
    >
      <DialogContent>
        <Box sx={styles.dialogMainContainerStyle}>
          <Typography sx={styles.mainTitleText}>{title ?? `Are you sure ?`}</Typography>

          <Alert severity='warning' sx={styles.toastMainDiv()}>
            <AlertTitle> {'Warning!'}</AlertTitle>
            {description}
          </Alert>

          {/* Button */}

          <Box sx={styles.buttonsContainer}>
            <Button
              variant='contained'
              onClick={handleConfirm}
              id={'confirm-delete'}
              disabled={isDeleting}
              data-testid={'confirm-delete-button'}
            >
              {isDeleting ? <CircularProgress size={22} color='secondary' /> : confirmText ?? `Delete`}
            </Button>

            <Button
              variant='outlined'
              color='secondary'
              onClick={handleClose}
              id={'cancel-delete'}
              data-testid={'cancel-delete-button'}
            >
              {`Cancel`}
            </Button>
          </Box>
        </Box>
        {/* Close Icon */}
        <IconButton
          aria-label='close'
          onClick={handleClose}
          id='close-icon'
          sx={styles?.closeButtonIcon}
          data-testid={'close-button'}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogContent>
    </Dialog>
  )
}
