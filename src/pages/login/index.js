// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

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
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icons Imports

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { authConfig } from '@configs/auth'
import { authentication } from '@endpoints/authentication'
import logoMainDark from '@images/logos/logo-pp-dark.png'
import logoMain from '@images/logos/logo-pp.png'
import { CircularProgress, Grid, useTheme } from '@mui/material'
import { pattern } from '@patterns'
import { routes } from '@routes'
import { debounce } from 'lodash'
import Image from 'next/image'
import { Controller, useForm } from 'react-hook-form'
import IconifyIcon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import { useMediaQuery } from '@mui/material'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '35rem' }
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

const defaultValues = {
  email: process?.env?.NODE_ENV === 'development' ? 'samad.saiyed.ss@gmail.com' : '',
  password: process?.env?.NODE_ENV === 'development' ? 'Abc@223133' : ''
}

const LoginPage = () => {
  // ** State
  const [showPassword, setShowPassword] = useState(false)
  const [location, setLocation] = useState()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const mdEndpoint = useMediaQuery(theme => theme.breakpoints.up('lg'))

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit = async data => {
    const body = {
      ...data,
      ...location
    }
    setIsLoggingIn(true)
    await auth.login(body).catch(err => {
      console.error('ERROR', err)
    })
    setIsLoggingIn(false)
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

  const handleGoogleSignin = () => {
    window?.localStorage?.setItem(authConfig.loginWithGoogle, true)
    const redirectUri = process.env.NEXT_PUBLIC_API_URL + authentication.googleLogin?.uri
    window?.open(redirectUri, '_self')
  }

  const debounceSubmit = debounce(onSubmit, 400)
  const debounceGoogleSignin = debounce(handleGoogleSignin, 400)

  return (
    <Box
      bgcolor={'background.default'}
      height={'100%'}
      sx={{
        backgroundImage: 'url(/images/pages/login-bg.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: mdEndpoint ? window?.innerWidth * 0.7 : window?.innerWidth
      }}
    >
      <Grid container spacing={5} minHeight={'100dvh'}>
        <Grid item xs={12} lg={6} justifySelf={'end'} display={{ xs: 'none', lg: 'flex' }} mt={'45vh'}>
          <Box display={'flex'} justifyContent={'start'} px={20}>
            <Box>
              <Typography variant='h3' fontWeight={800} lineHeight={1.3}>
                LogIn to
              </Typography>
              <Typography variant='h3' fontWeight={800} color={'primary'} lineHeight={1.3}>
                Manage
              </Typography>
              <Typography variant='h3' fontWeight={800} lineHeight={1.3}>
                fantastic thing
              </Typography>
              <Typography variant='h6' fontWeight={800} mt={6}>
                {`If you don’t have an account`}
              </Typography>
              <Typography variant='h6' fontWeight={800}>
                {` you can `}
                <Typography
                  component={Link}
                  href={routes.register}
                  variant='h6'
                  fontWeight={800}
                  color={'primary.main'}
                  sx={{ textDecoration: 'none' }}
                >
                  {`register here`}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6} alignSelf={'center'} justifySelf={{ xs: 'center', lg: 'end' }}>
          <Box display={'flex'} justifyContent={{ xs: 'center', lg: 'end' }} px={{ xs: 0, lg: 20 }}>
            <Card sx={{ zIndex: 1 }}>
              <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
                <Box sx={{ mb: 6 }}>
                  <Box display={'flex'} width={'100%'} justifyContent={'center'} mb={3}>
                    <Box display={'flex'}>
                      <Image
                        src={theme.palette.mode === 'dark' ? logoMainDark : logoMain}
                        alt='PPM-Logo'
                        width={550}
                        height={140}
                        priority
                        style={{ width: '100%', maxWidth: '550px', height: 'auto' }}
                      />
                    </Box>
                  </Box>
                  <Typography variant='body2' textAlign={'center'}>
                    A Warm welcome <br /> to the new era of the project management application{' '}
                  </Typography>
                </Box>
                <form noValidate autoComplete='off' onSubmit={handleSubmit(debounceSubmit)}>
                  {/* Email */}
                  <FormControl fullWidth>
                    <Typography variant='body2' fontWeight={800} mb={1.5}>
                      Email
                    </Typography>
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
                          sx={{ marginBottom: 4 }}
                        />
                      )}
                    />
                  </FormControl>
                  {/* Password */}
                  <FormControl fullWidth>
                    <Typography variant='body2' fontWeight={800} mb={1.5}>
                      Password
                    </Typography>
                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: 'Please enter a password' }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
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
                                    <IconifyIcon
                                      icon={'mdi:eye-off-outline'}
                                      color={Boolean(errors?.password) && 'red'}
                                    />
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
                    <LinkStyled href={routes.forgotPassword}>Forgot Password?</LinkStyled>
                  </Box>
                  <Button fullWidth size='large' variant='contained' type='submit' disabled={isLoggingIn}>
                    {isLoggingIn ? <CircularProgress size={22} /> : 'Login'}
                  </Button>

                  <Divider sx={{ my: 6 }}>
                    <Typography variant='subtitle2' fontWeight={700}>
                      OR LOGIN WITH
                    </Typography>
                  </Divider>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button type='button' className='login-with-google-btn' onClick={debounceGoogleSignin}>
                      Sign in with Google
                    </button>
                  </Box>
                </form>
                {!mdEndpoint && (
                  <Box
                    mt={4}
                    sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
                  >
                    <Typography variant='body2' sx={{ marginRight: 2 }}>
                      Don't have an account?
                    </Typography>
                    <Typography variant='body2'>
                      <LinkStyled href={routes.register}> Sign up</LinkStyled>
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
