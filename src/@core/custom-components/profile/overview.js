import { fetchCountryList } from '@api/country'
import { updateProfile } from '@api/user'
import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  TextField,
  Autocomplete,
  Typography,
  Zoom
} from '@mui/material'
import { getInitials } from '@utils/get-initials'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

const UserDetails = ({ title, value }) => {
  return (
    <Box display={'flex'} alignItems={'center'} gap={2}>
      <Typography fontWeight={600} fontSize={15}>
        {title}:
      </Typography>
      <Typography fontSize={15}>{value}</Typography>
    </Box>
  )
}

const OverviewCard = ({ data, refetch }) => {
  const [open, setOpen] = useState(false)

  return (
    <Card>
      <CardContent>
        <Box display={'flex'} flexDirection={'column'} gap={5}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} pt={8}>
            <Avatar
              variant='rounded'
              sx={{ width: 120, height: 120, boxShadow: theme => theme.shadows[4] }}
              src={data?.ProfilePicture}
            >
              {getInitials(data?.Name)}
            </Avatar>
          </Box>
          <Typography fontSize={17} fontWeight={500} textAlign={'center'}>
            {data?.Name}
          </Typography>
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Typography fontSize={19}>Details</Typography>
            <Divider />
            <UserDetails title={'Name'} value={data?.Name} />
            <UserDetails title={'Email'} value={data?.Email?.toLowerCase()} />
            <UserDetails title={'Country'} value={data?.country?.Name} />
            <UserDetails title={'Address'} value={data?.Address ?? '-'} />
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2}>
            <Button variant='contained' onClick={() => setOpen(true)}>
              Edit
            </Button>
          </Box>
        </Box>
      </CardContent>
      <UpdateProfileDialog open={open} close={() => setOpen(false)} data={data} refetch={refetch} />
    </Card>
  )
}

export default OverviewCard

const UpdateProfileDialog = ({ open, close, data, refetch }) => {
  const { data: countryData, isLoading } = useQuery({ queryKey: ['countries'], queryFn: fetchCountryList })

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isSubmitting }
  } = useForm({
    defaultValues: {
      ProfilePicture: data?.ProfilePicture || null,
      Name: data?.Name || '',
      CountryID: data?.country || null,
      Address: data?.Address || ''
    }
  })

  const onSubmit = async formData => {
    try {
      console.log('formData :', formData)
      const body = new FormData()

      body.append('Name', formData?.Name)
      body.append('CountryID', formData?.CountryID?.ID)
      body.append('Address', formData?.Address)

      if (formData?.ProfilePicture instanceof File) {
        console.log('IS FILE')
        body?.append('ProfilePicture', formData?.ProfilePicture)
      }

      console.log('BODY ', ...body)

      await updateProfile(body)

      close()
      refetch()
    } catch (error) {
      console.log('USER PROFILE UPDATE ERROR :', error)
      refetch()
    }
  }

  useEffect(() => {
    if (open) {
      reset({
        ProfilePicture: data?.ProfilePicture || null,
        Name: data?.Name || '',
        CountryID: data?.country || null,
        Address: data?.Address || ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset, refetch])

  return (
    <>
      <Dialog open={open} onClose={close} TransitionComponent={Zoom} fullWidth maxWidth='sm'>
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Profile Update</DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={5}>
              {/* Image */}
              <Grid item xs={12}>
                {/* Profile Picture */}
                <Controller
                  control={control}
                  name='ProfilePicture'
                  render={({ field }) => (
                    <>
                      <input
                        type='file'
                        accept='.jpg'
                        id='profile-picture'
                        onChange={e => {
                          const file = e.target.files[0]
                          field.onChange(file)
                        }}
                        hidden
                      />

                      {/* Avatar Box */}
                      <Box
                        component='label'
                        htmlFor='profile-picture'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        py={3}
                      >
                        <Box
                          display={'flex'}
                          position='relative'
                          overflow={'hidden'}
                          borderRadius={2}
                          sx={{
                            '&:hover #hover-box-input': {
                              cursor: 'pointer',
                              opacity: '1'
                            }
                          }}
                        >
                          <Avatar
                            variant='rounded'
                            sx={{ width: 120, height: 120, boxShadow: theme => theme.shadows[4], position: 'relative' }}
                            src={field?.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                          >
                            {getInitials(data?.Name || 'User')}
                          </Avatar>
                          <Box
                            position={'absolute'}
                            width={'100%'}
                            height={'100%'}
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            bgcolor={theme =>
                              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
                            }
                            id='hover-box-input'
                            sx={{ opacity: 0 }}
                          >
                            <Icon icon={'mdi:edit-outline'} fontSize={40} color='white' />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  )}
                />
              </Grid>

              {/* Name */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='Name'
                  rules={{
                    required: 'Please enter a name',
                    maxLength: { value: 100, message: 'You cannot enter more than 100 characters' }
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField {...field} label='Name' inputProps={{ maxLength: 100 }} />
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Country */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='CountryID'
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Autocomplete
                        {...field}
                        onChange={(e, value) => {
                          field?.onChange(value)
                        }}
                        loading={isLoading}
                        options={countryData ?? []}
                        renderOption={(props, option) => (
                          <li {...props} key={option.ID}>
                            {option.Name}
                          </li>
                        )}
                        disableClearable
                        renderInput={params => <TextField size='small' fullWidth {...params} label={'Country'} />}
                        getOptionLabel={option => {
                          return option.Name || ''
                        }}
                      />
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='Address'
                  rules={{ maxLength: { value: 200, message: 'You cannot enter more than 200 characters' } }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField
                        multiline
                        maxRows={4}
                        minRows={3}
                        {...field}
                        label='Address'
                        inputProps={{ maxLength: 200 }}
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between' }}>
            <CustomButton variant='contained' color='secondary' onClick={close}>
              Close
            </CustomButton>
            <Button variant='contained' type='submit' disabled={!isDirty || isSubmitting}>
              {isSubmitting ? 'Updating....' : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
