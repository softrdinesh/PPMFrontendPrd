// ** React Imports
import React, { useState } from 'react'

// ** MUI Components
import { Dialog, Divider, FormControl, IconButton, Switch, Typography, useTheme, Zoom } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { CircularProgress } from '@mui/material'

// ** Icons Imports
import IconifyIcon from '@components/icon'

// ** Local Imports
import { Controller, useForm } from 'react-hook-form'

// ** API Imports
import { addWorkspace } from '@api/workspace'

const CreateWorkspace = ({ open, onCloseModal, refetchWorkspaces }) => {
  const [isLoading, setIsLoading] = useState(false)

  const theme = useTheme()

  // ** Hooks
  // const auth = useAuth()

  const defaultValues = {
    workspaceName: '',
    organizationID: 3 // TODO:: parse dynamic value
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({ defaultValues })

  const onSubmit = async values => {
    setIsLoading(true)
    await addWorkspace(values)

    setIsLoading(false)
    reset()
    onCloseModal()
    refetchWorkspaces()
  }

  return (
    <Dialog open={open} onClose={onCloseModal} TransitionComponent={Zoom} fullWidth maxWidth='md'>
      <Box bgcolor={'background.default'}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingX: 5,
            py: 4
          }}
        >
          <Typography variant='h6'>Add workspace</Typography>
          <IconButton
            aria-label='close'
            onClick={onCloseModal}
            style={{
              height: 35,
              width: 35,
              border: '1px solid ',
              borderColor: `${theme.palette.common.lightGrayishBlue}`,
              borderRadius: 4
            }}
          >
            <IconifyIcon icon={'mdi:close'} fontSize={24} />
          </IconButton>
        </Box>
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
              <Typography sx={{ fontWeight: 700, fontSize: '12px', marginBottom: 3 }}>Workspace name *</Typography>

              <Controller
                name='workspaceName'
                control={control}
                rules={{
                  required: 'Please enter a workspace name'
                }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors?.workspaceName)}
                    helperText={Boolean(errors?.workspaceName) && errors?.workspaceName?.message}
                    fullWidth
                    id='workspaceName'
                    placeholder='Workspace Name'
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
                  fontSize: '14px',

                  width: 1 / 2
                }}
              >
                <span
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  Info:
                </span>{' '}
                Every team member in the account can join
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
                {isLoading ? <CircularProgress size={22} /> : 'Create Workspace'}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Dialog>
  )
}

export default CreateWorkspace
