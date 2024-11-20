import { userEndpoint } from '@endpoints/user'
import { callApi } from 'src/utils/api-utils'

export const fetchProfileData = async () => {
  return callApi({ uriEndPoint: userEndpoint.profile })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}
