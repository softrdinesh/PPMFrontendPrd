// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Component Imports

// ** Third Party Imports
import toast from 'react-hot-toast'
import OtpInput from 'react-otp-input'

// ** JWT Imports
import jwt from 'jsonwebtoken'

// ** Layout Imports
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Strings and Routes Imports
import { routes } from '@routes'

// ** Api imports
import { verifyEmail, verifyOtp } from 'src/services/login'

// ** Styles and Styled Components Imports
import { CardContent, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import * as styles from '@styles-page/verify-email/styles'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { maxWidth: '35rem' }
}))

const INIT_MINUTE = 0
const INIT_SECONDS = 10

const VerifyEmail = () => {
  // ** Hooks
  const router = useRouter()
  const smBreakpoint = useMediaQuery(theme => theme.breakpoints.down('sm'))

  // ** Vars
  const data = router?.query

  // ** States
  const [email, setEmail] = useState(null)
  const [emailVerify, setEmailVerify] = useState(null)
  const [otp, setOtp] = useState('')

  const [otpValid, setOtpValid] = useState(false)
  const [minutes, setMinutes] = useState(INIT_MINUTE)
  const [seconds, setSeconds] = useState(INIT_SECONDS)

  // ** show email de******@gmail.com
  function obfuscateEmail(email) {
    try {
      const [localPart, domainPart] = email.split('@')

      const obfuscatedLocalPart =
        localPart.charAt(0).toUpperCase() + '*'.repeat(localPart.length - 1) + localPart.charAt(localPart.length - 0)

      return `${obfuscatedLocalPart}@${domainPart}`?.toLocaleLowerCase()
    } catch (error) {
      return 'Invalid Email'
    }
  }

  // ** otp change function
  const handleOTPChange = otpValue => {
    setOtp(otpValue)
    setOtpValid(otpValue?.length === 6)
  }

  // ** reset otp change function
  const handleResendOtp = async () => {
    setOtp('')

    let body = {
      email: emailVerify
    }

    await verifyEmail(body).then(res => {
      if (res.status) {
        setMinutes(INIT_MINUTE)
        setSeconds(INIT_SECONDS)
      }
    })
  }

  //  ** check otp function
  const checkOtp = async () => {
    let body = {
      email: emailVerify,
      otp: otp
    }

    if (otpValid) {
      await verifyOtp(body).then(res => {
        if (res?.status) {
          const base64 = jwt.sign(body, process.env.NEXT_PUBLIC_API_SECRET_KEY, { expiresIn: '7m' })

          router.replace({ pathname: routes.resetPassword, query: { k: base64 } })
        }
      })
    }
  }

  useEffect(() => {
    checkOtp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpValid, router])

  // ** decode email from url
  useEffect(() => {
    if (data && Object.keys(data)?.length != 0) {
      jwt.verify(data.k, process.env.NEXT_PUBLIC_API_SECRET_KEY, (error, decoded) => {
        if (error) {
          if (error?.name === 'TokenExpiredError') {
            toast.error('Timed out')
          }
        } else {
          setEmail(obfuscateEmail(decoded.email))
          setEmailVerify(decoded.email)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, router])

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval)
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  })

  return (
    <>
      <Box height={'100dvh'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Card>
          <CardContent>
            <Box sx={styles.verifyEmailBox}>
              <Typography variant='h5' sx={styles.verifyEmail}>
                {'Verify your email ✉️'}
              </Typography>
              <Typography sx={styles.verifyEmailText}>
                {'We sent a verification code to your register email. Enter the code from the mail in the field below.'}
              </Typography>
              <Typography fontWeight={700} mt={2}>
                {email ?? ''}
              </Typography>
            </Box>
            <Divider />
            <Box sx={styles.otpBox}>
              <OtpInput
                value={otp}
                OTPIsValid={otp.length === 6}
                inputStyle={styles.otpInputBox(smBreakpoint)}
                onChange={handleOTPChange}
                numInputs={6}
                renderInput={(props, index) => <input {...props} data-testid={'otpInput' + index} />}
              />
            </Box>
            <Divider />

            <p style={styles.otpTimerText()}>
              {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </p>

            <Box sx={styles.resendBox}>
              <Typography sx={styles.getMailText}>Didn't get the mail?</Typography>
              <Button
                style={styles.resendText(minutes === 0 && seconds === 0)}
                onMouseDown={handleResendOtp}
                disabled={minutes === 0 && seconds === 0 ? false : true}
                data-testid='resend-button'
              >
                {'Resend'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

VerifyEmail.getLayout = page => <BlankLayout>{page}</BlankLayout>
VerifyEmail.guestGuard = true

export default VerifyEmail
