import { defaults } from './defaults'

export const userEndpoint = {
  profile: {
    ...defaults.methods.GET,
    uri: '/api/profile'
  }
}
