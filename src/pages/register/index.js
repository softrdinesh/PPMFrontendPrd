// ** React Imports
import { Fragment, useCallback, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import { Grid, InputLabel, MenuItem, Select } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Icons Imports

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { fetchCountryList } from '@api/country'
import errorMessage from '@components/error-message'
import { Icon } from '@iconify/react'
import { routes } from '@routes'
import { registerRules } from '@validations/register'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useAuth } from 'src/hooks/useAuth'
import { debounce } from 'lodash'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '30rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const formFieldSize = 'small'

const RegisterPage = () => {
  // ** API Calls
  const { data: countryList } = useQuery('countries', fetchCountryList)

  // ** States
  const [showPassword, setShowPassword] = useState(false)
  const [location, setLocation] = useState()

  // ** Hook
  const { registrationData, setLoading, register } = useAuth()

  // ** Vars
  const rules = registerRules()

  const { setValue, control, handleSubmit } = useForm({
    defaultValues: rules.defaultValues
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const googleRegistration = useCallback(() => {
    if (registrationData) {
      setValue('name', registrationData?.Name)
      setValue('email', registrationData?.Email)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [registrationData, setLoading, setValue])

  const onSubmit = async data => {
    await register({ ...data, ...location })
  }

  const debounceSubmit = debounce(onSubmit, 400)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setLocation({ latitude, longitude })
      },
      error => {
        console.error('Error getting location:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  }, [])

  useEffect(() => {
    googleRegistration()
  }, [googleRegistration, registrationData])

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(7, 9, 7)} !important` }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Adventure starts here 🚀
            </Typography>
            <Typography variant='body2'>Make your app management easy and fun!</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(debounceSubmit)}>
            <Grid container spacing={5}>
              {/* Name */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='name'
                    control={control}
                    rules={rules.name}
                    render={({ field, formState }) => (
                      <TextField
                        {...field}
                        size={formFieldSize}
                        error={Boolean(formState.errors?.name)}
                        label='Name'
                        disabled={registrationData?.Name}
                        helperText={Boolean(formState.errors?.name) && formState.errors?.name?.message}
                        inputProps={{ maxLength: 50, readOnly: registrationData?.Name }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              {/* Email */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='email'
                    control={control}
                    rules={rules.email}
                    render={({ field, formState }) => (
                      <TextField
                        size={formFieldSize}
                        type={'email'}
                        {...field}
                        error={Boolean(formState.errors?.email)}
                        disabled={registrationData?.Email}
                        label='Email'
                        helperText={Boolean(formState.errors?.email) && formState.errors?.email?.message}
                        inputProps={{ maxLength: 50, readOnly: registrationData?.Email }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              {/* Password */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='password'
                    control={control}
                    rules={rules.password}
                    render={({ field, formState }) => (
                      <TextField
                        size={formFieldSize}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={handleClickShowPassword}>
                              <Icon
                                color={formState.errors?.password && 'red'}
                                icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
                                fontSize={'1.25rem'}
                              />
                            </IconButton>
                          )
                        }}
                        {...field}
                        helperText={Boolean(formState.errors?.password) && formState.errors?.password?.message}
                        error={Boolean(formState.errors?.password)}
                        label='Password'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              {/* Country */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='countryID'
                    control={control}
                    rules={rules.countryID}
                    render={({ field, formState }) => (
                      <>
                        <InputLabel size={formFieldSize} error={formState?.errors?.countryID}>
                          Country
                        </InputLabel>
                        <Select
                          size={formFieldSize}
                          {...field}
                          label={'Country'}
                          error={Boolean(formState?.errors?.countryID)}
                        >
                          {countryList?.map(i => (
                            <MenuItem value={i?.ID} key={i?.ID}>
                              <Box display={'flex'} width={'100%'} alignItems={'center'} gap={'15px'}>
                                <Icon icon={`flag:${i?.Code?.toLowerCase()}-4x3`} />
                                <Typography>{i.Name}</Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {errorMessage(formState.errors?.countryID?.message)}
                      </>
                    )}
                  />
                </FormControl>
              </Grid>
              {/* Org Name */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='organizationName'
                    control={control}
                    rules={rules.organizationName}
                    render={({ field, formState }) => (
                      <TextField
                        {...field}
                        size={formFieldSize}
                        error={Boolean(formState.errors?.organizationName)}
                        label='Organization Name'
                        helperText={formState.errors?.organizationName && formState.errors?.organizationName?.message}
                        inputProps={{ maxLength: 50 }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              {/* Org Size */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='organizationSize'
                    control={control}
                    rules={rules.organizationSize}
                    render={({ field, formState }) => (
                      <>
                        <InputLabel size={formFieldSize} error={Boolean(formState?.errors?.organizationSize)}>
                          Organization Size
                        </InputLabel>
                        <Select
                          size={formFieldSize}
                          {...field}
                          label={'Organization Size'}
                          error={Boolean(formState?.errors?.organizationSize)}
                        >
                          <MenuItem value={`1-10`}>1-10</MenuItem>
                          <MenuItem value={`11-25`}>11-25</MenuItem>
                          <MenuItem value={`25+`}>25+</MenuItem>
                        </Select>
                        {errorMessage(formState.errors?.organizationSize?.message)}
                      </>
                    )}
                  />
                </FormControl>
              </Grid>
              {/* Agreement */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={<Fragment>I agree to privacy policy & terms</Fragment>}
                />
              </Grid>
              {/* Submit Button */}
              <Grid item xs={12}>
                <Button fullWidth size='large' type='submit' variant='contained'>
                  Sign up
                </Button>
              </Grid>
              {/* Redirect */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography variant='body2' sx={{ marginRight: 2 }}>
                    Already have an account?
                  </Typography>
                  <Typography variant='body2'>
                    <LinkStyled href={routes.login}>Sign in instead</LinkStyled>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
RegisterPage.guestGuard = true

export default RegisterPage
