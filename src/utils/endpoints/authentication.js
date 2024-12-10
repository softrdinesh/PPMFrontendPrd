import { defaults } from './defaults'

export const authentication = {
  login: {
    ...defaults.methods.POST,
    uri: '/api/login'
  },
  register: {
    ...defaults.methods.POST,
    uri: '/api/signup'
  },

  verifyToken: {
    ...defaults.methods.GET,
    uri: '/api/verify-token'
  },

  refreshToken: {
    ...defaults.methods.POST,
    uri: '/api/get-refresh-token'
  },

  googleLogin: {
    ...defaults.methods.GET,
    uri: '/auth/google/callback'
  },

  googleLogout: {
    ...defaults.methods.POST,
    uri: '/auth/logout'
  },

  googleLoginSuccess: {
    ...defaults.methods.GET,
    uri: '/auth/login/success'
  }
}
