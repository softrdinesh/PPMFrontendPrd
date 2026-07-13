// ** MUI Components
import { CircularProgress, Dialog, Divider, FormControl, IconButton, Switch, Typography, Zoom } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Icons Imports
import { Icon } from '@iconify/react'

// ** Local Imports
import { Controller, useForm } from 'react-hook-form'

import CustomButton from '@/components/button'
import { useAuth } from '@/hooks/useAuth'
import { addSprintWorkspace } from '@/services/modules/sprint-workspace'
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
  organizationID: '' // TODO:: parse dynamic value
}

const CreateWorkspaceDialog = ({ open, onCloseModal, refetchWorkspaces }: CreateWorkspaceDialogProps) => {
  // ** Hooks
  const { profile, user } = useAuth()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormType>({ defaultValues })

  const onSubmit = async (values: FormType) => {
    const body = {
      workspaceName: values.workspaceName,
      organizationID: user?.userData.OrganizationID
    }

    if (profile === 'projects') {
      await addWorkspace(body)
    } else {
      await addSprintWorkspace(body)
    }

    reset()
    onCloseModal()
    refetchWorkspaces()
  }

  return (
    <Dialog open={open} onClose={onCloseModal} TransitionComponent={Zoom} fullWidth maxWidth='md'>
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
  )
}

export default CreateWorkspaceDialog
