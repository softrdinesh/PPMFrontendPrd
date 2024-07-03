import { defaults } from './defaults'

export const authentication = {
  login: {
    ...defaults.methods.POST,
    uri: '/api/login'
  },

  verifyToken: {
    ...defaults.methods.GET,
    uri: '/api/verify-token'
  },

  refreshToken: {
    ...defaults.methods.POST,
    uri: '/api/get-refresh-token'
  },

  mobileNumberVerification: {
    ...defaults.methods.POST,
    uri: '/api/mobile-number-verification'
  },

  mobileOtpVerification: {
    ...defaults.methods.POST,
    uri: '/api/mobile-number-otp-verification'
  },

  emailVerification: {
    ...defaults.methods.POST,
    uri: '/api/email-verification'
  }
}
