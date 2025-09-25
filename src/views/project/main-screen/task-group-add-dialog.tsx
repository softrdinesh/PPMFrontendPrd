// ** React Imports
import { useEffect } from 'react'

// ** MUI Components
import { CircularProgress, Dialog, Divider, FormControl, IconButton, Switch, Typography, Zoom } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Icons Imports
import { Controller, useForm } from 'react-hook-form'

import IconifyIcon from '@components/icon'

// ** Local Imports
import { useProject } from 'src/context/project-context'

// ** API Imports
import { addTaskGroup, updateTaskGroup } from '@/services/modules/task-group'

type FormFields = {
  groupName: string
  projectID?: number
  TaskGroupID?: string // Add TaskGroupID for update operations
}

interface NewTaskDialogProps {
  open: boolean
  onCloseModal: () => void
  initialGroupName?: string
  isEdit?: boolean
  TaskGroupID?: string // Add TaskGroupID prop for edit mode
}

const NewTaskDialog = ({ open, onCloseModal, initialGroupName = '',isEdit = false, TaskGroupID }: NewTaskDialogProps) => {
  const { project, refetchTaskGroup } = useProject()

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

  const onSubmit = async (values: FormFields) => {
   console.log(values.groupName,TaskGroupID,'vvvv')
    values.projectID = project?.ID
        const body = {
        groupName: values.groupName,
       
      }

      if (TaskGroupID) {
        await updateTaskGroup({ id: TaskGroupID?.toString(), body })
         refetchTaskGroup()
           reset()
           onCloseModal()
      } else {
        await addTaskGroup(values)
           refetchTaskGroup()
             onCloseModal()
      }
    // let res
    // if (isEdit && TaskGroupID) {
    //   // Update existing task group
    //   values.TaskGroupID = TaskGroupID
    //   res = await updateTaskGroup(TaskGroupID)
    // } else {
    //   // Create new task group
    //   res = await addTaskGroup(values)
    // }

    // if (res?.status) {
    //   reset()
    //   refetchTaskGroup()
    //   onCloseModal()
    // }
  }

  useEffect(() => {
    if (open) {
      // Set the value directly when dialog opens
      setValue('groupName', initialGroupName)
    }
  }, [open, initialGroupName, setValue])

  // Additional useEffect to handle initialGroupName changes
  useEffect(() => {
    if (initialGroupName) {
      setValue('groupName', initialGroupName)
    }
  }, [initialGroupName, setValue])

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
        <Typography sx={{ fontWeight: 700, fontSize: '18px' }}>
          {isEdit ? 'Edit Task Group' : 'Create Task Group'}
        </Typography>
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
            <Typography sx={{ fontWeight: 700, fontSize: '12px', marginBottom: 3 }}>Task Group name *</Typography>

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
  )
}

export default NewTaskDialog
