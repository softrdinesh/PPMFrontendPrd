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

export const userChangePassword = async body => {
  return callApi({ uriEndPoint: userEndpoint.changePassword, body })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const updateProfile = async body => {
  return callApi({ uriEndPoint: userEndpoint.profileUpdate, body })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const fetchAllRecentActivities = async () => {
  return callApi({ uriEndPoint: userEndpoint.recentActivityPage })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}
