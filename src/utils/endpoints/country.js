import { defaults } from './defaults'

export const country = {
  countryList: {
    ...defaults.methods.GET,
    uri: '/api/country'
  }
}
