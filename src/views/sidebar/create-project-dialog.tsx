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
import toast from 'react-hot-toast'

// ** Icons Imports
import { Icon } from '@iconify/react'

// ** Local Imports
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'

// ** API Imports

import { addProject } from '@/services/modules/project'
import { WorkspaceContext } from 'src/context/workspace-context'
import SubscriptionExpiredDialog from '@/views/paymentpopup/SubscriptionExpiredDialog'
import { useRazorpayPayment } from '../paymentpopup/useRazorpayPayment'
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
  const { selected, refetchProjects,projects } = useContext(WorkspaceContext)
  const [showPaymentExpiredDialog, setShowPaymentExpiredDialog] = useState(false)
  const [shouldOpenDialog, setShouldOpenDialog] = useState(false)
  const defaultValues = {
    ProjectName: '',
    IsOpen: 1
  }

  // const [isLoading, setIsLoading] = useState(false)
  // const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState("")
  const { profile,user } = useAuth()
  const logoImage = "https://appsuresolutions.netlify.app/assets/header_logo-Bj3Dgdu3.svg" // Replace with your actual logo
<<<<<<< HEAD
  const { isLoading, razorpayLoaded, generateRazorPayOrder } = useRazorpayPayment({
    userId: Number(user?.id),
    onPaymentSuccess: () => {
      const canOpen = checkPaymentStatus()
      setShouldOpenDialog(canOpen)
      setShowPaymentExpiredDialog(false)
    },
    onPaymentFailure: () => {
      const canOpen = checkPaymentStatus()
      setShouldOpenDialog(canOpen)
      setShowPaymentExpiredDialog(true)
    }
  })
=======

>>>>>>> source-link/main
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormValues>({ defaultValues })

  const onSubmit = async (values: FormValues) => {
    // Check if WorkspaceID exists before submitting
    if (!selected?.WorkspaceID) {
      toast.error('No workspace selected. Please select a workspace first.')
      return
    }
    
    values.WorkspaceID = selected?.WorkspaceID

    const res = await addProject(values)

    if (res?.status) {
      reset()
      refetchProjects()
      onCloseModal()
    }
  }

<<<<<<< HEAD
  const checkPaymentStatus = () => {
    const paymentStatus = localStorage.getItem('paymentStatus')
    
    // Projects length 0 -> allow creating one project (no payment popup)
    if ((projects?.length ?? 0) === 0) {
      setShowPaymentExpiredDialog(false)
      return true
    }

    // Projects length >= 1 -> block and show payment popup
    if ((projects?.length ?? 0) >= 1) {
      setShowPaymentExpiredDialog(true)
      return false
    }

    try {
      if (paymentStatus) {
        const parsed = JSON.parse(paymentStatus)
        if (parsed.isExpired === true) {
          setShowPaymentExpiredDialog(true)
          return false
        }
        
        if (parsed.isExpired === false) {
          setShowPaymentExpiredDialog(false)
          return true
        }
        setShowPaymentExpiredDialog(true)
        return false
      }
      setShowPaymentExpiredDialog(false)
      return true
    } catch (error) {
      console.error('Error parsing payment status:', error)
      setShowPaymentExpiredDialog(true)
      return false
    }
  }
=======
  // const checkPaymentStatus = () => {
  //   const paymentStatus = localStorage.getItem('paymentStatus')
    
  //   // Projects length 0 -> allow creating one project (no payment popup)
  //   if ((projects?.length ?? 0) === 0) {
  //     setShowPaymentExpiredDialog(false)
  //     return true
  //   }

  //   // Projects length >= 1 -> block and show payment popup
  //   if ((projects?.length ?? 0) >= 1) {
  //     setShowPaymentExpiredDialog(true)
  //     return false
  //   }

  //   try {
  //     if (paymentStatus) {
  //       const parsed = JSON.parse(paymentStatus)
  //       if (parsed.isExpired === true) {
  //         setShowPaymentExpiredDialog(true)
  //         return false
  //       }
        
  //       if (parsed.isExpired === false) {
  //         setShowPaymentExpiredDialog(false)
  //         return true
  //       }
  //       setShowPaymentExpiredDialog(true)
  //       return false
  //     }
  //     setShowPaymentExpiredDialog(false)
  //     return true
  //   } catch (error) {
  //  //   console.error('Error parsing payment status:', error)
  //     setShowPaymentExpiredDialog(true)
  //     return false
  //   }
  // }
>>>>>>> source-link/main

  // Use useEffect to check payment status when 'open' changes
  useEffect(() => {
    if (open) {
<<<<<<< HEAD
      const canOpen = checkPaymentStatus()
      setShouldOpenDialog(canOpen)
    } else {
      setShouldOpenDialog(false)
      setShowPaymentExpiredDialog(false)
    }
  }, [open, projects?.length])

  const handleClosePaymentDialog = () => {
    setShowPaymentExpiredDialog(false)
    onCloseModal()
  }

  const handleRenewSubscription = () => {
    // Add your navigation logic here
    // Example: router.push('/subscription') or window.location.href = '/subscription'
    setShowPaymentExpiredDialog(false)
    onCloseModal()
  }

  return (
    <>
       <SubscriptionExpiredDialog
        open={showPaymentExpiredDialog}
        onClose={handleClosePaymentDialog}
        onRenew={generateRazorPayOrder}
        isLoading={isLoading}
        razorpayLoaded={razorpayLoaded}
      />

=======
     // const canOpen = checkPaymentStatus()
      setShouldOpenDialog(open)
    } else {
      setShouldOpenDialog(false)
    }
  }, [open, projects?.length])


  return (
    <>
       
>>>>>>> source-link/main
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
                    <Switch checked={field?.value === 1} onChange={e => field?.onChange(e?.target?.checked ? 0 : 1)} />
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
