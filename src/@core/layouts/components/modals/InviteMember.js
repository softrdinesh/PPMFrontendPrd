import React, { useState } from 'react'

// ** MUI Imports
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
  Zoom,
  TextField
} from '@mui/material'

// ** Custom Imports
import IconifyIcon from '@components/icon'
import { Icon } from '@iconify/react'

// ** Hook Imports
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { useCopyToClipboard } from 'usehooks-ts'

// ** API Imports
import { addWorkspace } from '@api/workspace'

const InviteMember = ({ openInviteModal, setOpenInviteModal }) => {
  const defaultValue = {
    email: '',
    role: ''
  }
  const [isLoading, setIsLoading] = useState(false)

  // ** Hooks
  const [copiedText, copyToClipboard] = useCopyToClipboard()

  const handleClose = () => {
    reset()
    setOpenInviteModal(false)
  }

  const defaultValues = {
    invitations: [defaultValue]
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({ defaultValues })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invitations'
  })

  const onSubmit = async values => {
    setIsLoading(true)
    await addWorkspace(values)

    setIsLoading(false)
    reset()
    handleClose()
  }

  let inviteLink = 'https://figma.com/users/sign_up?invitationId=2690444112...'

  const roleList = [
    {
      value: 1,
      title: 'Admin'
    },
    {
      value: 2,
      title: 'Member'
    },
    {
      value: 3,
      title: 'Viewer'
    }
  ]

  return (
    <Dialog open={openInviteModal} onClose={handleClose} TransitionComponent={Zoom} fullWidth maxWidth='md'>
      <Grid container>
        <DialogContent
          style={{
            padding: 0,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap-reverse'
          }}
        >
          <Grid py={5} lg={9} xs={12} sm={12} px={8}>
            <Box>
              <Typography color={'primary.main'} fontSize={32} fontWeight={600}>
                Invite your teammates
              </Typography>
              <Typography mt={2} variant='subtitle1' fontWeight={400} fontSize={16}>
                Collaborate with your team to get the most out of this WebApp.
              </Typography>
              <Box>
                <Typography mt={3} variant='subtitle1' fontWeight={400} fontSize={14}>
                  Invite with link (anyone with @figr.design email)
                </Typography>
                <Box
                  display={'flex'}
                  sx={{
                    border: '1px solid lightGray',
                    mt: 3,
                    mb: 5
                  }}
                >
                  <Typography p={2} flex={1} fontFamily={'Inter'} fontWeight={400} fontSize={12}>
                    {inviteLink}
                  </Typography>

                  <Button
                    onClick={() => {
                      copyToClipboard(inviteLink)
                    }}
                    startIcon={<Icon icon={'mdi-content-copy'} style={{ marginInline: 2 }} />}
                    sx={{
                      borderLeft: 1,
                      borderRadius: 0,
                      borderColor: 'lightGray',
                      textTransform: 'capitalize'
                    }}
                  >
                    Copy
                  </Button>
                </Box>
              </Box>
              <Box>
                <Typography mt={3} variant='subtitle1' fontWeight={600} fontSize={14}>
                  Invite with email
                </Typography>
                <Box
                  sx={{
                    maxHeight: 150,
                    overflowY: 'auto',
                    borderRadius: 1,
                    padding: 1.5
                  }}
                >
                  {fields.map((item, index) => {
                    return (
                      <Box
                        key={item.id}
                        sx={{
                          flex: 1,
                          display: 'flex',
                          marginBottom: 4
                        }}
                      >
                        <FormControl
                          sx={{
                            flex: 1,
                            flexDirection: 'row',
                            flexWrap: 'wrap'
                          }}
                        >
                          <Controller
                            name={`invitations.${index}.email`}
                            control={control}
                            defaultValue={item.email}
                            rules={{
                              required: 'Please enter an email'
                            }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                autoFocus
                                error={Boolean(errors?.invitations?.[index]?.email)}
                                helperText={
                                  Boolean(errors?.invitations?.[index]?.email) &&
                                  errors.invitations[index].email.message
                                }
                                fullWidth
                                id='email'
                                label='Enter Email'
                                variant='outlined'
                                style={{
                                  backgroundColor: 'common.white',
                                  borderWidth: 0,
                                  paddingBottom: 0,
                                  marginBottom: 0
                                }}
                              />
                            )}
                          />
                        </FormControl>

                        <FormControl
                          sx={{
                            marginLeft: 2,
                            minWidth: 120
                          }}
                        >
                          <Controller
                            name={`invitations.${index}.role`}
                            control={control}
                            defaultValue={item.role}
                            rules={{
                              required: 'Please select a role'
                            }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                error={Boolean(errors?.invitations?.[index]?.role)}
                                displayEmpty
                                variant='outlined'
                                style={{ backgroundColor: 'common.white' }}
                              >
                                {roleList.map(option => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.title}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </FormControl>

                        <IconButton
                          onClick={() => {
                            remove(index)
                          }}
                          sx={{ color: 'error.main', ml: 1 }}
                        >
                          <IconifyIcon icon={'mdi:delete'} />
                        </IconButton>
                      </Box>
                    )
                  })}
                </Box>
                {fields.length < 5 && (
                  <Box>
                    <Button
                      sx={{
                        textTransform: 'capitalize',
                        outline: 'white',
                        mt: 3
                      }}
                      variant='text'
                      size='small'
                      onClick={() => {
                        append(defaultValue)
                      }}
                      startIcon={<Icon icon={'ph:plus'} color='primary.main' />}
                    >
                      {'Add another'}
                    </Button>
                  </Box>
                )}
              </Box>
              <DialogActions sx={{ justifyContent: 'space-between' }}>
                <Button
                  sx={{
                    borderRadius: 30,
                    fontWeight: 400,
                    fontSize: '14px',
                    textTransform: 'capitalize'
                  }}
                  variant='outlined'
                  size='large'
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  sx={{
                    borderRadius: 30,
                    fontWeight: 400,
                    fontSize: '16px',
                    textTransform: 'capitalize'
                  }}
                  variant='contained'
                  size='large'
                  onClick={handleSubmit(onSubmit)}
                >
                  Invite your team
                </Button>
              </DialogActions>
            </Box>
          </Grid>
          <Grid lg={3} xs={12} sm={12}>
            <Box
              height={'100%'}
              sx={{
                backgroundColor: 'common.lightSkyColor'
              }}
            ></Box>
          </Grid>
        </DialogContent>
      </Grid>
    </Dialog>
  )
}

export default InviteMember
