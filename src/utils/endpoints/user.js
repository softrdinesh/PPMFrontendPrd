import { defaults } from './defaults'

export const userEndpoint = {
  profile: {
    ...defaults.methods.GET,
    uri: '/api/profile'
  },
  changePassword: {
    ...defaults.methods.PUT,
    uri: '/api/change-password'
  },
  profileUpdate: {
    ...defaults.methods.PUT,
    uri: '/api/profile-update',
    headerProps: {
      'Content-Type': 'multipart-formdata'
    }
  },
  recentActivityPage: {
    ...defaults.methods.GET,
    uri: '/api/user/recent-activity'
  }
}
