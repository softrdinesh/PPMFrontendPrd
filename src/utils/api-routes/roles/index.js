import { roles } from '@endpoints/roles'
import { callApi } from 'src/utils/api-utils'

export const fetchRolesList = async () => {
  return callApi({ uriEndPoint: roles.list })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      return err
    })
}
