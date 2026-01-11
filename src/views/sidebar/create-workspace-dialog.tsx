// ** React Imports
import { useEffect } from 'react'

// ** MUI Components
import { CircularProgress, Dialog, Divider, FormControl, IconButton, Switch, Typography, Zoom } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useState } from 'react'

// ** Icons Imports
import { Icon } from '@iconify/react'

// ** Local Imports
import { Controller, useForm } from 'react-hook-form'

import CustomButton from '@/components/button'
import { useAuth } from '@/hooks/useAuth'
import { addSprintWorkspace } from '@/services/modules/sprint-workspace'
import { CreateSprintWorkspace } from '@/services/modules/sprint-workspace'
import { addWorkspace } from '@/services/modules/workspace'

interface FormType {
  workspaceName: string
  organizationID: number | string
}

type CreateWorkspaceDialogProps = {
  open: boolean
  onCloseModal: () => void
  refetchWorkspaces: () => void
}

const defaultValues: FormType = {
  workspaceName: '',
  organizationID: 3 // TODO:: parse dynamic value
}

const CreateWorkspaceDialog = ({ open, onCloseModal, refetchWorkspaces }: CreateWorkspaceDialogProps) => {
  // ** Hooks
  const { profile, user } = useAuth()
  const [showPaymentExpiredDialog, setShowPaymentExpiredDialog] = useState(false)
  const [shouldOpenDialog, setShouldOpenDialog] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormType>({ defaultValues })

  const onSubmit = async (values: FormType) => {
    console.log(values, 'value')
    if (profile === 'projects') {
      await addWorkspace(values)
    } else {
      const body = {
        Workspacename: values.workspaceName,
        OrganizationID: values.organizationID,
        LoginuserID: user.id,
      };

      //await CreateSprintWorkspace(body)
      await addSprintWorkspace(values)
    }

    reset()
    onCloseModal()
    refetchWorkspaces()
  }

  const checkPaymentStatus = () => {
    const paymentStatus = localStorage.getItem('paymentStatus')
    console.log(paymentStatus, 'payment status')

    try {
      if (paymentStatus) {
        const parsed = JSON.parse(paymentStatus)
        // If expired, show payment expired dialog
        if (parsed.isExpired === true) {
          setShowPaymentExpiredDialog(true)
          return false
        }
        // Only open if isExpired is false
        return parsed.isExpired === false
      }
      return false
    } catch (error) {
      console.error('Error parsing payment status:', error)
      return false
    }
  }

  // Use useEffect to check payment status when 'open' changes
  useEffect(() => {
    if (open) {
      const canOpen = checkPaymentStatus()
      setShouldOpenDialog(canOpen)
    } else {
      setShouldOpenDialog(false)
      setShowPaymentExpiredDialog(false)
    }
  }, [open])

  const handleClosePaymentDialog = () => {
    setShowPaymentExpiredDialog(false)
    onCloseModal()
  }

  const handleRenewSubscription = () => {
    // Add your navigation logic here
    // Example: router.push('/subscription') or window.location.href = '/subscription'
    console.log('Navigate to subscription page')
    setShowPaymentExpiredDialog(false)
    onCloseModal()
  }

  return (
    <>
      {/* payment */}
      <Dialog
        open={showPaymentExpiredDialog}
        onClose={handleClosePaymentDialog}
        TransitionComponent={Zoom}
        fullWidth
        maxWidth='sm'
      >
        <Box bgcolor={'background.default'}>
          <Box className='flex flex-col items-center justify-center px-8 py-10'>
            {/* Icon */}
            <Box
              className='mb-6 rounded-full flex items-center justify-center'
              sx={{
                width: 80,
                height: 80,
                backgroundColor: 'none',
                color: 'error.main'
              }}
            >
              <Icon icon={'mdi:alert-circle-outline'} fontSize={100} />
            </Box>

            {/* Title */}
            <Typography className='text-2xl font-bold mb-3 text-center'>
              Subscription Expired
            </Typography>

            {/* Message */}
            <Typography className='text-base text-center mb-6' color='text.secondary'>
              Your subscription has expired. Please renew your subscription to continue creating workspaces and accessing premium features.
            </Typography>

            {/* Buttons */}
            <Box className='flex gap-3 w-full'>
              <CustomButton
                circular
                variant='outlined'
                size='large'
                onClick={handleClosePaymentDialog}
                fullWidth
              >
                Cancel
              </CustomButton>
              <CustomButton
                circular
                variant='contained'
                size='large'
                onClick={handleRenewSubscription}
                fullWidth
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                Renew Subscription
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Dialog open={shouldOpenDialog} onClose={onCloseModal} TransitionComponent={Zoom} fullWidth maxWidth='md'>
        <Box bgcolor={'background.default'}>
          <div className='flex flex-1 items-center justify-between px-5 py-4'>
            <Typography className='text-xl font-medium'>Add workspace</Typography>
            <IconButton aria-label='close' onClick={onCloseModal} className='h-10 w-10 rounded-md border border-black'>
              <Icon icon={'mdi:close'} fontSize={24} />
            </IconButton>
          </div>
          <Divider />

          <Box py={2}>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {/* workspace name */}
              <FormControl
                fullWidth
                sx={{
                  paddingX: 5
                }}
              >
                <Typography className='font-semibold text-sm mb-3'>Workspace name *</Typography>

                <Controller
                  name='workspaceName'
                  control={control}
                  rules={{
                    required: 'Please enter a workspace name'
                  }}
                  render={({ field }) => (
                    <TextField
                      autoFocus
                      {...field}
                      error={!!errors?.workspaceName}
                      helperText={errors?.workspaceName?.message}
                      fullWidth
                      id='workspaceName'
                      placeholder='Workspace Name'
                      sx={{ marginBottom: 4 }}
                    />
                  )}
                />
              </FormControl>
              <div className='flex items-center justify-between px-5'>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>Privacy *</Typography>
                  <Typography sx={{ fontWeight: 400, fontSize: '14px' }}>
                    Open
                    <Switch defaultChecked />
                    Closed
                  </Typography>
                </Box>
                <Typography className='font-medium text-sm w-1/2'>
                  <span className='font-bold'>Info:</span> Every team member in the account can join
                </Typography>
              </div>
              <Divider />
              <div className='flex items-center justify-between pt-5 pb-3 px-5 w-full'>
                <CustomButton
                  circular
                  variant='outlined'
                  size='small'
                  onClick={() => {
                    onCloseModal()
                  }}
                >
                  Cancel
                </CustomButton>
                <CustomButton circular variant='contained' size='large' type='submit'>
                  {isSubmitting ? <CircularProgress size={22} color='secondary' /> : 'Create Workspace'}
                </CustomButton>
              </div>
            </form>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}

export default CreateWorkspaceDialog
