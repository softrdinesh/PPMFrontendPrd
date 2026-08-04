// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Components
import { CircularProgress, Dialog, Divider, FormControl, IconButton, Switch, Typography, Zoom } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CustomButton from '@/components/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

// ** Icons Imports
import { Controller, useForm } from 'react-hook-form'

import IconifyIcon from '@components/icon'
import { Icon } from '@iconify/react'

// ** Local Imports
import { useProject } from 'src/context/project-context'

// ** API Imports
import { addTaskGroup, updateTaskGroup } from '@/services/modules/task-group'
import { useAuth } from '@/hooks/useAuth'
import { viewProject } from '@/services/modules/project'

type FormFields = {
  groupName: string
  projectID?: number
  TaskGroupID?: string
}

interface NewTaskDialogProps {
  open: boolean
  onCloseModal: () => void
  initialGroupName?: string
  isEdit?: boolean
  TaskGroupID?: string
  projectLength?: any // Add this prop to receive project length
}

const NewTaskDialog = ({ 
  open, 
  onCloseModal, 
  initialGroupName = '', 
  isEdit = false, 
  TaskGroupID,
  projectLength 
}: NewTaskDialogProps) => {
  const { project, refetchTaskGroup } = useProject()
  const [showPaymentExpiredDialog, setShowPaymentExpiredDialog] = useState(false)
  const router = useRouter()
  const { profile, user } = useAuth()
  
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<FormFields>({ 
    defaultValues: {
      groupName: ''
    }
  })

  // Check payment status and workspace count
  const checkPaymentAndWorkspaceStatus = () => {
    try {
      const localStorageData = localStorage.getItem('paymentStatus')
      const workspaceCount = projectLength?.projectlength?.length || 0
      
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData)
        
        // If payment is expired
        if (parsedData.isExpired === true) {
          // Allow only if no workspaces exist (first workspace free)
          if (workspaceCount === 0) {
            setShowPaymentExpiredDialog(false)
            return true
          } else {
            setShowPaymentExpiredDialog(true)
            return false
          }
        }
        
        // If payment is active (isExpired === false)
        if (parsedData.isExpired === false) {
          // Allow creation regardless of workspace count
          setShowPaymentExpiredDialog(false)
          return true
        }
        
        // If payment status is undefined or unexpected
        if (workspaceCount === 0) {
          setShowPaymentExpiredDialog(false)
          return true
        } else {
          setShowPaymentExpiredDialog(true)
          return false
        }
      } else {
        // No payment status found - first time user
        // Allow first workspace creation for free
        if (workspaceCount === 0) {
          setShowPaymentExpiredDialog(false)
          return true
        } else {
          setShowPaymentExpiredDialog(true)
          return false
        }
      }
    } catch (error) {
     // console.error('Error parsing localStorage:', error)
      setShowPaymentExpiredDialog(true)
      return false
    }
  }

  // Check status when dialog opens
  useEffect(() => {
    if (open) {
      const canOpen = checkPaymentAndWorkspaceStatus()
      if (!canOpen) {
        // If cannot open, show payment dialog and close the task dialog
        onCloseModal()
      }
    } else {
      setShowPaymentExpiredDialog(false)
      // Reset form when dialog closes
      reset({ groupName: '' })
    }
  }, [open, reset, onCloseModal, projectLength])

  // Set initial form values when dialog opens with edit mode
  useEffect(() => {
    if (open && initialGroupName) {
      setValue('groupName', initialGroupName)
    }
    // Reset form when dialog opens in create mode
    if (open && !isEdit && !initialGroupName) {
      reset({ groupName: '' })
    }
  }, [open, initialGroupName, setValue, reset, isEdit])

  const onSubmit = async (values: FormFields) => {
    // Check again before submission (in case status changed)
    const canProceed = checkPaymentAndWorkspaceStatus()
    if (!canProceed) {
      toast.error('Please complete payment to create more task groups')
      return
    }

    values.projectID = project?.ID
    
    const body = {
      groupName: values.groupName,
    }

    try {
      if (TaskGroupID) {
        await updateTaskGroup({ id: TaskGroupID.toString(), body })
        refetchTaskGroup()
        reset({ groupName: '' })
        onCloseModal()
        toast.success('Task group updated successfully')
      } else {
        await addTaskGroup(values)
        refetchTaskGroup()
        reset({ groupName: '' })
        onCloseModal()
       // toast.success('Task group created successfully')
      }
    } catch (error) {
     // console.error('Error submitting form:', error)
      toast.error('Failed to save task group. Please try again.')
    }
  }

  const handleClosePaymentDialog = () => {
    setShowPaymentExpiredDialog(false)
  }

  return (
    <>
      {/* Payment Expired Dialog - Optional, you can keep or remove this */}
      {showPaymentExpiredDialog && (
        <Dialog open={showPaymentExpiredDialog} onClose={handleClosePaymentDialog}>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Payment Required
            </Typography>
            <Typography sx={{ mb: 3 }}>
              You have reached the limit of free task groups. 
              {projectLength?.projectlength?.length === 0 
                ? ' Your first task group is free!' 
                : ' Please complete payment to create more task groups.'}
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleClosePaymentDialog}
              sx={{ mr: 2 }}
            >
              Close
            </Button>
          </Box>
        </Dialog>
      )}

      {/* Task Group Dialog */}
      <Dialog
        open={open}
        style={{
          padding: 0
        }}
        onClose={onCloseModal}
        TransitionComponent={Zoom}
        fullWidth
        maxWidth='md'
      >
        <Box
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
          <Typography sx={{ fontWeight: 700, fontSize: '18px' }}>
            {isEdit ? 'Edit Task Group' : 'Create Task Group'}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={() => {
              reset({ groupName: '' })
              onCloseModal()
            }}
            style={{
              height: 35,
              width: 35,
              border: '1px solid ',
              borderRadius: 4
            }}
          >
            <IconifyIcon icon={'mdi:close'} color={`common.black`} fontSize={24} />
          </IconButton>
        </Box>
        <Divider />

        <Box py={2}>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            {/* Task Group Name */}
            <FormControl
              fullWidth
              sx={{
                paddingX: 5
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '12px', marginBottom: 3 }}>
                Task Group name *
              </Typography>

              <Controller
                name='groupName'
                control={control}
                rules={{
                  required: 'Please enter a name for task group'
                }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors?.groupName)}
                    helperText={Boolean(errors?.groupName) && errors?.groupName?.message}
                    fullWidth
                    id='TaskGroupName'
                    placeholder='Task Group Name'
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
              <Box sx={{}}>
                <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>Privacy *</Typography>
                <Typography sx={{ fontWeight: 400, fontSize: '14px' }}>
                  Open
                  <Switch defaultChecked />
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
                  reset({ groupName: '' })
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
                {isSubmitting ? <CircularProgress size={15} color='inherit' /> : isEdit ? 'Update' : 'Create'}
              </Button>
            </Box>
          </form>
        </Box>
      </Dialog>
    </>
  )
}

export default NewTaskDialog
