// ** React Imports
import React, { useState, useContext } from 'react'

// ** MUI Components
import { Divider, FormControl, IconButton, Switch, Typography, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { CircularProgress } from '@mui/material'
import { WorkspaceContext } from 'src/context/workspace-context'

// ** Icons Imports
import IconifyIcon from '@components/icon'

// ** package Imports
import Modal from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'

// ** Local Imports
import { Controller, useForm } from 'react-hook-form'

// ** API Imports
import { addProject } from '@api/project'

const CreateProject = ({ open, onCloseModal }) => {
  const [isLoading, setIsLoading] = useState(false)

  const theme = useTheme()

  const { refetchProjects } = useContext(WorkspaceContext)

  const defaultValues = {
    ProjectName: ''
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({ defaultValues })

  const onSubmit = async values => {
    setIsLoading(true)
    await addProject(values)
    setIsLoading(false)
    reset()
    refetchProjects()
    onCloseModal()
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        showCloseIcon={false}
        styles={{
          modal: {
            borderRadius: 10,
            padding: 0,
            paddingTop: 10,
            paddingBottom: 10,
            width: '40vw'
          }
        }}
        closeIcon={null}
      >
        <Box>
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
            <Typography sx={{ fontWeight: 700, fontSize: '18px', color: 'common.black' }}>
              Create project name
            </Typography>
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
              {/* workspace name */}
              <FormControl
                fullWidth
                sx={{
                  paddingX: 5
                }}
              >
                <Typography
                  sx={{ fontWeight: 700, fontSize: '12px', color: 'common.desaturatedBlue', marginBottom: 3 }}
                >
                  Project name *
                </Typography>

                <Controller
                  name='ProjectName'
                  control={control}
                  rules={{
                    required: 'Please enter a projectName'
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
                      label='Project Name'
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
                  {isLoading ? <CircularProgress size={15} color='inherit' /> : 'Create'}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default CreateProject
