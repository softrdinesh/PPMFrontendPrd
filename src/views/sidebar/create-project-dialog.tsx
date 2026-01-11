// ** React Imports
import { useContext } from 'react'
import { useEffect } from 'react'

// ** MUI Components
import { CircularProgress, Dialog, Divider, FormControl, IconButton, Switch, Typography, Zoom } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import CustomButton from '@/components/button'

// ** Icons Imports
import { Icon } from '@iconify/react'

// ** Local Imports
import { Controller, useForm } from 'react-hook-form'

// ** API Imports

import { addProject } from '@/services/modules/project'
import { WorkspaceContext } from 'src/context/workspace-context'

type FormValues = {
  ProjectName: string
  IsOpen: number
  WorkspaceID?: number
}

type CreateProjectProps = {
  open: boolean
  onCloseModal: () => void
}

const CreateProject = ({ open, onCloseModal }: CreateProjectProps) => {
  const { selected, refetchProjects } = useContext(WorkspaceContext)
  const [showPaymentExpiredDialog, setShowPaymentExpiredDialog] = useState(false)
  const [shouldOpenDialog, setShouldOpenDialog] = useState(false)
  const defaultValues = {
    ProjectName: '',
    IsOpen: 1
  }

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormValues>({ defaultValues })

  const onSubmit = async (values: FormValues) => {
    values.WorkspaceID = selected?.WorkspaceID

    console.log('values :', values)
    const res = await addProject(values)

    if (res?.status) {
      reset()
      refetchProjects()
      onCloseModal()
    }
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
              Your subscription has expired. Please renew your subscription to continue creating Projects and accessing premium features.
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
      <Box
        bgcolor={'background.default'}
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingX: 5,
          paddingY: 2
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '18px' }}>Create project name</Typography>
        <IconButton
          aria-label='close'
          onClick={onCloseModal}
          style={{
            height: 35,
            width: 35,
            border: '1px solid ',
            borderRadius: 4
          }}
        >
          <Icon icon={'mdi:close'} color={`common.black`} fontSize={24} />
        </IconButton>
      </Box>
      <Divider />

      <Box py={2} bgcolor={'background.default'}>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          {/* workspace name */}
          <FormControl
            fullWidth
            sx={{
              paddingX: 5
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: '12px', marginBottom: 3 }}>Project name *</Typography>

            <Controller
              name='ProjectName'
              control={control}
              rules={{
                required: 'Please enter name of the project'
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  autoFocus
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors?.ProjectName)}
                  helperText={Boolean(errors?.ProjectName) && errors?.ProjectName?.message}
                  fullWidth
                  id='ProjectName'
                  placeholder='Project Name'
                  sx={{ marginBottom: 4 }}
                />
              )}
            />
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingX: 5
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>Privacy *</Typography>
              <Typography sx={{ fontWeight: 400, fontSize: '14px' }}>
                Open
                <Controller
                  name='IsOpen'
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field?.value === 0} onChange={e => field?.onChange(e?.target?.checked ? 0 : 1)} />
                  )}
                />
                Closed
              </Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '14px'
              }}
            >
              <span
                style={{
                  fontWeight: 'bold'
                }}
              >
                Info:
              </span>{' '}
              Project will be visible to everyone in your account
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 2,
              px: 5
            }}
          >
            <Button
              sx={{
                borderRadius: 30,
                fontWeight: 400,
                fontSize: '14px',
                textTransform: 'capitalize'
              }}
              variant='outlined'
              size='small'
              onClick={() => {
                onCloseModal()
              }}
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
              type='submit'
            >
              {isSubmitting ? <CircularProgress size={15} color='inherit' /> : 'Create'}
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog>
    </>
  )
}

export default CreateProject
