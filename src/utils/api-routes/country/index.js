import { country } from '@endpoints/country'
import { callApi } from 'src/utils/api-utils'

export const fetchCountryList = async () => {
  return callApi({ uriEndPoint: country.countryList })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}
