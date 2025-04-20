'use client'

// React Imports
import { useContext, useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Third-party Imports
import type { Theme } from '@mui/material'
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

// Images
import logoMainDark from '@public/images/logos/logo-pp-dark.png'
import logoMain from '@public/images/logos/logo-pp.png'

// Hook Imports
import { pattern } from '@/constants/patterns'
import { routes } from '@/constants/routes'
import { AuthContext } from '@/context/auth-context'
import { authentication } from '@/services/auth/endpoint'
import { authConfig } from '@/configs/authConfig'

const defaultValues = {
  email: process?.env?.NODE_ENV === 'development' ? 'samad.saiyed.ss@gmail.com' : '',
  password: process?.env?.NODE_ENV === 'development' ? 'Abc@223133' : ''
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

type FormFields = {
  email: string
  password: string
  latitude: number
  longitude: number
}

const LoginV2 = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [bgSize, setBgSize] = useState<number | string>('100vw')

  // Form
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormFields>({ defaultValues })

  // Hooks
  const auth = useContext(AuthContext)
  const theme = useTheme()
  const mdEndpoint = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit = async (data: FormFields) => {
    const body = {
      ...data,
      ...location
    }

    await auth.login(body)
  }

  const handleGoogleSignin = () => {
    window?.localStorage?.setItem(authConfig.loginWithGoogle, '1')
    const redirectUri = process.env.NEXT_PUBLIC_API_URL + authentication.googleLogin?.uri

    window?.open(redirectUri, '_self')
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

  useEffect(() => {
    const calculateBgSize = () => {
      setBgSize(mdEndpoint ? (window.innerWidth ? window.innerWidth * 0.7 : '100vw') : window.innerWidth || '100vw')
    }

    // Initial calculation
    calculateBgSize()

    // Recalculate on resize
    window.addEventListener('resize', calculateBgSize)

    return () => window.removeEventListener('resize', calculateBgSize)
  }, [mdEndpoint])

  return (
    <Box
      bgcolor={'background.default'}
      height={'100%'}
      sx={{
        backgroundImage: 'url(/images/pages/login-bg.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: bgSize
      }}
    >
      <Grid container spacing={5} minHeight={'100dvh'}>
        <Grid item xs={12} lg={6} justifySelf={'end'} display={{ xs: 'none', lg: 'flex' }} mt={'45vh'}>
          <Box display={'flex'} justifyContent={'start'} px={20}>
            <Box>
              <Typography className='text-5xl text-textPrimary leading-tight font-bold'>LogIn to</Typography>
              <Typography className='text-5xl leading-tight font-bold text-primary'>Manage</Typography>
              <Typography className='text-5xl text-textPrimary leading-tight font-bold'>fantastic thing</Typography>
              <Typography className='text-2xl text-textPrimary font-bold' mt={6}>
                {`If you don’t have an account`}
              </Typography>
              <Typography className='text-2xl text-textPrimary font-bold'>
                {` you can `}
                <Typography component={Link} href={routes.register} className='text-2xl font-bold text-primary'>
                  {`register here`}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6} alignSelf={'center'} justifySelf={{ xs: 'center', lg: 'end' }}>
          <Box display={'flex'} justifyContent={{ xs: 'center', lg: 'end' }} px={{ xs: 0, lg: 20 }}>
            <Card className='max-w-xl w-full z-10'>
              <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
                <Box sx={{ mb: 6 }}>
                  <Box display={'flex'} width={'100%'} justifyContent={'center'} mb={3}>
                    <Box display={'flex'}>
                      <Image
                        src={theme.palette.mode === 'dark' ? logoMainDark : logoMain}
                        alt='PPM-Logo'
                        width={550}
                        height={100}
                        priority
                        style={{ width: '100%', maxWidth: '550px', height: 'auto' }}
                      />
                    </Box>
                  </Box>
                  <Typography variant='body2' textAlign={'center'}>
                    A Warm welcome <br /> to the new era of the project management application{' '}
                  </Typography>
                </Box>
                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                  <Controller
                    name='email'
                    control={control}
                    rules={{
                      required: 'Please enter a email',
                      pattern: { value: pattern.email, message: 'Please enter a valid email' }
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          type='email'
                          autoFocus
                          fullWidth
                          label='Email'
                          error={!!error}
                          helperText={error?.message}
                        />
                      </FormControl>
                    )}
                  />
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: 'Please enter a password' }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth>
                        <TextField
                          fullWidth
                          {...field}
                          label='Password'
                          error={!!error}
                          helperText={error?.message}
                          type={isPasswordShown ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  size='small'
                                  edge='end'
                                  onClick={handleClickShowPassword}
                                  onMouseDown={e => e.preventDefault()}
                                >
                                  <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />{' '}
                      </FormControl>
                    )}
                  />
                  <div className='flex justify-between items-center flex-wrap gap-x-3 gap-y-1'>
                    <FormControlLabel control={<Checkbox />} label='Remember me' />
                    <Typography href={routes.forgotPassword} className='text-end' color='primary' component={Link}>
                      Forgot password?
                    </Typography>
                  </div>
                  <Button fullWidth variant='contained' type='submit' disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={22} color='secondary' /> : 'LOGIN'}
                  </Button>
                  <Divider className='gap-3 text-textPrimary'>or</Divider>
                  <div className='flex justify-center items-center gap-2'>
                    <Button
                      onClick={handleGoogleSignin}
                      className='text-textPrimary shadow-md'
                      startIcon={<i className='ri-google-fill text-googlePlus' />}
                    >
                      Sign in with Google
                    </Button>
                  </div>
                </form>
                {!mdEndpoint && (
                  <Box
                    mt={4}
                    sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
                  >
                    <Typography variant='body2' sx={{ marginRight: 2 }}>
                      {`Don't have an account?`}
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

export default LoginV2
