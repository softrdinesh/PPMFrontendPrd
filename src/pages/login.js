// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icons Imports

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import IconifyIcon from 'src/@core/components/icon'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { Controller, useForm } from 'react-hook-form'
import { pattern } from '@patterns'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
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

const LoginPage = () => {
  // ** State
  const [showPassword, setShowPassword] = useState(false)
  const [location, setLocation] = useState()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // ** Hooks
  const auth = useAuth()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({ defaultValues: { email: 'samad.saiyed.ss@gmail.com', password: 'Abc@223133' } })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit = data => {
    const body = {
      ...data,
      ...location
    }
    setIsLoggingIn(true)
  }

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

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          {/* <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box> */}
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <FormControl fullWidth>
              <Controller
                name='email'
                control={control}
                rules={{
                  required: 'Please enter a email',
                  pattern: { value: pattern.email, message: 'Please enter a valid email' }
                }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors?.email)}
                    helperText={Boolean(errors?.email) && errors?.email?.message}
                    fullWidth
                    id='email'
                    label='Email'
                    sx={{ marginBottom: 4 }}
                  />
                )}
              />
            </FormControl>

            {/* Password */}
            <FormControl fullWidth>
              <Controller
                name='password'
                control={control}
                rules={{ required: 'Please enter a password' }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label='Password'
                    value={value}
                    id='auth-login-password'
                    error={Boolean(errors?.password)}
                    onChange={onChange}
                    helperText={Boolean(errors?.password) && errors?.password?.message}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            aria-label='toggle password visibility'
                          >
                            {showPassword ? (
                              <IconifyIcon icon={'mdi:eye-outline'} color={Boolean(errors?.password) && 'red'} />
                            ) : (
                              <IconifyIcon icon={'mdi:eye-off-outline'} color={Boolean(errors?.password) && 'red'} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </FormControl>
            <Box
              sx={{
                mt: 2,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
              }}
            >
              <FormControlLabel control={<Checkbox />} label='Remember Me' />

              {/* <LinkStyled href='/'>Forgot Password?</LinkStyled> */}
            </Box>
            <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} type='submit'>
              Login
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2'>
                <LinkStyled href='/register'>Create an account</LinkStyled>
              </Typography>
            </Box>
            <Divider sx={{ my: 5 }}>or</Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}></Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
