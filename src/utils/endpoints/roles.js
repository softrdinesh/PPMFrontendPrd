import { defaults } from './defaults'

export const roles = {
  list: {
    ...defaults.methods.GET,
    uri: '/api/roles'
  }
}
