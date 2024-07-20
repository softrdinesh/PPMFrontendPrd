// ** React Imports
import React, { useEffect } from 'react'

// ** MUI Components
import {
  CircularProgress,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  Switch,
  Typography,
  useTheme,
  Zoom
} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Icons Imports
import IconifyIcon from '@components/icon'

// ** Local Imports
import { Controller, useForm } from 'react-hook-form'

// ** API Imports
import { addTaskGroup } from '@api/task-group'

const NewTaskDialog = ({ open, onCloseModal, projectID, refetch }) => {
  const theme = useTheme()

  const defaultValues = {
    groupName: ''
  }

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm({ defaultValues })

  const onSubmit = async values => {
    values.projectID = projectID
    const res = await addTaskGroup(values)
    if (res?.status) {
      reset()
      refetch()
      onCloseModal()
    }
  }

  useEffect(() => {
    if (open) {
      reset()
    }
  }, [open, reset])

  return (
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
        <Typography sx={{ fontWeight: 700, fontSize: '18px', color: 'common.black' }}>Create Task Group</Typography>
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
            <Typography sx={{ fontWeight: 700, fontSize: '12px', color: 'common.desaturatedBlue', marginBottom: 3 }}>
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
              <Typography sx={{ fontWeight: 700, fontSize: '12px', color: 'common.desaturatedBlue' }}>
                Privacy *
              </Typography>
              <Typography sx={{ fontWeight: 400, fontSize: '14px', color: 'common.desaturatedBlue' }}>
                Open
                <Switch defaultChecked />
                Closed
              </Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                color: 'common.desaturatedBlue'
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
  )
}

export default NewTaskDialog
